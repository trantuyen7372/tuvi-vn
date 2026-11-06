# Nâng cấp cách luận — 05/11/2026

Chủ website duyệt hướng viết giải thích sao tại cung, phối hợp sao và nối với các giai đoạn về sau. Bản trước chủ yếu ghép nội dung kho, chỉ liệt kê đại hạn/lưu niên. Bản mới áp dụng cách diễn giải này cho bài tạo tự động bằng bộ quy tắc biên tập; không chỉ sửa riêng bài đọc thử.

- Đủ 12 cung: căn cứ sao và độ sáng, chính/phụ tinh, tứ hóa bản mệnh, các tổ hợp được biên tập và tình huống đời sống để đối chiếu. Vô chính diệu phân biệt sao đối cung với sao tọa thủ.
- Tính riêng đại hạn hiện tại và tối đa hai đại hạn tiếp theo, năm đã chọn và tối đa bốn năm tiếp theo. Chỉ ghi năm đến 2100; khi chuỗi năm qua ranh giới đại hạn, mỗi năm dùng đúng đại hạn của chính năm ấy. Tuổi âm và khoảng năm dựa trên năm sinh âm lịch, không lấy năm dương trước Tết thay thế.
- Tổng quan miễn phí và bài minh họa công khai dùng cùng cách luận. Hồ sơ minh họa công khai không dùng thông tin khách hàng. Nhánh mô hình ngoài đã cập nhật yêu cầu viết và dữ liệu thời gian nhưng chưa gọi dịch vụ ngoài/đo chất lượng đầu ra thực tế.
- Bài kho cũ được nâng khi xem lại: giữ URL, số lượt, số lần xử lý và email; chỉ nhận đúng dấu mở đầu của bản kho cũ. Không thay bản biên tập riêng hoặc bài đã tạo theo nhánh mô hình ngoài. Nếu nâng lỗi vẫn giữ nguyên bài cũ.
- Nhánh mặc định dùng dữ liệu lá số và quy tắc biên tập xác định. Kho Việt hóa xác nhận phạm vi hỗ trợ; không sao chép các lời phán bệnh/sự kiện trong kho cũ. Nội dung có ví dụ và giới hạn rõ, không dự báo chắc chắn bệnh, tai nạn, tuổi thọ, số con hoặc lợi nhuận.

## Kiểm tra

`npm run build` đạt. `npm run test:reading` đạt 13 kiểm tra, đối chiếu 78 lá số khác ngày/giờ/giới tính, tất cả tạo bài khác nhau. Có ca cố định cho tứ hóa và vị trí cung, lịch âm tháng nhuận, tuổi trước đại hạn, mốc 2100, chuyển đại hạn và nâng bài cũ không trừ lượt. Đối chiếu 78 lá số chứng minh độ khớp dữ liệu và khả năng chạy, không chứng minh tính đúng của dự báo Tử Vi hoặc độ hay ngang biên tập thủ công.

`npm run test:commerce` đạt 16 kiểm tra; `node scripts/test-customers.mjs` đạt 26 kiểm tra HTTP. Kiểm tra trình duyệt xác nhận luồng tài khoản, bài mới, mục lục và không tràn ngang trên màn hình điện thoại. Ảnh nằm trong `outputs/customer-ui/`; kết quả máy đọc ở `reports/reading-tests.json`, `reports/customer-tests.json` và `outputs/customer-ui/report.json`.

Kiểm tra trình duyệt cuối đợt đạt 11 mục; đã xem ảnh nội dung trên điện thoại. Bản nâng cấp đã triển khai trên VM và build Node 24 đạt. Kiểm tra trực tiếp trên VM đạt: health, đăng ký, không lộ link email demo, bài có căn cứ sao–cung và các giai đoạn tiếp theo, trừ đúng một lượt, xóa dữ liệu kiểm thử. Dịch vụ `tuvi-vn` chạy lại thành công. Backup mã/build trước cập nhật: `storage/backups/release-20261105T163454Z`; backup DB nhất quán được tạo trước khi cập nhật. Gói nguồn SHA-256: `ab41cdd529b0e6104efd0fe9071d2bcf5e131283ec9cf594683a2134531ac3fd`.

## Việc phụ thuộc cấu hình chủ website

DNS tên miền chưa phân giải IPv4 từ VM ở lần kiểm tra đợt này; chưa cấp HTTPS/mở public. Chưa có thông tin truy cập quản lý DNS, email hỗ trợ hoặc cấu hình gửi email thật. Không tự đặt một địa chỉ hỗ trợ chưa được xác nhận; không gửi email thật trong kiểm thử. Thanh toán tiếp tục tắt theo yêu cầu.

Kiểm tra cuối trên VM: ứng dụng và timer backup đều active; health trả `{ok:true}`; HTTP theo Host tên miền trả 503 đúng trang chờ. Preflight live chưa đạt do thiếu `RESEND_API_KEY`, `MAIL_FROM`, `OPERATOR_ADDRESS`, `SUPPORT_EMAIL`. Không lấy kết quả build/kiểm tra nội bộ thay cho trạng thái sẵn sàng công khai.

Tài liệu kỹ thuật đối chiếu cách lấy từng kỳ: [iztro horoscope API](https://docs.iztro.com/en_US/posts/horoscope). Phiên bản đã khóa trong package-lock và kết quả kiểm tra trực tiếp trên bản cài đặt mới là căn cứ cho các giá trị trong ứng dụng.
