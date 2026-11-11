# Triển khai bản gia cố bảo mật

Xác thực hai lớp và khóa backup hiện là tùy chọn, tạm ẩn khi chưa cấu hình.
Quản trị dùng mật khẩu; backup chưa có khóa vẫn tạo bản SQLite quyền 600.
Khi đã cấu hình secret hoặc public key, cơ chế bảo vệ tương ứng vẫn hoạt động.

## Thay đổi hành vi

- Đổi mật khẩu thu hồi mọi phiên cũ và mọi link reset chưa dùng. Reset vẫn chỉ dùng một lần.
- Mật khẩu mới dùng scrypt `N=32768, r=8, p=3`. Hash cũ được xác minh theo tham số cũ
  và tự nâng cấp sau đăng nhập thành công. Không cần đặt lại mật khẩu hàng loạt.
- `GET/POST /api/readings/[token]`, `GET /api/orders/[token]` và `POST /api/readings`
  yêu cầu đăng nhập. Chưa đăng nhập trả 401; sai chủ sở hữu hoặc token không tồn tại
  trả 404. Link chỉ định vị bản ghi, không tự cấp quyền. Phản hồi lỗi không chứa dữ liệu sinh.
- Đơn khách cũ chưa có `customer_id` chỉ được nhận lại bởi tài khoản có email đã xác minh
  trùng email đặt đơn. Đơn đã thuộc tài khoản khác không được chuyển chủ bằng link.
- `POST /api/orders` khi bật thanh toán yêu cầu tài khoản đã xác minh; email nhận đơn
  lấy từ tài khoản, bỏ qua email phía client. Không mở link PayOS cho khách ẩn danh.
- Đăng nhập quản trị dùng mật khẩu khi `ADMIN_TOTP_SECRET` để trống; ô mã xác thực
  được ẩn. Khi có secret hợp lệ, website hiển thị ô mã và vẫn bắt buộc TOTP 6 số.
  Secret đã cấu hình nhưng sai định dạng không bị tự động bỏ qua.
- Phiên quản trị cũ bị vô hiệu khi nâng cấp, đổi mật khẩu hoặc đổi secret TOTP.

Các trang xem lại hướng dẫn đăng nhập và quay về đúng URL sau đăng nhập. Bộ kiểm tra
commerce HTTP đã chuyển sang tài khoản thử có xác minh, không dùng link khách để đọc riêng tư.

## Bật MFA khi cần

Nếu muốn bật lại xác thực hai lớp, trên máy riêng được tin cậy chạy:

```sh
node scripts/setup-admin-mfa.mjs
```

Lệnh tạo `storage/admin-mfa-enrollment.json` quyền 600, không ghi đè tệp có sẵn và không
in secret ra terminal. Mở tệp bằng trình soạn thảo riêng; nhập secret vào ứng dụng xác thực
TOTP (SHA-1, 6 số, chu kỳ 30 giây). Có thể nhập `otpauthUrl` qua trình quản lý mật khẩu
hỗ trợ định dạng này. Không đưa tệp lên website, Git, ticket hoặc ảnh chụp công khai.

Đặt cùng secret vào `ADMIN_TOTP_SECRET` trong môi trường máy chủ. Giữ bản khôi phục
ở nơi riêng ngoài máy chủ. Đồng bộ thời gian máy chủ bằng NTP. Mã đã dùng không được dùng
lại, kể cả trong cùng 30 giây; hệ thống chấp nhận lệch tối đa một bước thời gian.

Nếu mất ứng dụng xác thực: người có quyền quản trị máy chủ phải thay secret qua SSH,
đăng ký lại thiết bị và khởi động lại dịch vụ. Đổi secret vô hiệu các phiên cũ. Không có
đường khôi phục qua link công khai hoặc mã dự phòng dùng chung.

## Chuẩn bị mã hóa backup

Tạo cặp khóa trên **máy khôi phục riêng**, không tạo private key trên máy chủ website:

```sh
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:3072 -out tuvi-backup-private.pem
chmod 600 tuvi-backup-private.pem
openssl pkey -in tuvi-backup-private.pem -pubout -out tuvi-backup-public.pem
```

Chỉ chép public key tới máy chủ, đặt đường dẫn đọc được bởi user dịch vụ trong
`TUVI_BACKUP_PUBLIC_KEY_FILE`. Không đặt private key trong `.env.local` hoặc trong repository.
Giữ private key trong kho mã hóa ngoài máy chủ; mất khóa sẽ không khôi phục được backup mới.

