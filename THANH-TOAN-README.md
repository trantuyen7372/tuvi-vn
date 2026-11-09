# Thanh toán và quản trị Tử Vi

## Cập nhật email — 09/11/2026

Mặc định cấu hình mới dùng Gmail `xemtuvionlinevn@gmail.com` để gửi xác minh, khôi phục và bài luận; Reply-To về cùng địa chỉ hỗ trợ. Dùng Mật khẩu ứng dụng Google trong `SMTP_PASSWORD`, không dùng mật khẩu đăng nhập Gmail. Xem [cấu hình email](deploy/EMAIL.md). Resend bên dưới là tuỳ chọn tương thích khi chọn `MAIL_PROVIDER=resend`; không cần Resend khi dùng Gmail. Chưa cấu hình mật khẩu ứng dụng hoặc thử email thật trong đợt cập nhật này.

## Đã triển khai

- Gói 1 lượt 99.000đ (niêm yết 129.000đ) và 5 lượt 299.000đ (niêm yết 449.000đ); sửa giá/tên tại `lib/commerce/config.ts`. Hết đợt khuyến mại thì đặt `price` bằng `listPrice`.
- SQLite: đơn hàng, số lượt theo email và đơn, bài luận, giao dịch, mã giảm giá, phiên quản trị, chi phí token và nhật ký thao tác.
- Link riêng 256 bit cho đơn và bài luận. Email đơn thuần không cấp quyền sử dụng lượt của người khác.
- PayOS: tạo link và QR theo đơn, kiểm tra chữ ký qua SDK chính thức, khớp mã đơn/link/số tiền/VND, chống xử lý trùng, thời hạn 30 phút. Giao dịch bất thường được lưu để đối soát. Trang quay về không tự mở lượt.
- Chỉ tạo bài sau khi có quyền đã thanh toán/ưu đãi; một bài chỉ trừ một lượt. Lưu kết quả bền vững để xem lại. Có giới hạn thử lại và khóa chạy đồng thời; tài liệu tham khảo gửi AI được giới hạn độ dài.
- Quản trị tại `/quan-tri`: đăng nhập, lọc đơn/ngày, doanh thu ngày/tháng, thống kê token và chi phí ước tính, mã giảm giá, tặng lượt, đối soát, xem kết quả, xuất CSV, gửi lại email và xóa dữ liệu cá nhân.
- Gửi bản sao qua Resend nếu được cấu hình; lỗi gửi thư không làm mất bài đã lưu. Không tự gửi thư thật trong môi trường thử.
- Trang Điều khoản, Bảo mật, Hoàn tiền, Giới thiệu/liên hệ; giữ nguồn dữ liệu CC BY 4.0. Chưa gắn biểu tượng Bộ Công Thương vì chưa có xác nhận đăng ký.

## Chạy bản thử an toàn

Cần Node >=22.15, có SQLite và zstd tích hợp.

```bash
npm install
npm run build
npm run demo:payments
```

Mở `http://localhost:3100`. Quản trị ở `/quan-tri`; mật khẩu thử được tạo trong `storage/demo-credentials.json`. Script chỉ nghe trên 127.0.0.1, dùng `storage/payment-demo.sqlite`, xóa khóa AI/email/PayOS khỏi môi trường tiến trình. Mật khẩu và dữ liệu thử không được đưa vào Git.

Để thử: đăng nhập quản trị, tạo mã giảm 100% có số lượt dùng hữu hạn; lập lá số, chọn gói, nhập email thử và mã đó. Đơn mở miễn phí, bản luận là văn bản demo được ghi rõ, không phải kết quả gọi AI thật. Hoặc đặt đơn thử không mã rồi bấm **Xác nhận đơn thử** trong quản trị. Không chuyển khoản cho đơn thử.

## Cấu hình nhận tiền thật

Điền `.env.local` theo `.env.example`, giữ dữ liệu Việt đang có. Không đưa khóa lên Git hoặc gửi trong đường link:

- `SITE_URL`: tên miền HTTPS thực tế.
- `ADMIN_PASSWORD`: mật khẩu riêng tối thiểu 12 ký tự.
- `PAYMENT_PROVIDER=payos`, bộ `PAYOS_CLIENT_ID`, `PAYOS_API_KEY`, `PAYOS_CHECKSUM_KEY` của kênh nhận tiền.
- `ANTHROPIC_API_KEY`, `TUVI_MODEL`: tài khoản/model thực tế có quyền dùng.
- `RESEND_API_KEY`, `MAIL_FROM`: địa chỉ gửi thuộc tên miền đã xác minh trên dịch vụ thư.
- `OPERATOR_NAME`, `OPERATOR_ADDRESS`, `OPERATOR_TAX_ID`, `SUPPORT_EMAIL`: thông tin vận hành cần duyệt và bổ sung theo thực tế.
- `AI_INPUT_VND_PER_MILLION`, `AI_OUTPUT_VND_PER_MILLION`: đơn giá thực tế để ước tính chi phí. Chưa biết giá thì để trống, quản trị hiển thị các lần chưa tính được phí; số liệu không thay thế hóa đơn API.
- `TUVI_DB_PATH`: SQLite ở ổ đĩa bền vững, ngoài public; cần sao lưu SQLite bằng cơ chế backup nhất quán, bảo vệ cả bản sao lưu.

