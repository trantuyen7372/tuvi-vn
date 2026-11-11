# Bảng giá và đo hành trình mua

## Giá đang bán

- 1 lá số: 49.000đ, 1 lượt từ kho nội dung.
- Gia đình: 199.000đ, 5 lượt từ kho nội dung; 39.800đ/lượt, tiết kiệm 46.000đ
  so với mua lẻ 5 lượt ở giá hiện tại.
- Chuyên sâu: 99.000đ, 1 bài được AI biên soạn theo vấn đề và hoàn cảnh.
  Chỉ hiển thị và nhận đơn mới khi có `ANTHROPIC_API_KEY` và không chạy engine demo.

Không dùng giá gạch ngang hoặc phần trăm giảm giá khi chưa có chương trình riêng.
Giá được tính lại ở server lúc tạo đơn, không tin giá phía client. Đơn đã tạo và
các lượt đã mua giữ nguyên số tiền, số lượt; không áp giá mới vào đơn cũ.
Đây là giá thử vận hành, chưa chứng minh được lợi nhuận sau phí và hỗ trợ.

Khách xem được giá, quyền lợi và phần đọc thử trước khi đăng nhập. Chọn gói rồi
đăng nhập sẽ quay lại lá số và lựa chọn gói bằng tham số `goi`. Việc tạo đơn vẫn
yêu cầu tài khoản có email đã xác minh theo bản bảo mật.

## Xem số liệu

Đăng nhập `/quan-tri`, dùng bộ lọc ngày rồi xem **Hành trình mua và doanh thu**.
Các bước đo: vào website → lập lá số → thấy phần đọc thử → thấy bảng giá → tạo đơn
→ thanh toán được xác nhận → mở bài đã hoàn thành. Một bước tính tối đa một lần
trong phiên, không phải một người duy nhất; khách có thể bỏ qua bước hoặc mua nhiều đơn.

Phần hành trình nhóm theo phiên **bắt đầu** trong khoảng ngày đã chọn. Tiền và số
đơn tính riêng theo `paid_at`; hoàn tiền được trừ trên các đơn thuộc khoảng thanh
toán đó, kể cả hoàn ở thời điểm sau. Không lấy số lần bấm nút làm số đơn trả tiền.
Chỉ đơn PayOS đã xác nhận, có số tiền dương, mới vào doanh thu; đơn mô phỏng, lượt
tặng và đơn 0đ bị loại. Các bước thanh toán được ghi khi xử lý giao dịch hợp lệ
hoặc đối soát quản trị; trình duyệt không có quyền gửi sự kiện `purchase`.

Nguồn truy cập được rút gọn thành direct, google, facebook, tiktok, zalo, email
hoặc other, giữ nguồn đầu tiên trong phiên. Khi chia sẻ link có thể dùng:

```text
https://xemtuvionline.vn/?utm_source=facebook
https://xemtuvionline.vn/?utm_source=tiktok
https://xemtuvionline.vn/?utm_source=zalo
```

Chỉ `utm_source` thuộc danh sách trên được phân loại. Không lưu URL nguồn, nội dung
tìm kiếm, tham số tự do hoặc tên chiến dịch. Không có thống kê hồi tố cho lượt
truy cập trước khi bản này được triển khai. Số tiền cũ vẫn tổng hợp từ đơn hàng.

## Quyền riêng tư và giới hạn

Cookie `tuvi_visit`: giá trị ngẫu nhiên, HttpOnly, SameSite=Lax, Secure trên HTTPS,
hết hạn sau 30 phút không có sự kiện. DB chỉ lưu hash của mã phiên, nhóm nguồn,
tên sự kiện và thời gian. Không đưa email, tên, ngày giờ sinh, ghi chú hay token
đơn/bài luận vào payload thống kê. Không tích hợp bên phân tích thứ ba.

Các lượt xem là số liệu từ trình duyệt, có thể thiếu do JavaScript bị tắt, chặn
đo lường hoặc DNT/GPC. Đây không phải số liệu chống gian lận hay bằng chứng quảng
cáo. Thanh toán thật vẫn được tổng hợp khi trình duyệt không đo được.

Đặt `FUNNEL_ANALYTICS_ENABLED=0` trong môi trường server để tắt thu thập. DNT=1 hoặc
Sec-GPC=1 cũng bỏ qua ghi sự kiện. Dữ liệu đo được dọn sau tối đa 90 ngày khi nhận
sự kiện hoặc mở báo cáo; mã phiên cũ trong đơn được bỏ liên kết. Sao lưu có thể
còn bản dữ liệu cũ theo lịch giữ backup. Không dùng việc dọn thống kê để xóa lịch
sử thu chi hoặc ảnh hưởng quyền đọc bài đã mua.

`POST /api/events` chỉ nhận `{event, source}` với danh sách cho phép; trường thừa
bị từ chối. Endpoint kiểm tra Origin và có giới hạn yêu cầu. Tạo đơn, thanh toán
và mở bài chỉ được ghi ở phía server. Báo cáo tổng hợp nằm trong API quản trị có
xác thực. Lỗi thu thập sự kiện không chặn tạo đơn hoặc trả nội dung bài luận.

## Phát hành và kiểm tra

Đọc [hướng dẫn bảo mật](SECURITY.md) về quyền xem theo tài khoản và cấu hình nâng cao.
MFA và khóa backup hiện là tùy chọn, không chặn triển khai khi chưa cấu hình. Bật biến đo lường trong `.env.example`
hoặc để mặc định; không cần tạo tài khoản Analytics. DB tự thêm hai bảng thống kê
và cột `orders.funnel_visit`, không xóa bảng/cột hiện có.

```sh
npm run test:funnel
npm run test:security
npm run test:commerce
npm run build
```

Trên server local mô phỏng, chạy `node scripts/test-revenue-http.mjs`,
`node scripts/test-customers.mjs` và `npm run test:seo` theo đúng chế độ của từng
bài kiểm tra. Không dùng server production cho bài tạo/xóa tài khoản thử.

Tuần đầu: kiểm tra bước nào thiếu dữ liệu hoặc có tỷ lệ thấp, xem phản hồi người
dùng thật rồi thay một yếu tố mỗi lần. Đừng tăng quảng cáo chỉ dựa trên số lượt
vào; doanh thu trên báo cáo chưa trừ phí PayOS, AI, hạ tầng và chi phí hỗ trợ.