Script `scripts/backup-db.mjs` lấy snapshot nhất quán bằng `VACUUM INTO`, kiểm tra SQLite,
rồi mã hóa bằng AES-256-GCM với khóa ngẫu nhiên; khóa AES được bọc bằng RSA-OAEP-SHA256.
Header được xác thực cùng nội dung. Tệp hoàn chỉnh có đuôi `.sqlite.enc`, quyền 600.
Snapshot tạm nằm trong thư mục quyền 700 và được dọn sau khi chạy xong; nếu tiến trình bị
dừng đột ngột cần kiểm tra, dọn các thư mục `.tuvi-snapshot-*` còn lại theo quy trình vận hành.
Nếu chưa đặt public key, script tạo bản `.sqlite` quyền 600 trong thư mục sao lưu
đã cấu hình. Nếu đã đặt public key nhưng không đọc được hoặc khóa không hợp lệ, backup
vẫn báo lỗi; không tự chuyển sang lưu plaintext.

Khôi phục vào **tệp mới trên máy riêng**:

```sh
TUVI_RESTORE_PRIVATE_KEY_FILE=/secure/tuvi-backup-private.pem node scripts/decrypt-backup.mjs /backups/tuvi.sqlite.enc /restore/recovered.sqlite
```

Tệp đích phải chưa tồn tại. Giải mã sai khóa, thiếu dữ liệu hoặc dữ liệu bị sửa sẽ không
xuất bản tệp plaintext. Sau giải mã, chạy `PRAGMA quick_check` và kiểm tra dữ liệu trên bản
khôi phục trước khi dừng dịch vụ để thay DB. Không thử đè trực tiếp DB đang hoạt động.

Phải cấu hình lịch sao chép **ciphertext** tới nơi lưu ngoài máy chủ do chủ hệ thống quản lý;
chưa có đích lưu ngoài máy chủ trong repository nên bản sửa không tự gửi dữ liệu đi đâu.
Các backup plaintext cũ và snapshot release chứa `.env.local` không tự được mã hóa lại;
cần xử lý riêng, giữ nguyên bản cần thiết để khôi phục và bảo vệ quyền truy cập của chúng.

## CSP và phát hành

- Trang riêng tư dùng nonce ngẫu nhiên mới cho mỗi phản hồi, không cho phép script inline
  thiếu nonce hoặc `eval` ở production, và có `Cache-Control: private, no-store`.
- Các trang công khai giữ kết xuất tĩnh; CSP giới hạn nguồn tải tài nguyên, chặn object,
  base URL, nhúng iframe và inline event handler. Script inline framework vẫn được phép
  ở trang công khai; đây không phải strict CSP cho toàn bộ site.
- CSS/font Google đang dùng được cho phép. CSP không thay thế kiểm tra quyền API.

Hai biến `ADMIN_TOTP_SECRET` và `TUVI_BACKUP_PUBLIC_KEY_FILE` không còn bắt buộc khi
chạy updater hoặc `node scripts/preflight.mjs --live`. Nếu có giá trị, preflight vẫn
kiểm tra secret và public key đã cấu hình. Không bật thanh toán
chỉ để kiểm thử bảo mật. Nếu đóng gói nguồn thủ công, nhớ thêm `proxy.ts` và các module mới.

Các kiểm tra:

```sh
npm run test:security
node scripts/test-auth-origin.cjs
npm run test:commerce
npm run build
```

Khi bản production đang chạy trên môi trường thử riêng:

```sh
node scripts/test-security-http.mjs
npm run test:seo
```

Đọc `scripts/test-customers.mjs` và `scripts/test-commerce-http.mjs` trước khi chạy: chỉ
dùng server demo và DB thử. Không chạy các bài tạo/xóa tài khoản hoặc giao dịch thử trên
production. Kiểm tra MFA thật bằng ứng dụng của chủ hệ thống sau khi cấu hình.

Lưu ý rollback: code cũ không hiểu hash scrypt v2. Sau khi có người đăng nhập và hash đã
nâng cấp, bản rollback phải giữ module xác minh hash v2 và migration tương thích. Không
phục hồi DB cũ một cách tùy tiện vì sẽ mất các thay đổi phát sinh sau bản sao lưu.

Tham khảo: [OWASP Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html),
[RFC 6238](https://www.rfc-editor.org/rfc/rfc6238),
[Next.js CSP](https://nextjs.org/docs/app/guides/content-security-policy).