Đăng ký webhook trong kênh PayOS: `https://ten-mien/api/payments/payos`. Cần thử một giao dịch thực tế được chủ tài khoản cho phép trước khi mở bán. Tạo đơn thật hiện bị chặn nếu thiếu PayOS, khóa AI, tên đơn vị, email hỗ trợ hoặc URL HTTPS.

`npm start` chạy cổng 3100. Khởi động lại sau khi đổi biến môi trường. Không dùng `demo:payments` trên máy chủ bán hàng. Không ghi access log có đầy đủ token trong URL riêng ở reverse proxy; không đưa DB hoặc dữ liệu cá nhân vào bản build công khai.

## Đối soát và hỗ trợ

- **Ghi nhận đã hoàn tiền** chỉ là ghi sổ và khóa lượt còn lại. Chủ tài khoản phải chuyển khoản hoàn thực tế bên ngoài rồi mới ghi nhận, không có API hoàn tiền tự động.
- Chấp nhận giao dịch chờ đối soát yêu cầu đúng mã đơn/số tiền và lý do; giao dịch sai số tiền cần làm rõ/hoàn ngoài hệ thống, không tự coi là đã nhận đủ.
- Bài lỗi có tối đa 3 lần thử; sau lần lỗi cuối, lượt được trả lại. Tổng lần xử lý của đơn cũng được giới hạn để tránh gọi API vô hạn; cần hỗ trợ thủ công khi đạt trần.
- Chi phí được ghi khi API trả về usage; lỗi mạng không trả usage không cho biết chính xác chi phí nhà cung cấp. Chi phí token hiển thị là ước tính và chưa tính mọi khoản khác như thuế, phí thanh toán hoặc email.
- Xóa dữ liệu cá nhân giữ lại số tiền/trạng thái và nhật ký kế toán nhưng xóa email, ngày sinh và nội dung bài trong DB hoạt động. Quy trình bản sao lưu phải được đơn vị vận hành thực hiện riêng.

## Kiểm thử và phần còn chờ

`npm run test:commerce`: 16 kiểm tra với DB tạm, gồm chữ ký giả, sai số tiền/link, webhook lặp, quá hạn, trừ lượt, coupon và SQLite integrity.

Khi bản thử đang chạy: `node scripts/test-commerce-http.mjs` chạy 26 kiểm tra HTTP, gồm đăng nhập/CSRF, hai yêu cầu đồng thời, lưu/xem lại, chặn endpoint mã cũ, tặng lượt, hoàn tiền, CSV. Kết quả ở `reports/payment-local-test.json`.

Build, 42 kiểm tra nghiệp vụ/HTTP và 27 kiểm tra UI đã đạt. UI đã được thử bằng Chromium riêng qua Playwright sau khi chủ website cho phép, gồm desktop và responsive 320/390/768px. Báo cáo: `reports/UI-REVIEW.md`; ảnh và dữ liệu kiểm tra ở `outputs/ui-review/`. Không coi kết quả mô phỏng Chromium là kiểm thử trên mọi điện thoại hoặc Safari.

Chưa thử nhận tiền hoặc gửi email thật, chưa đo chi phí bằng khóa AI thật, chưa deploy và chưa làm thủ tục/tên miền. Các bước này chờ thông tin tài khoản, nội dung pháp lý được chủ website duyệt và cho phép triển khai. Không thay đổi các site Magento/velofront hoặc VM.

Tài liệu tích hợp đã đối chiếu: [SDK PayOS](https://payos.vn/docs/sdks/back-end/node/), [webhook PayOS](https://payos.vn/docs/du-lieu-tra-ve/webhook/), [idempotency email Resend](https://resend.com/changelog/idempotency-keys).

## Cải thiện sau đối chiếu đối thủ

Đã thêm trang đọc thử, tổng quan miễn phí, bảng giá/FAQ, nhãn nhập liệu và bố cục cuộn trên màn hình nhỏ. Quản trị có thể cấp lại link đơn sau xác minh khách; link cũ mất hiệu lực. Đã sửa trả lượt khi tiến trình AI bị ngắt, khóa tiến trình cũ và tách lỗi email khỏi bài đã lưu. Xem `reports/DOI-CHIEU-DOI-THU.md`. Kiểm tra trước triển khai bằng `node scripts/preflight.mjs` hoặc `--live`; cấu hình máy chủ mẫu ở `deploy/README.md`.

## Cập nhật: tài khoản khách và bản trải nghiệm (ưu tiên phần này)

Đã có đăng ký/đăng nhập khách, lưu lá số, lịch sử bài riêng, xác minh email/reset mật khẩu và xóa tài khoản. Xem `reports/CUSTOMER-RELEASE.md`. Chạy `npm run preview:customers` để dùng engine dataset và tắt thu tiền. `npm run demo:payments` chỉ còn dùng cho hồi quy thanh toán giả lập, không phải chế độ đưa khách trải nghiệm lời luận riêng. Người dùng đã xác nhận PayOS làm sau.

Không tự dùng một khóa API kế thừa để thay cho cấu hình: chọn rõ `READING_ENGINE=dataset` hoặc `anthropic`; mặc định là dataset. Engine demo chỉ dùng khi chế độ mock được bật rõ ràng.
