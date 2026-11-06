# Vòng biên tập bài luận v5 — 06/11/2026

Đã tạo thêm 12 hồ sơ kiểm thử, đối chiếu 12 hồ sơ v4 trên bộ dựng v5. Đây là hồ sơ tổng hợp dùng bộ an sao và kho dữ liệu thật, không phải dữ liệu khách hàng. Bản trước/sau và 12 bài hồi quy ở `outputs/reading-editorial-v5/`; bằng chứng v4 vẫn giữ riêng.

## Thay đổi

- Diễn giải riêng 12 hướng đổi hóa giữa Lộc, Quyền, Khoa, Kỵ: thay đổi trọng tâm ở đúng cung và lớp thời gian; không coi hóa thời điểm xóa hóa bản mệnh. Câu hỏi đối chiếu theo chủ đề cung, điều chỉnh theo tuổi.
- Sửa lỗi trước đại hạn đầu: thư viện có thể trả chỉ số cung giai đoạn tuổi nhỏ; chỉ đánh dấu đại hạn hiện tại khi tuổi nằm trong khoảng thật. Tổng quan và bài chi tiết thống nhất. Ngoài khoảng đại hạn có dữ liệu thì nói rõ giới hạn.
- Bổ sung căn cứ cấu hình Thân cư/vô chính diệu; không chỉ liệt kê sao rồi bỏ mất lý do chọn điểm trọng tâm.
- Giải thích quy ước giờ Tý muộn chuyển ngày. Đã xác nhận giao thừa Tý muộn khớp Tý sớm hôm sau; không tự đổi thuật toán năm âm.
- Số năm tiếp theo hiển thị theo số kỳ thực sự còn dữ liệu, không tạo năm 2101. Chủ đề con cái dùng điều kiện có liên quan, không mặc định đã có con.
- Bài có dấu phiên bản cũ nâng lên v5 khi đọc lại, giữ URL và lượt. Bản biên tập riêng và bài có ai_usage được giữ theo cơ chế hiện có.

## Kiểm tra và phạm vi đọc

`reports/reading-v5-checks.json`: 12 hồ sơ mới + 12 hồi quy, 24 bài khác nhau, 3–5 trọng tâm có chứng cứ, đủ 12 cung, không có đoạn lặp nguyên văn. Cả 12 hướng đổi hóa đã thực sự hiển thị trong bài, không chỉ có trong bảng quy tắc.

Đọc rà có mục tiêu phần trọng tâm và các đoạn đổi hóa ở S01–S10; đối chiếu đầu bài/ranh giới hạn S11 và S12, phần giờ Tý ở S10. Không đọc trọn tất cả 24 bài trong vòng này. Báo cáo v4 giữ nguyên phạm vi đọc của đợt trước. Các kiểm tra này xác nhận dữ liệu và nhánh diễn giải, không phải thẩm định chuyên môn độc lập hoặc kiểm chứng dự báo với đời thực.

26 kiểm tra lời luận/78 lá số đạt; typecheck và production build đạt. Kiểm tra trên bản build mới: 26 HTTP tài khoản, 11 giao diện Chromium, 5 nhóm SEO/25 trang đều đạt. Đã xem ảnh desktop/mobile, mục lục thu gọn đúng và không tràn ngang 390px. Không gọi mô hình ngoài hoặc gửi ngày giờ sinh ra ngoài.

V5 thêm lời giải cụ thể cho các trường hợp trước đây chung chung; không tuyên bố giảm thêm 24,1% độ dài (con số ấy thuộc v4 so với v3). Thanh toán vẫn tắt. Trạng thái triển khai ghi ở cuối sau khi máy chủ kiểm tra thành công.

Đã triển khai v5 lên VM và kiểm tra trực tiếp thành công: build, health, đăng ký, tạo bài riêng, căn cứ sao/cung, hạn tiếp theo và trừ đúng một lượt; dữ liệu tài khoản kiểm thử được xóa. Backup trước cập nhật: `storage/backups/release-20261106T070214Z`. SHA256 gói triển khai: `36cf71df56b70a77188caa4737c0d471f3d7aadcbf1bab539f3877c40ad88ade`. Dịch vụ nội bộ đã cập nhật; không đồng nghĩa tên miền đã mở công khai. Thanh toán, DNS và email giữ trạng thái đang chờ như đợt trước.
