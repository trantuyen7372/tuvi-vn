# Ba tối ưu v6 — 06/11/2026

## Nội dung bài luận

Hóa Lộc ở các lớp hạn và phần trọng tâm có cơ chế riêng theo sao, nối với đúng chủ đề cung. Các đoạn đổi hóa dùng giải thích và điều kiện thực tế thay cho câu hỏi chung. Khi cùng sao/cung/cặp hóa đã được giải thích trong một nhóm tuổi, các kỳ sau giữ căn cứ và dẫn lại phần trước, không viết lại cả đoạn. Không dùng lời giải của tuổi trưởng thành để thay lời giải trẻ em hoặc ngược lại. Giữ đủ 12 cung, phân biệt bản mệnh/đại hạn/lưu niên và quy tắc nâng bài v6 không trừ lượt.

24 bài được sinh lại ở `outputs/reading-editorial-v6/`; ảnh chụp bằng chứng v5 giữ nguyên. 24 bài khác nhau, không có đoạn lặp nguyên văn, 3–5 trọng tâm có căn cứ; các hướng đổi hóa vẫn đủ 12 loại. Số dấu hỏi trong 24 bài từ 155 còn 47; đây chỉ là chỉ số biên tập, không là bằng chứng tăng độ chính xác hay mức hài lòng. Không tuyên bố toàn bài ngắn hơn. Đã đọc có mục tiêu phần đổi hóa/Lộc và dẫn lại ở S01, S03, S07, S09, S11, S12, R01, R10, R11; không đọc trọn cả 24 bài. 27 kiểm tra lời luận/78 lá số đạt.

## Tra dữ liệu

`lib/dataset-cache.ts` giữ Buffer đã giải nén theo LRU, tối đa 64 MiB tổng Buffer được giữ trên mỗi tiến trình. Khi quá lớn thì bỏ qua cache; đổi tệp tại cùng đường dẫn được nhận biết bằng stat. Chỉ chuyển dòng cần tra sang chuỗi UTF-8, thay vì chuyển nguyên tháng. Chỉ lưu kho nội dung dùng chung, không cache hồ sơ khách hoặc bài riêng. Bộ nhớ toàn tiến trình có thể cao hơn giới hạn này do Buffer tạm, quá trình giải nén và các phần khác.

`reports/dataset-cache-checks.json`: kiểm tra cache hit, LRU, đổi/xóa tệp, tệp quá lớn, thử lại sau lỗi và dữ liệu thật khớp. 5 ca tra đầy đủ khớp cách cũ, gồm đổi giờ/giới tính và Tý muộn qua ngày/tháng. Trên máy local, trung vị 7 lượt tra đầy đủ: cách cũ 767,924 ms, bản mới đã ấm cache 7,199 ms. Đây là phép đo bước tra dữ liệu với cache đã ấm; không phải đo toàn trang, tải đồng thời hay hiệu năng trên tên miền thật. Lần tra đầu hoặc đổi tháng vẫn phải đọc/giải nén.

## Đọc bài dài

Mục lục nhanh dùng dialog native, có nút Đóng/Escape và đánh dấu mục đang đọc; mục lục đầu bài vẫn mặc định thu gọn. Bài riêng có lời mời đọc tiếp mục đã lưu, không tự cuộn khi mở. Chỉ lưu mã mục dưới khóa băm SHA-256 của mã bài; không lưu link riêng, tên/ngày sinh hoặc nội dung bài trong bộ nhớ vị trí. Chức năng có thể không khả dụng khi trình duyệt chặn lưu trữ hoặc thiếu Web Crypto; bài và điều hướng vẫn hoạt động.

7 kiểm tra riêng Chromium đạt: 21 mục mobile, Escape/focus, nhảy đúng mục, trạng thái đang đọc, lưu vị trí riêng từng bài, bỏ vị trí không còn tồn tại và vẫn dùng được khi chặn storage. Đã xem ảnh menu mobile và bài desktop. 11 kiểm tra giao diện tài khoản, 26 HTTP, 5 nhóm SEO/25 trang trên bản v6 đạt; production build đạt. Không gửi dữ liệu ra mô hình ngoài.

## Giới hạn đánh giá giá trị trả phí

Các kiểm tra kỹ thuật và hồ sơ tổng hợp chưa thay thế chuyên gia thẩm định hoặc phản hồi khách hàng thật. Chủ website hỏi bài đã đáng trả tiền chưa: đã trả lời cần cải thiện tổng hợp xu hướng từng giai đoạn, ưu tiên theo nhu cầu/hoàn cảnh tự nguyện, rồi đọc thử có đối chiếu. Những ý này là đề xuất tiếp theo, chưa được triển khai như một phần v6. Thanh toán vẫn tắt theo yêu cầu.

Đã cập nhật v6 lên VM: production build và kiểm tra tạo bài trực tiếp đạt, xác nhận bài có đúng phiên bản từ mã nguồn vừa triển khai. Backup trước cập nhật: `storage/backups/release-20261106T074301Z`. SHA256 gói triển khai: `99be1bfa3581b613f5ddcc1eae844695c11a6534afe0ef8863c3c32b59d9548d`. Tài khoản kiểm thử được xóa, thanh toán vẫn tắt. Việc cập nhật dịch vụ nội bộ không đồng nghĩa tên miền đã mở công khai.
