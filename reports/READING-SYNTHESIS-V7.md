# Tổng hợp giai đoạn và cá nhân hóa v7 — 06/11/2026

## Kết quả triển khai

Bài tự động có thêm phần “Xu hướng chính theo từng giai đoạn” trước các phần chi tiết. Chọn tối đa ba nhóm chủ đề có cả nền chính tinh và vị trí/hóa của đúng kỳ; chủ đề không đủ căn cứ không được thêm chỉ để khớp mong muốn. Mỗi ý nối nền bản mệnh với thời điểm, ghi căn cứ sao/cung/lớp/tuổi, mặt thuận hoặc vướng và điều kiện để đối chiếu. Giữa hai chặng có câu nêu thay đổi cung hạn; đây là chuyển trọng tâm diễn giải, không xác nhận biến cố. Không dùng tứ hóa trùng làm hai lần may/rủi hoặc hiển thị điểm xếp hạng như xác suất.

Giữ trường hợp tuổi nhỏ, mốc 18, tuổi cao, chưa vào hạn và ngoài phạm vi dữ liệu. Không đưa Tật Ách vào nhóm xu hướng hoặc phán sự kiện sinh con/hôn nhân. Điều kiện chung đã giải thích không lặp lại trong cùng bài. Đủ 12 cung và các kỳ chi tiết; bài cũ nâng lên v7 khi mở lại, giữ link/lượt và bảo toàn bài biên tập riêng, bài có usage hoặc phiên bản tương lai.

Người đã đăng nhập mở bài của mình, chọn “Chọn vấn đề bạn muốn đọc kỹ”: công việc/nguồn lực, tình cảm/đồng hành hoặc gia đình/sinh hoạt. Có hoàn cảnh có cấu trúc và ghi chú tối đa 400 ký tự, đều tự nguyện. Chủ đề chỉ điều chỉnh ưu tiên khi đã có yếu tố thật; hoàn cảnh quyết định cách đặt lời giải, không thay vị trí sao. Ghi chú được dẫn rõ là thông tin tự khai chưa xác minh, giữ để người đọc đối chiếu, không tự phân tích ghi chú thành sự kiện hoặc gửi ghi chú vào mô hình ngoài.

Đổi/xóa chủ đề dựng lại cùng bài trong nhánh dataset, không thêm lượt, lần tạo, URL hoặc fingerprint. Lựa chọn đọc tổng thể bỏ hoàn cảnh và ghi chú khỏi dữ liệu bài đang hoạt động; không tuyên bố xóa tức thì mọi bản sao lưu lịch sử. Không cập nhật bài của khách khác, bài đang chạy, bản biên tập riêng, bài có usage hay bản tương lai. Bản sao email cũ không được coi là đã gửi lại sau chỉnh sửa. Chính sách bảo mật nêu dữ liệu tự nguyện mới. Không đổi schema DB hoặc thanh toán.

Mục lục có 22 phần. Nút nhanh chỉ hiện sau khi đã cuộn qua mục lục đầu bài, tránh che form chọn chủ đề trên mobile.

## Kiểm tra và giới hạn

29 kiểm tra lời luận/78 lá số đạt, gồm đối chiếu từng tín hiệu tổng hợp với đúng sao, cung và lớp hạn trên 24 hồ sơ bổ sung; hoàn cảnh không đổi lá số, URL query hoặc định danh lượt, ghi chú không thành heading/link và không có trong chartToText cho nhánh mô hình ngoài.

24 bài v7 ở `outputs/reading-editorial-v7/`; 70 chặng có 2–3 ý mỗi chặng trong bộ này, không có đoạn lặp nguyên văn, vẫn đủ 12 cung và 12 hướng đổi hóa. Đây không phải khẳng định mọi lá số luôn đủ ba ý. Bản v6 giữ nguyên để so sánh. Đợt này bài dài thêm khoảng 29,2% số từ tách bằng khoảng trắng; không coi dài hơn là sâu hoặc đáng tiền hơn, cần người thật đánh giá lượng thông tin hữu ích và độ mệt khi đọc.

Đọc thủ công có mục tiêu phần tổng hợp ở S07, S11, S12, R01, R06, R11; không đọc trọn mọi bài trong đợt này. Đã xem ảnh mobile form chọn chủ đề, mục lục và đầu bài, sửa nút nổi che form. 5 kiểm tra riêng bằng SQLite tạm bảo vệ ownership, manual/future/usage, xử lý ghi chú và không mất lượt. 11 Chromium cho đọc tiếp/cá nhân hóa, 11 UI tài khoản, 26 HTTP, 16 commerce, 5 SEO/25 trang và production build đều đạt. Không thử tiền/email thật.

## Bộ đọc thử cho người thật

`reports/PHIEU-DANH-GIA-BAI-LUAN.md` là quy trình và phiếu chưa điền. `outputs/reading-review-v7/tai-lieu-doc-thu.tar.gz` chứa 24 hồ sơ tổng hợp, 48 bản A/B (v6/v7, bỏ dấu phiên bản và thông tin sinh ở đầu bài), 3 ví dụ hoàn cảnh C01–C03, hướng dẫn và thông số tổng hợp để chuyên gia lập lại. Bảng mở nhãn nằm riêng ở `outputs/reading-review-v7/doi-chieu-phien-ban-noi-bo.json`, không nằm trong gói người tham gia.

Chưa có đánh giá thực tế từ chuyên gia hoặc người dùng thật; không tự tạo điểm số, không tự liên hệ ai và không đưa dữ liệu khách vào bộ đọc thử. Phần còn cần người thật tham gia vẫn đang chờ. Kiểm tra kỹ thuật không chứng minh khả năng dự báo hoặc giá trị trả phí. Thanh toán tiếp tục tắt.

Đã triển khai v7 lên VM, production build và kiểm tra trực tiếp đạt: tạo bài đúng phiên bản, có tổng hợp giai đoạn, lưu/xóa hoàn cảnh và giữ đúng số lượt. Tài khoản kiểm thử được xóa. Backup trước cập nhật: `storage/backups/release-20261106T080516Z`. SHA256 gói triển khai: `7884047326ee10ec248485c089da0d4d1d8738cc80e0c5ffe965150e4add654a`. Dịch vụ nội bộ đã cập nhật, không đồng nghĩa tên miền đã mở công khai; thanh toán vẫn tắt.
