# Email xác minh qua Gmail

Địa chỉ gửi và nhận hỗ trợ: **xemtuvionlinevn@gmail.com**. Thư xác minh, khôi phục mật khẩu và bài luận gửi đến email của từng khách. Thư khách trả lời chuyển về Gmail hỗ trợ; không tự gửi bản sao dữ liệu khách vào hộp thư hỗ trợ.

## Cấu hình gửi thật

1. Đăng nhập đúng Gmail trên, bật Xác minh 2 bước của Google.
2. Tạo Mật khẩu ứng dụng tại https://myaccount.google.com/apppasswords, đặt tên riêng cho website. Nếu không có tuỳ chọn này, xem điều kiện ở [hướng dẫn Google](https://support.google.com/accounts/answer/185833?hl=vi).
3. Sửa `.env.local` riêng trên server, quyền `600`. Không commit file này hoặc dán mật khẩu vào báo cáo/lệnh lưu trong shell history.

```dotenv
SITE_URL=https://xemtuvionline.vn
MAIL_PROVIDER=gmail
SMTP_USER=xemtuvionlinevn@gmail.com
SMTP_PASSWORD=
MAIL_FROM="Xem Tử Vi Online <xemtuvionlinevn@gmail.com>"
SUPPORT_EMAIL=xemtuvionlinevn@gmail.com
```

Điền Mật khẩu ứng dụng vào `SMTP_PASSWORD` bằng trình soạn thảo trên server. Website bỏ khoảng trắng ngăn nhóm ký tự của mật khẩu ứng dụng. Không dùng mật khẩu đăng nhập Gmail thông thường.

4. Cài dependency bằng `npm ci`, chạy `npm run build`, rồi khởi động lại dịch vụ. Updater preview cũ cố ý từ chối khi lockfile đổi; đợt này thêm Nodemailer, cần cài dependency trước khi chạy bản mới. Chưa triển khai server trong đợt này.
5. Dùng email do chủ website kiểm soát để đăng ký thử trên tên miền HTTPS. Trước xác minh có 0 lượt; sau xác minh có 1 lượt. Thử gửi lại thư và khôi phục mật khẩu; kiểm tra thư thực sự đến hộp thư, không chỉ thông báo trên website.

Gmail dùng `smtp.gmail.com:465`, TLS và xác thực. Website không đọc hộp thư Gmail. Địa chỉ hỗ trợ được dùng cho liên hệ/Reply-To; nhận thư do Gmail đảm nhiệm. Gmail có giới hạn gửi, xem [thông số SMTP chính thức](https://developers.google.com/workspace/gmail/imap/imap-smtp).

## Hành vi

- Email tiếng Việt có HTML, văn bản thuần, nút xác nhận và đường link thay thế.
- Trang tài khoản hiển thị trạng thái gửi lưu trên server. Gửi lỗi vẫn giữ tài khoản và cho gửi lại; không cấp lượt trước xác minh.
- Gửi lại tối đa 3 lần/tài khoản/giờ. Link xác minh dùng một lần, hết hạn sau 24 giờ. Mở link không tự xác minh; người dùng bấm nút xác nhận.
- Link đặt lại mật khẩu hết hạn sau 30 phút; phản hồi quên mật khẩu không tiết lộ tài khoản có tồn tại.
- Trang tài khoản cập nhật khi quay lại tab hoặc nhận thông báo xác minh ở tab khác.
- `sent` nghĩa là máy chủ SMTP/Resend chấp nhận yêu cầu gửi, chưa chứng minh thư đến Inbox. SMTP không có cam kết chống trùng như khoá idempotency của Resend; ứng dụng không tự retry gửi thư.
- Gửi bài luận thất bại vẫn giữ bài đã lưu. Nhật ký chỉ lưu mục đích, mã tài khoản, trạng thái và thời điểm, không lưu mật khẩu hoặc link xác minh.

## Kiểm thử

```bash
node scripts/test-gmail-email.cjs
node scripts/test-auth-email.cjs
node scripts/test-welcome-credits.cjs
```

Kiểm thử dùng SMTP/HTTP loopback và SQLite riêng, không gửi email thật. `TUVI_SMTP_TEST_PORT` và `TUVI_RESEND_BASE_URL` chỉ dành cho mô phỏng local, không đặt trên server; bị từ chối khi `SITE_URL` là tên miền công khai.

Giữ tương thích `MAIL_PROVIDER=resend` khi có `RESEND_API_KEY` và người gửi thuộc tên miền đã xác minh trên Resend. Không dùng địa chỉ `@gmail.com` làm người gửi của Resend.
