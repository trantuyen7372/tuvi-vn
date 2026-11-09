# Luồng kết quả và QR — 06/11/2026

Đã áp dụng các đề xuất phù hợp với trạng thái chưa thu tiền. Giữ giá/gói đang có trong mã nguồn tại thời điểm bắt đầu (99k/199k/299k), giữ lựa chọn chủ động của khách; không thêm nhãn phổ biến thiếu số liệu hoặc cam kết lưu vĩnh viễn.

Preview trả tối đa hai trích đoạn từ các trọng tâm thực sự được chọn theo lá số, cùng câu hỏi đúng cung Kỵ, đại hạn và khoảng năm có dữ liệu. Có trạng thái tuổi nhỏ/ngoài hạn/năm 2100; không gọi mô hình ngoài. Các vạch mờ chỉ là trang trí có aria-hidden, không gửi bài đầy đủ rồi che CSS hoặc bịa một đoạn trả phí. CTA ở đầu trang, tại cung đã chọn và dưới preview cùng trỏ tới vùng mở bài. Preview và vùng mở bài đặt trước cách cục.

Gói có nhãn mô tả mục đích, quyền lợi đúng phạm vi năm và khả năng in/lưu PDF hiện có. Coupon thu gọn bằng details, email điền từ phiên tài khoản nếu ô chưa có nội dung. Chế độ thật vẫn tắt thu tiền; giữ lời mời trải nghiệm/đăng nhập phù hợp.

Trang QR có thời gian còn lại lấy từ expires của đơn, tên lá số/năm xem, link tải PNG data URL và hướng dẫn dùng ảnh QR trên cùng điện thoại. Số tài khoản, BIN và nội dung sao chép chỉ lấy từ payload VietQR có CRC hợp lệ và cấu trúc nhận diện được; không đoán dữ liệu từ mã đơn. Không có dữ liệu thì ẩn nút tương ứng, giữ đường dẫn PayOS nếu có. Hết thời gian thì ẩn các thao tác chuyển khoản, vẫn chờ trạng thái thật từ server. Remount theo token để không giữ thông tin đơn trước khi đổi URL. Không đổi webhook, số tiền hoặc quyền mở bài. Tham khảo cấu trúc/response tại https://payos.vn/docs/api/ ; CRC kiểm tra tính toàn vẹn, không xác minh danh tính người nhận ngân hàng.

Production build đạt, 4 kiểm tra QR null/CRC/payload và 3 hồ sơ preview (người lớn/trẻ nhỏ/năm 2100) đạt. 5 nhóm Chromium CRO đạt: xem trước và CTA, CTA cung, email/coupon/chọn gói, tải PNG/clipboard QR giả lập, ẩn QR khi hết hạn. Paid/QR response được intercept trong trình duyệt; không bật thanh toán trên server, không tạo đơn thật hoặc chuyển tiền. 26 HTTP khách và 10 điều hướng/chart đạt. Đã xem ảnh mobile.

Chưa đo được thay đổi tỷ lệ mua/AOV vì chưa mở thanh toán và chưa có dữ liệu thử nghiệm khách thật. Không đồng nhất các kiểm tra giao diện với bằng chứng tăng chuyển đổi.

Đã cập nhật máy chủ: build/preflight indexed và smoke trực tiếp tài khoản/tạo bài/lượt đạt, thanh toán vẫn tắt. Backup `storage/backups/release-20261106T145308Z`; SHA256 gói nguồn `795460b3eca84c720d2f96a0e2745dae31f7dad21ff432a451ca0f65b258d1ba`. Local phiên 84419. Không đổi DNS/HTTPS.
