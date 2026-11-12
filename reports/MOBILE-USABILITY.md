# Kiểm tra giao diện mobile — 12/11/2026

Đã hoàn tất phần chỉnh mobile: form nằm sau phần giới thiệu ngắn hơn, nhãn nhập liệu và nội dung dễ đọc hơn, thanh điều hướng có menu Khám phá. Trang lá số có tổng quan Mệnh/Thân/đại hạn và nút phóng to, chọn cung đồng bộ với phần chi tiết ở trang chính.

Khi xem ảnh kiểm tra, phát hiện Lập lá số và Khám phá bị xếp lệch hàng; đã dùng lưới hai cột cho header mobile. Nút đóng cửa sổ phóng to từng bị cuộn khuất; đã ghim phần đầu cửa sổ để luôn bấm được.

## Kết quả

- `npm run build` và `npm run typecheck`: đạt.
- `npm run test:mobile`: 15 nhóm đạt trên Chromium, độ rộng 320/390/768/1440px.
- Không tràn ngang toàn trang; lá số cuộn ngang trong vùng riêng.
- Form xuất hiện trước mốc 520px ở các độ rộng mobile được thử; CTA tới đúng form và ngày sinh không tồn tại bị chặn.
- Menu mở/đóng, Escape, liên kết điều hướng và menu khi tắt JavaScript hoạt động.
- Lá số có đủ 12 cung trong HTML ban đầu; tổng quan nằm trước bảng sao.
- Cửa sổ phóng to chọn cung đồng bộ, đóng bằng nút/Escape, trả focus và liên kết tới vùng luận giải hoạt động; nút đóng vẫn trong màn hình sau khi cuộn đến cuối.
- Không ghi nhận lỗi JavaScript hoặc HTTP 5xx trong luồng thử.

Đã xem trực tiếp ảnh trang chủ 320/390px, menu 390px và cửa sổ phóng to 390px sau sửa. Ảnh và báo cáo máy đọc nằm ở `outputs/mobile-usability/`, không đưa vào Git.

## Chạy lại

Chạy `npm run build`, khởi động `npm run preview:customers` ở cổng 3100, rồi chạy `npm run test:mobile` trong terminal khác. Cần Chromium của Playwright đã cài và quyền mở trình duyệt local. Script hỗ trợ `BASE_URL` cho một bản preview riêng tương đương.

Chỉ dùng DB preview, không tạo đơn thanh toán hoặc gửi email thật. Chưa kiểm tra Safari/iPhone hoặc thiết bị vật lý. Chưa triển khai thay đổi lên máy chủ.
