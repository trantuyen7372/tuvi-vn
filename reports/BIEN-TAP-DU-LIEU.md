# Kết quả quét và biên tập dữ liệu tiếng Việt — 05/11/2026

Đã xử lý đủ 924 tệp tháng, từ 1950-01 đến 2026-12; đọc và kiểm tra JSON của 674.976 lá số với 8.774.688 mục luận giải. Số lá số ở mỗi tháng khớp số ngày × 12 giờ × 2 giới tính. Chữ ký dung lượng/thời gian sửa của từng tệp đã được đối chiếu khi gộp báo cáo để tránh dùng kết quả quét cũ.

Không phát hiện các lỗi đã quét: chữ Hán thuộc các vùng CJK cơ bản, mở rộng A và tương thích; token dạng ⟨…⟩ chưa thay; lặp “Cung Cung”; ký tự thay thế U+FFFD. Không có lỗi phân tích JSON hay đối chiếu nội dung sau nén/giải nén.

Đã biên tập thêm 145 khuôn trong bộ nhớ dịch, với 48 quy tắc sửa dùng chung (gồm 6 quy tắc đợt trước). Các sửa đổi được ghi trực tiếp vào cả 924 tệp nén, tổng cộng 11.496.369 lần thay cụm từ trong đợt này. Bộ nhớ dịch vẫn có 4.238 khuôn, trong đó 21 khuôn chủ động bỏ; tất cả bản dịch không rỗng đều giữ đúng số lượng và chỉ số token của nguyên văn Hán.

Ví dụ: “phân lượng nặng” được diễn đạt bằng “ảnh hưởng lớn” hoặc “giữ vị trí quan trọng” theo câu; “nhân lực thành đoàn đầy đủ” thành “đội ngũ nhân sự đông đủ”; “nhập miếu (sức mạnh)” thành “nhập miếu (sao phát huy mạnh)”. Đã phân biệt tên sao Thái Dương với nghĩa nắng trong câu tắm nắng; giữ nguyên tên sao khi luận lá số.

Đây là một đợt biên tập các cách diễn đạt đã nhận diện trong bộ nhớ dịch và áp dụng cho toàn kho. Kiểm tra tự động không thay thế việc duyệt thủ công từng bài luận; chưa có nguồn Hán gốc trên máy để đối chiếu việc thiếu đoạn hoặc kiểm chứng độ phủ dịch của dữ liệu nguồn. Chưa kiểm thử giao diện website trong trình duyệt ở đợt này.

## Tệp đối chiếu

- `vietnamese-audit.json`: kết quả đầy đủ và thống kê từng tháng.
- `editorial-changes.json`: nguyên văn Hán, bản Việt trước và sau của 145 khuôn.
- `../lib/translation-corrections.json`: danh sách sửa dùng chung cho script và website.
- `../tm/tm.jsonl.before-editorial`: bản bộ nhớ dịch trước đợt biên tập này.

Mức nén nhanh làm kho hiện chiếm khoảng 5,3 GiB, lớn hơn bản ban đầu. Nội dung giải nén đã được kiểm tra khớp trước khi thay từng tệp; có thể nén lại ở mức cao để giảm dung lượng khi chuyển máy.
