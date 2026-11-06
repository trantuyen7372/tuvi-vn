# Kiểm tra giao diện thực tế — 05/11/2026

Đã chạy bằng Chromium for Testing 156.0.8078.4 qua Playwright, với hồ sơ trình duyệt tạm riêng, trên website local dùng DB demo. Không dùng cookie/hồ sơ Chrome cá nhân, khóa AI, email hoặc tiền thật.

Kết quả: **27 kiểm tra UI đạt**, không ghi nhận lỗi JavaScript hay phản hồi HTTP 5xx trong luồng. Build production cũng đạt. Đã xem trực tiếp ảnh chụp trang chủ desktop/mobile, lá số desktop và bài luận mobile.

## Phạm vi

- Trang chủ: desktop 1440px và kiểm tra không tràn ngang ở 320/390/768px.
- Mobile 390px: đăng nhập quản trị, tạo coupon, FAQ, bài mẫu, nhập ngày sai/đúng, chọn cung, vùng cuộn ngang của lá số, tổng quan tiếng Việt, chọn gói gia đình, mua bằng mã thử, tạo và xem lại bài demo, bốn trang chính sách, đơn chờ thanh toán.
- Sau một bài, gói gia đình còn 4 lượt; tải lại trang không tạo thêm bài.
- Đơn chưa thanh toán vẫn ở trạng thái chờ và không mở bài.

Các độ rộng là mô phỏng responsive trên Chromium, chưa phải kiểm tra Safari/iPhone hoặc thiết bị vật lý. Chưa kiểm thử QR ngân hàng thật, giao dịch PayOS thật, email đến hộp thư hoặc chất lượng bài AI thật.

## Đã chỉnh sau khi xem giao diện

- Thêm nút “Lập lá số miễn phí ngay” đưa thẳng tới form, sửa link lập lá số trên thanh điều hướng.
- Thêm nhãn tên cung và trạng thái chọn để hỗ trợ bàn phím/trình đọc màn hình; tên dài có thể xuống dòng trong ô giữa lá số.
- Thông báo bài demo không còn hiển thị tên biến khóa API. Lời thông báo email tập trung vào việc khách giữ link và nhận hỗ trợ.
- Bộ kiểm thử phân biệt thông báo lỗi của form với route announcer nội bộ Next.js.

## Bằng chứng và chạy lại

- `outputs/ui-review/report.json`: danh sách kiểm tra, phiên bản trình duyệt và kết quả cuối.
- `outputs/ui-review/home-desktop-final.png`: trang chủ desktop sau chỉnh sửa.
- `outputs/ui-review/home-mobile.png`, `chart-mobile.png`, `reading-mobile.png`, `paid-order-mobile.png`, `pending-order-mobile.png`: ảnh toàn trang ở 390px.
- `outputs/ui-review/chart-desktop.png`, `sample-mobile.png`, `admin-mobile.png`: các màn hình còn lại.

Chạy `npx playwright install chromium`, build, khởi động `npm run demo:payments`, rồi `npm run test:ui`. Cần cho phép mở trình duyệt và kết nối localhost trong môi trường thực thi. Không chạy bộ thử này trên máy chủ bán hàng thật.

Đã có bằng chứng UI local; vẫn cần điền cấu hình production, thử giao dịch/email thực tế và kiểm tra trên tên miền HTTPS sau triển khai. Chưa thay đổi VM.
