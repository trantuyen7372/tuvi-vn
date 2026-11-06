# Triển khai và cập nhật máy chủ

Đã cài bản trải nghiệm tại `/srv/tuvi-vn` trên VM `138.2.81.196`, dùng Node riêng `/opt/tuvi-node`, dịch vụ `tuvi-vn` tại `127.0.0.1:3100` và timer backup SQLite. Chủ website đã xác nhận tên miền và yêu cầu để thanh toán làm sau. Nginx riêng đang trả 503 chờ DNS/HTTPS; chưa mở đăng nhập công khai. Không thay đổi Magento/velofront.

Đợt nâng cấp cách luận dùng `deploy/update-preview.sh`: sao lưu DB nhất quán, sao lưu mã/build, kiểm tra lock không đổi, build lại và kiểm tra luồng tài khoản. Có khôi phục mã/build nếu cập nhật lỗi. Gói nguồn không chứa `.env.local`, DB, bản đọc riêng hoặc dữ liệu đăng nhập demo. Giữ cấu hình thu tiền tắt; không thay vhost khi chỉ cập nhật cách luận.

Các bước dưới đây là hướng dẫn cài mới/hoàn tất cấu hình; các mô tả thiếu cấu hình không phủ nhận phần đã cài ở trên.

1. Dùng Node >=22.15 có SQLite và zstd. Service hiện dùng `/opt/tuvi-node/bin/node`. Đặt mã nguồn tại `/srv/tuvi-vn`, quyền chạy cho `ubuntu`. Không chép DB thử hoặc mật khẩu thử lên server.
2. Chép riêng `data/v4-vi` (bản nguồn khoảng 5,3 GiB; bản nén lại đã kiểm tra đồng nhất khoảng 384 MiB đang dùng trên VM), đặt `.env.local` thật quyền 600. Đặt `TUVI_DB_PATH=storage/tuvi.sqlite`, `TUVI_DATASET_DIR=data/v4-vi`, `SITE_URL` đúng tên miền HTTPS. Không để `PAYMENT_PROVIDER=mock` hoặc `TUVI_ALLOW_TEST_PAYMENTS=1` khi bán hàng.
3. Trong thư mục dự án chạy `npm ci`, `npm run build`, `node scripts/preflight.mjs --live`. Lệnh cuối phải đạt trước khi nhận tiền. Nếu chỉ dựng bản xem thử, dùng `node scripts/preflight.mjs` và giữ thanh toán chưa cấu hình; kết quả đó không chứng nhận sẵn sàng mở bán.
4. Tạo thư mục `storage`, `.next/cache` và quyền ghi cho `ubuntu`; các đường dẫn phải tồn tại vì service giới hạn vùng ghi. Cài `tuvi-vn.service` dưới tên riêng vào systemd. Chỉ mở ứng dụng tại 127.0.0.1:3100, kiểm tra `/api/health` trả 200.
5. Kiểm tra cổng 3100 chưa được dịch vụ khác dùng. Cài duy nhất vhost mới từ `tuvi-vn.nginx.conf`, đổi `server_name` theo tên miền thực tế. Kiểm tra `nginx -t` trước khi reload; hoàn tất DNS và TLS trước khi thử thanh toán. Mẫu là HTTP ban đầu, chưa có chứng chỉ; không được coi là cấu hình HTTPS hoàn chỉnh.
6. Đăng ký webhook PayOS tại `/api/payments/payos`. `proxy_read_timeout` đặt 720 giây vì bài AI có thể cần nhiều phút; proxy timeout ngắn có thể làm khách thấy lỗi dù máy chủ còn xử lý. Đối chiếu [tài liệu nginx](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout).
7. Cài service/timer backup riêng và chạy thử. Script dùng SQLite `VACUUM INTO`, kiểm tra `quick_check`, bảo vệ file bằng mode 600; không chép riêng tệp SQLite đang chạy WAL bằng lệnh copy thông thường. Cần thêm bản sao lưu mã hóa ngoài máy chủ, chính sách giữ/xóa và diễn tập phục hồi. Timer này chỉ tạo bản sao tại cùng máy, chưa bảo vệ trước mất toàn bộ VM.
8. Kiểm thử trình duyệt desktop/điện thoại, giao dịch thật số nhỏ được chủ tài khoản cho phép, webhook đến lại, thư đến hộp thư, khởi động lại dịch vụ và xem lại kết quả. Đo phí AI thực tế rồi mới chốt giá mở bán.

Khi nâng cấp: backup DB trước; giữ nguyên `.env.local`, `storage` và `data` khi thay mã. Nếu đổi cấu trúc DB, cần migration/rollback riêng; hiện chưa có thay đổi schema ở đợt cải thiện giao diện này. Không chạy hai bản nâng cấp khác schema đồng thời.

Không tắt các cơ chế bảo vệ đang có trên server để làm mẫu này chạy. Hãy sửa đúng đường dẫn/quyền và kiểm tra nhật ký service nếu khởi động lỗi. Giữ kín link đơn hàng/bài luận; vhost mẫu không ghi access log và giảm chi tiết error log, nhưng vẫn cần kiểm tra cả log của proxy/CDN bên ngoài.
