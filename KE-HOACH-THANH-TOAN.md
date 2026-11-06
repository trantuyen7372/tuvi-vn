# Kế hoạch: bán luận giải Tử Vi theo lượt, thanh toán VietQR tự xác nhận

## Trạng thái đã đối chiếu — 06/11/2026

**Kế hoạch tổng thể chưa hoàn tất.** Chủ website đã có và xác nhận tên miền `xemtuvionline.vn`, cho phép triển khai VM, yêu cầu thanh toán làm sau. Phần mô tả/tiến độ cũ bên dưới được giữ làm lịch sử; trạng thái mới ở bảng này được ưu tiên.

| Giai đoạn | Trạng thái hiện tại |
|---|---|
| 1 — Miễn phí/trả phí, đơn hàng, SQLite, lượt, coupon | Đã có mã và kiểm thử; thanh toán đang tắt theo yêu cầu. |
| 2 — PayOS và giao dịch thật | Có tích hợp SDK/webhook và kiểm tra mô phỏng; chưa cấu hình hoặc thử tiền thật, để sau theo yêu cầu. |
| 3 — Quản trị, email, link xem lại | Quản trị/lọc/doanh thu/CSV/coupon/tặng lượt/link và tài khoản đã làm; email có mã nhưng chưa cấu hình gửi thật và chưa xác nhận thư đến hộp thư. Hoàn tiền hiện là ghi nhận thủ công, không tự chuyển tiền ngân hàng. |
| 4 — Chính sách, trình duyệt và bảo vệ truy cập | Có trang chính sách, kiểm tra UI và quyền xem bài. Còn thông tin liên hệ/địa chỉ vận hành, chưa coi là hoàn tất thủ tục kinh doanh. |
| 5 — Tên miền và triển khai | Đã có tên miền; ứng dụng, vhost riêng, systemd và backup đã cài VM. DNS chưa phân giải IPv4, chưa cấp HTTPS/mở public; thủ tục thông báo/công bố chưa hoàn tất. |
| 6 — Gói vận hạn riêng, cổng khác/quảng cáo | Hạng mục tương lai, chưa triển khai. |

Ngoài kế hoạch ban đầu đã hoàn thiện tài khoản khách, hồ sơ/lịch sử/đổi mật khẩu/xóa dữ liệu, bài luận v2 có liên kết cung và vận hạn, sửa menu theo phiên đăng nhập. Xem `reports/READING-NAVIGATION-V2.md` và `reports/READING-UPGRADE.md`.

Kiểm tra trực tiếp VM đợt đối chiếu này: ứng dụng và timer backup active; đủ 924 tháng dữ liệu. Preflight live chưa đạt: thiếu `RESEND_API_KEY`, `MAIL_FROM`, `OPERATOR_ADDRESS`, `SUPPORT_EMAIL`. Thanh toán vẫn tắt. Cần quyền/cấu hình quản lý DNS và email/thông tin vận hành để hoàn tất phần mở website công khai; không cần bật Pay để hoàn tất bản trải nghiệm.

Mục tiêu: khách xem lá số miễn phí, trả tiền để mở bản luận giải AI đầy đủ. Thanh toán tự xác nhận, bạn quản lý đơn hàng và doanh thu. Làm trên chính web Next.js hiện có (không dùng Magento).

## 1. Sản phẩm và giá (đề xuất, bạn chỉnh được)
| Gói | Nội dung | Giá gợi ý |
|---|---|---|
| Miễn phí | Lập lá số, cách cục, sao cơ bản, trích cổ thư | 0đ |
| Luận giải 1 lá số | Bản luận giải đầy đủ 1 lá số | 99.000đ (niêm yết 129.000đ) |
| Gói gia đình | 5 lượt luận giải (dùng cho nhiều lá số) | 299.000đ (niêm yết 449.000đ) |
| Vận hạn năm (làm sau) | Luận giải vận hạn một năm cho 1 lá số | 29.000đ |
Giá và tên gói đặt trong một file cấu hình, đổi không cần sửa code chỗ khác.

## 2. Luồng khách hàng
1. Khách nhập ngày giờ sinh, giới tính, xem lá số và phần miễn phí.
2. Bấm "Xem luận giải đầy đủ": chọn gói, nhập email (hoặc số điện thoại Zalo) để nhận lại kết quả.
3. Hệ thống tạo đơn, hiện mã QR VietQR kèm nội dung chuyển khoản duy nhất (mã đơn).
4. Khách chuyển khoản. Cổng thanh toán báo về (webhook), đơn chuyển sang "đã thanh toán", luận giải tự mở và chạy.
5. Kết quả lưu theo email và đường link riêng, khách xem lại không mất thêm tiền; gửi bản sao qua email.

