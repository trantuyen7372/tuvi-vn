# Tài khoản và luận giải riêng — 05/11/2026

Theo yêu cầu mới: tên miền xemtuvionline.vn; phần thu tiền/PayOS để sau. `PAYMENTS_ENABLED=0`, engine `dataset`.

## Đã làm và kiểm chứng

- Đăng ký/đăng nhập khách tại `/dang-ky`, `/dang-nhap`, tài khoản tại `/tai-khoan`.
- Mật khẩu scrypt có salt, session ngẫu nhiên 256 bit lưu hash, cookie HttpOnly; giới hạn đăng nhập theo email và theo IP của proxy tin cậy.
- Lưu hồ sơ ngày giờ sinh, xem lại bài trên nhiều thiết bị, quản lý lượt, đổi mật khẩu và xóa dữ liệu cá nhân.
- Xác minh email và khôi phục mật khẩu dùng token một lần có hạn; reset thu hồi mọi phiên cũ. Tài khoản chưa xác minh không được nhận các đơn khách vãng lai theo email.
- Lời luận hiện lấy từ đúng bản ghi ngày/giờ/giới tính trong kho Việt hóa; không còn dùng cùng bài mẫu cho mọi khách. Các phần đại hạn/năm mô tả dữ liệu an sao và ghi rõ giới hạn, không giả làm dự báo đầy đủ. Phần sức khỏe không dùng lời phán bệnh/tuổi thọ.
- Bài dài có mục lục và định dạng Markdown an toàn; bỏ HTML và ảnh từ nội dung luận.
- Khi tắt thu tiền, trang chủ/luồng xem bài không mời chuyển khoản và API tạo đơn bị khóa. Tài khoản mới có 3 lượt trải nghiệm theo cấu hình; bài đã lưu không dùng thêm lượt.
- 26 kiểm tra HTTP mới cho tài khoản/quyền riêng tư/bài riêng đạt, cùng 10 kiểm tra Chromium cho luồng đăng ký tới đọc bài và khôi phục mật khẩu. 16 kiểm tra nghiệp vụ cũ tiếp tục đạt. Kết quả ở `customer-tests.json`, ảnh tại `outputs/customer-ui/`.

## VM Oracle

Đã kiểm tra và cài runtime Node 24.22.2 ARM64 riêng tại `/opt/tuvi-node`, đối chiếu SHA256 từ nodejs.org. Không thay runtime khác.

Ứng dụng nằm ở `/srv/tuvi-vn`, service `tuvi-vn.service` chỉ nghe 127.0.0.1:3100. Có lịch backup `tuvi-vn-backup.timer`, đã chạy backup kiểm tra. Bộ dữ liệu đủ 924 tháng được nén lại khoảng 384 MiB và đối chiếu nội dung giải nén nguyên vẹn; bản gốc local không bị sửa.

Build trên Linux/Node 24 đạt. Smoke test trên VM đã kiểm chứng đăng ký, phiên thật không lộ link email demo, lời luận riêng, trừ lượt và xóa dữ liệu thử. Health trả ok.

Vhost riêng hiện chỉ có trang chờ HTTPS trên HTTP; kiểm tra trả 503. nginx -t đạt; không sửa vhost Magento/velofront. Không bật đăng nhập qua HTTP công khai.

## Còn chờ thông tin bên ngoài

- DNS A của @ và www phải trỏ tới 138.2.81.196. Lần kiểm tra hiện tại chưa có IPv4 cho tên miền nên chưa cấp chứng chỉ HTTPS hoặc mở website chính thức.
- Cần cấu hình dịch vụ thư (Resend/SMTP theo lựa chọn) và thông tin hỗ trợ/đơn vị vận hành. Mã xác minh và khôi phục đã chạy trong môi trường thử; chưa có bằng chứng email thật đến hộp thư.
- Thu tiền vẫn tắt theo yêu cầu; chưa thử tiền thật hoặc cam kết chất lượng một dịch vụ trả phí. Chưa làm thủ tục công bố/đăng ký thay cho chủ website.

Tài khoản demo khách và lá số người dùng nhập chỉ ở DB local riêng; không chuyển DB demo hoặc mật khẩu demo lên VM. Chi tiết truy cập local ở các file riêng trong storage, không đưa vào Git.
