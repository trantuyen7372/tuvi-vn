# SEO và chất lượng bài luận — 06/11/2026

## Đã sửa trong đợt này

- 25 trang công khai có title/mô tả riêng, canonical theo `https://xemtuvionline.vn`, Open Graph và Twitter summary. Không lấy localhost làm URL xuất bản khi build bản trải nghiệm.
- Sitemap và robots dùng tên miền đã xác nhận; không đưa trang tài khoản, lá số cá nhân, đơn hoặc bài riêng vào sitemap.
- Website JSON-LD trên trang chủ; BreadcrumbList đi kèm điều hướng nhìn thấy được trên từng trang sao/cổ thư. Không thêm đánh giá, tác giả hay tổ chức giả để tạo rich result.
- 10 loại trang riêng tư có noindex cả trong HTML và HTTP header; API có header noindex. Giữ cơ chế chặn crawl nội dung riêng tư đang có, không công khai bài khách để làm SEO.
- Trang kiến thức sao không còn hiển thị lời gán bệnh/tai nạn theo sao ở mục sức khỏe.
- Sửa logic luận hạn: một giải thích về bản mệnh không được làm bỏ qua giải thích đại hạn–lưu niên khi cả hai có căn cứ. Bản quy tắc v3; bài quy tắc cũ nâng khi đọc lại mà không trừ lượt.

Build đạt; 5 nhóm kiểm tra SEO qua HTML thực tế đạt trên cả 25 trang công khai, 10 loại trang riêng tư và API. UI tài khoản/bài luận tiếp tục đạt 11 mục. Kiểm tra lời luận đạt 18 mục trên 78 lá số. Đây là kiểm tra kỹ thuật và cấu trúc dữ liệu, không chứng minh chất lượng dự báo.

Đã cập nhật bản này lên VM; build và kiểm tra đăng ký/tạo bài/lưu lượt/xóa dữ liệu thử trực tiếp trên máy chủ đạt. Backup mã/build trước cập nhật: `storage/backups/release-20261106T040438Z`; có backup SQLite nhất quán trước khi thay mã. SHA-256 gói triển khai: `cd874ce68e42c7ade45b59cf062642b744380dd33466f7152e476e466bdeb92c`.

## Đánh giá hướng luận và ưu tiên kế tiếp

Hướng sao/cung → tổ hợp → biểu hiện → lớp hạn là nền phù hợp với cách viết chủ website đã duyệt. Tuy nhiên, nhánh mặc định vẫn dùng bộ quy tắc biên tập xác định; các mẫu câu và tình huống được tái sử dụng. Không coi số bài tạo khác nhau hoặc số kiểm tra đạt là bằng chứng đã đạt mức luận chuyên sâu cá nhân như biên tập thủ công.

Ưu tiên nội dung:

1. Rà đọc 10–20 lá số đại diện, chọn 3–5 điểm thực sự nổi bật của từng bài, sửa câu chung chung và mâu thuẫn trước khi bổ sung độ dài.
2. Bổ sung tổ hợp có căn cứ, đặc biệt liên kết nghề nghiệp–nguồn lực và gia đình–công việc; bộ tổng hợp hiện còn ít tình huống chuyên biệt.
3. Nếu cần luận sát hoàn cảnh, cân nhắc thông tin ngữ cảnh do khách tự chọn như đang đi làm/kinh doanh và chủ đề quan tâm; không suy từ ngày sinh rằng khách chắc chắn đã có gia đình, nghề hay tài sản nào.
4. Đánh giá chất lượng bằng đọc đối chiếu và phản hồi thực tế. Không hứa sự kiện tương lai, tuổi giàu, lợi nhuận, bệnh hoặc hôn nhân chỉ từ vị trí sao.

## Chưa được xác nhận

DNS/HTTPS và cấu hình mở công khai còn chờ từ các đợt trước; chưa có bằng chứng Google lập chỉ mục hoặc dữ liệu Search Console. Chưa đo Core Web Vitals trên tên miền thật và thiết bị/người dùng thực. Không khẳng định đạt Lighthouse 100, chuẩn SEO tuyệt đối hay thứ hạng tìm kiếm. Chưa thêm ảnh chia sẻ riêng.

Đối chiếu [SEO Starter Guide của Google](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) và [hướng dẫn cho nhà phát triển](https://developers.google.com/search/docs/fundamentals/get-started-developers): nội dung dễ đọc, hữu ích cùng metadata và cấu trúc URL là các phần cần làm; thêm các thẻ kỹ thuật không thay cho chất lượng nội dung.