## 3. Kiến trúc
- Giữ Next.js (cổng 3100). Thêm cơ sở dữ liệu: bắt đầu bằng SQLite cho nhanh, chuyển Postgres khi có nhiều khách.
- Bảng chính: `orders` (mã đơn, gói, số tiền, trạng thái, email, thời gian), `credits` (số lượt còn lại theo email), `readings` (kết quả luận giải, link riêng), `payments` (giao dịch nhận từ cổng, dùng để đối soát), `coupons` (mã giảm giá, thay cho `TUVI_CODES`).
- Cổng thanh toán: **PayOS** (khuyên dùng, có API và webhook, tạo QR theo đơn, phí thấp) hoặc **SePay/Casso** (đọc biến động số dư ngân hàng, tự khớp nội dung chuyển khoản). Chọn một, viết lớp trừu tượng để đổi được.
- Chống gian lận: kiểm tra chữ ký webhook, kiểm tra đúng số tiền và đúng mã đơn, mỗi giao dịch chỉ xử lý một lần, đơn hết hạn sau 30 phút.
- Chi phí AI: mỗi lần luận giải tốn tiền API, nên chỉ chạy sau khi đơn đã thanh toán; giới hạn số lần thử lại; ghi lại chi phí mỗi lá số để biết lãi lỗ.

## 4. Trang quản trị (cho bạn)
Bảo vệ bằng đăng nhập riêng. Có: danh sách đơn (lọc theo trạng thái, ngày), doanh thu theo ngày/tháng, chi phí AI so với doanh thu, hoàn tiền / tặng lượt thủ công, tạo mã giảm giá, xem kết quả của từng đơn khi khách khiếu nại, xuất CSV cho kế toán.

## 5. Pháp lý và tin cậy
- Trang: Điều khoản sử dụng, Chính sách bảo mật (có dữ liệu ngày giờ sinh và email), Chính sách hoàn tiền, Giới thiệu và liên hệ. Ghi rõ nội dung mang tính tham khảo, giải trí, không thay thế tư vấn.
- Đăng ký thông báo website thương mại điện tử với Bộ Công Thương (online.gov.vn) khi đã có tên miền; gắn biểu tượng "Đã thông báo" ở chân trang.
- Hộ kinh doanh hoặc công ty để xuất hoá đơn: bạn cần quyết định pháp nhân nhận tiền. Cổng PayOS/SePay cần tài khoản ngân hàng đúng tên pháp nhân đó.
- Chân trang giữ dòng ghi nguồn dữ liệu CC BY 4.0.

## 6. Các giai đoạn
| GĐ | Việc | Ước tính |
|---|---|---|
| 1 | Tách phần miễn phí / trả phí; đơn hàng + SQLite; dùng mã giảm giá để bạn tự thử | 1–2 ngày |
| 2 | Nối PayOS (hoặc SePay) ở môi trường thử, thanh toán thử bằng tiền thật số nhỏ | 1–2 ngày |
| 3 | Trang quản trị, email gửi kết quả, trang xem lại bằng link | 1–2 ngày |
| 4 | Trang pháp lý, thử trình duyệt toàn bộ luồng, kiểm tra bảo mật | 1 ngày |
| 5 | Mua tên miền, deploy lên VM Oracle (vhost riêng, systemd, Let's Encrypt), thông báo Bộ Công Thương | 1 ngày + thời gian chờ duyệt |
| 6 (sau) | Gói vận hạn năm, tích hợp MoMo/VNPay, thử quảng cáo nếu lượng truy cập đủ lớn | tuỳ |

## 7. Việc cần bạn quyết / cung cấp
1. Đồng ý bảng giá ở mục 1 (hoặc sửa).
2. Pháp nhân nhận tiền và tài khoản ngân hàng; chọn PayOS hay SePay (tôi khuyên PayOS).
3. Mua tên miền xemtuvionline.vn.
4. API key Anthropic dùng cho site (tách khỏi key khác để theo dõi chi phí).
5. Cho phép deploy lên VM khi tới giai đoạn 5.
6. Email gửi thư (dùng SMTP của tên miền hoặc dịch vụ như Brevo/Resend).

## 8. Rủi ro cần lưu ý
- Chi phí AI mỗi lá số có thể vượt giá nếu prompt dài: phải đo trước khi chốt giá.
- Khách chuyển sai nội dung/sai số tiền: cần màn hình "đối soát thủ công" trong trang quản trị.
- Dữ liệu cá nhân (ngày giờ sinh, email): lưu tối thiểu, có đường xoá theo yêu cầu.
- Kết quả AI có thể sai hoặc phản cảm với một số chủ đề (sức khoẻ, tuổi thọ): cần lời cảnh báo và bộ lọc trong prompt.

## Tiến độ triển khai local — 05/11/2026

Đã làm đơn hàng/SQLite, gói giá, coupon, lượt, lớp PayOS, webhook xác minh chữ ký, quản trị, kết quả lưu bền vững, email Resend và trang chính sách. Build và 33 kiểm tra nghiệp vụ/HTTP đạt. Hướng dẫn: `THANH-TOAN-README.md`.

Giai đoạn 2 mới kiểm chứng bằng giao dịch mô phỏng và SDK, chưa thử tiền thật. Email và AI thật chưa chạy do thiếu khóa. Giai đoạn 4 còn kiểm thử UI trình duyệt: công cụ Chrome/native bị lỗi kết nối. Giai đoạn 5 chưa triển khai; vẫn cần tên miền, tài khoản và sự đồng ý của chủ website. Chưa gắn biểu tượng Đã thông báo.
