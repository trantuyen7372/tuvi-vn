# Đưa xemtuvionline.vn lên Google

## 1. Hoàn tất truy cập công khai

Triển khai bản mã đã kiểm tra theo quy trình của [máy chủ hiện có](README.md).
Xác nhận DNS trỏ đúng máy, HTTPS hợp lệ và nginx đã phục vụ ứng dụng thay vì
trang chờ 503. Tình trạng trong tài liệu triển khai cũ không thay thế kiểm tra
trực tiếp ở thời điểm ra mắt.

Kiểm tra các URL sau từ mạng bên ngoài:

- `https://xemtuvionline.vn/`: HTTP 200, không có `noindex` trong HTML/HTTP header.
- `https://xemtuvionline.vn/robots.txt`: cho phép trang công khai, trỏ đúng sitemap.
- `https://xemtuvionline.vn/sitemap.xml`: HTTP 200, URL dùng HTTPS và tên miền chính.
- `/huong-dan`, `/huong-dan/cach-doc-la-so-tu-vi`, `/sao/tu-vi`: HTTP 200.

Không mở công khai dữ liệu sinh, tài khoản, đơn hàng hoặc bài luận riêng để lấy
thêm trang SEO. Các đường dẫn riêng vẫn có `noindex` và không xuất hiện trong
sitemap. `robots.txt` và `noindex` không phải cơ chế xác thực truy cập.

## 2. Xác minh Google Search Console

Chủ tên miền đăng nhập [Google Search Console](https://search.google.com/search-console).
Ưu tiên thêm thuộc tính **Domain** `xemtuvionline.vn`, sao chép bản ghi TXT do Google
cấp vào DNS, rồi bấm xác minh. Không tự tạo mã xác minh giả.

Nếu dùng thuộc tính **URL prefix** `https://xemtuvionline.vn/` với phương thức thẻ HTML:

1. Lấy riêng giá trị `content` từ thẻ `google-site-verification` Google cung cấp.
2. Đặt `GOOGLE_SITE_VERIFICATION` trong môi trường production hoặc `.env.local`
   trên máy chủ. Không dán cả thẻ HTML, không thay `SITE_ORIGIN` thành địa chỉ preview.
3. Build lại và khởi động ứng dụng theo quy trình cập nhật. Các trang tĩnh được
   render lúc build nên chỉ restart có thể chưa cập nhật thẻ.
4. Kiểm tra mã nguồn HTML trang chủ có thẻ xác minh đúng, rồi bấm xác minh trong Google.

Xác minh Domain qua DNS không cần biến môi trường trên. Chỉ người có quyền tài khoản
Google và DNS mới thực hiện được các thao tác này.

## 3. Gửi sitemap và kiểm tra URL

Trong **Sitemaps**, gửi `https://xemtuvionline.vn/sitemap.xml`.
Dùng **URL Inspection** để kiểm tra trang chủ, trang hướng dẫn chính và vài trang sao.
Chạy kiểm tra trực tiếp, xem HTML Google nhận được và yêu cầu lập chỉ mục cho những
trang quan trọng nếu đủ điều kiện. Không yêu cầu lập chỉ mục URL cá nhân có token.

Sitemap giúp phát hiện URL; gửi thành công không bảo đảm được lập chỉ mục hoặc tăng hạng.
Search Console là nguồn kiểm tra tình trạng index; truy vấn `site:` chỉ hỗ trợ quan sát.

## 4. Kiểm tra kỹ thuật khi cập nhật

Chạy `npm run build`, khởi động bản production trên cổng riêng rồi chạy:

```sh
SEO_TEST_BASE_URL=http://localhost:3100 npm run test:seo
```

Bộ kiểm tra xác nhận metadata, canonical, sitemap, schema Article/breadcrumb,
liên kết tới các đoạn nguồn, khả năng đi tới trang từ trang chủ, HTTP 404 và
`noindex` của các loại trang riêng. Nó không chứng nhận Google đã crawl hoặc index.
Sau khi phát hành, có thể kiểm tra tương tự với URL production.

## 5. Theo dõi mỗi tuần

- Trong **Page indexing**, xem URL quan trọng đã index chưa và lý do bị loại trừ.
- Trong **Performance**, xem truy vấn, lượt hiển thị, lượt nhấp và CTR theo từng trang.
- Trong **Core Web Vitals**, kiểm tra dữ liệu trải nghiệm thực khi Google thu thập đủ.
- Khi có hiển thị nhưng ít nhấp, đối chiếu tiêu đề và nội dung với truy vấn thực tế.
  Khi ít hiển thị, kiểm tra index và chất lượng nội dung trước khi tạo thêm bài.

Bộ từ khóa khởi đầu: lập lá số tử vi miễn phí; cách đọc lá số tử vi; ý nghĩa 12 cung;
nhập ngày âm hay dương; không biết giờ sinh; ý nghĩa từng chính tinh. Đây là giả thuyết
nội dung, chưa phải kết quả đo lượng tìm kiếm hoặc độ cạnh tranh.

Các bài mới có AI hỗ trợ biên soạn và đã nêu điều đó trên trang. Trước khi mở rộng nội dung,
người am hiểu Tử Vi nên đối chiếu bản nguồn, sửa lỗi và bổ sung ví dụ hữu ích. Chỉ thêm
tên người biên soạn/kiểm duyệt và thông tin chuyên môn khi có người thật thực hiện.
Không tạo hàng loạt bài gần trùng nhau hoặc đưa lời luận riêng tư lên Google.

Tài liệu chính thức: [bắt đầu với Search Console](https://developers.google.com/search/docs/monitor-debug/search-console-start),
[tạo và gửi sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap),
[nội dung hữu ích](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).
