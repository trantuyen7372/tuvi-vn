# Tử Vi – lập lá số và luận giải AI (tiếng Việt)

Next.js 16. Cần **Node >= 22.15** (dùng zstd có sẵn trong Node).

SEO: xem [hướng dẫn triển khai, xác minh Search Console và gửi sitemap](deploy/SEO.md).
Kiểm tra metadata, sitemap, liên kết nội dung và noindex bằng `npm run test:seo` khi server đang chạy.

Bảo mật: xem [quyền xem bài và cấu hình bảo mật nâng cao](deploy/SECURITY.md).
MFA và khóa backup hiện là tùy chọn, ẩn khi chưa cấu hình. Chạy `npm run test:security` để kiểm tra hồi quy trong DB thử.

Doanh thu: xem [bảng giá, thống kê hành trình và cách phân biệt nguồn truy cập](deploy/REVENUE.md).
Chạy `npm run test:funnel` để kiểm tra số liệu thanh toán và quyền riêng tư của sự kiện.

## Chạy local
```bash
npm install
cp .env.example .env.local   # chỉ khi chưa có .env.local; cấu hình theo file mẫu
npm run build && npm start   # http://localhost:3100
```

## Thanh toán

Xem [THANH-TOAN-README.md](THANH-TOAN-README.md) để chạy bản thử, cấu hình PayOS, quản trị, email và các kiểm tra. Mã kích hoạt TUVI_CODES đã được thay bằng đơn hàng và mã giảm giá.

## Email xác minh và hỗ trợ

Gửi qua Gmail `xemtuvionlinevn@gmail.com`, dùng `MAIL_PROVIDER=gmail`, `SMTP_USER`, `SMTP_PASSWORD` (Mật khẩu ứng dụng Google), `MAIL_FROM` và `SUPPORT_EMAIL` trong `.env.local`. Xem [hướng dẫn cấu hình và kiểm thử](deploy/EMAIL.md). Tài khoản mới nhận 1 lượt sau khi xác minh email; chưa cấu hình mật khẩu ứng dụng thì chưa gửi thư thật. Các trường mật khẩu trong file mẫu để trống.

## Luận AI và thời gian chờ

Đặt `READING_ENGINE=anthropic`, `ANTHROPIC_API_KEY` và `TUVI_MODEL` trong `.env.local`. Mặc định gọi API Anthropic chính thức; chỉ dùng `TUVI_ANTHROPIC_BASE_URL` khi chủ động đổi endpoint. Biến `ANTHROPIC_BASE_URL` kế thừa từ terminal không đổi endpoint của ứng dụng.

Sonnet 5.5 dùng `thinking: between_tools`, effort `medium` cho tác vụ viết bài không dùng tools. Tài liệu giải sẵn được giới hạn tổng cộng 8.000 ký tự, ưu tiên chủ đề khách chọn; dữ liệu an sao, độ sáng, các lớp tứ hóa và các năm đã tính vẫn giữ nguyên. Bài vẫn yêu cầu đủ các mục; chủ đề chính được viết kỹ hơn để tránh lặp ở các phần phụ.

Trong khi gọi API, nội dung được lưu từng đợt tối đa một lần/giây và trang đọc cập nhật mỗi hai giây. Phần đang viết được ghi rõ là bản chưa hoàn tất. Khi có lỗi hoặc chạm trần token, giữ phần đã nhận để đọc, không đánh dấu hoàn thành hoặc gửi email. Thử lại sẽ viết một bản mới; xem lại bài hoàn tất không gọi AI thêm. Không cần thay schema SQLite.

Nhật ký `ai_generation` trong `audit_log` ghi thời gian có chữ đầu tiên, thời gian hoàn tất, token và lý do dừng, không ghi prompt hoặc khóa API. Tốc độ thực tế vẫn phụ thuộc model, độ dài bài và tải nhà cung cấp.

Kiểm tra không tốn phí AI: `node scripts/test-ai-streaming.cjs` chạy generator và SDK thật với máy chủ HTTP SSE cục bộ; `node scripts/test-ai-streaming-ui.mjs` chạy bản production với phản hồi API giả lập trong trình duyệt. Cần `npm run build` trước kiểm tra giao diện. Các phép kiểm tra này xác nhận trạng thái, chống gọi trùng và hiển thị dần, không thay thế phép đo độ trễ hoặc đánh giá chất lượng với API thật.

## Dữ liệu giải sẵn v4.0 (tuỳ chọn, giúp AI luận sâu hơn)
Bộ "Ziwei Doushu Open Interpretation Dataset v4.0" (CC BY 4.0) của dự án ziwei-doushu, 674.976 lá số 1950–2026.
```bash
mkdir -p raw && cd raw
for y in $(seq 1950 2026); do curl -sSfLO https://github.com/Renhuai123/ziwei-doushu/releases/download/v4.0-13d/year-$y.jsonl.zst; done
cd .. && node scripts/build-dataset.mjs raw data/v4   # ~1 giờ, ra khoảng 250 MB
```
Script chỉ giữ các mục cần cho luận giải, bỏ toàn bộ câu trích Nghê Hải Hạ (giấy phép phi thương mại), chia theo tháng để tra nhanh (~0,2 giây/lá số).
Không có thư mục này web vẫn chạy, AI chỉ luận từ dữ liệu lá số.

## Nguồn và giấy phép
- An sao: iztro (MIT).
- Nhận diện cách cục (lib/patterns/engine.ts), dữ liệu sao, trích cổ thư: chuyển từ ziwei-doushu (MIT), đã Việt hoá, bỏ phần Nghê Hải Hạ.
- Dữ liệu tham khảo: Ziwei Doushu Open Interpretation Dataset v4.0 (674,976 charts × 13 dimensions), CC BY 4.0.

## Kho indexed và bundle nhẹ

Đọc `deploy/INDEXED-DATASET.md`. Dùng `scripts/pack-indexed-dataset.mjs` rồi `scripts/verify-indexed-dataset.mjs` để tạo thư mục mới, đối chiếu đủ 924 tháng trước khi trỏ `TUVI_DATASET_DIR` vào đó. Giữ kho tháng cũ để rollback. Bản ghi được đọc theo offset/length; `hasReference` không giải nén. Nén độc lập tốn thêm đĩa: kho mới khoảng 10,7 GB, không coi là cách giảm dung lượng.

Form dùng `lib/birth-input.ts`; engine và cách cục chỉ chạy server. Trang lá số dựng chart trên server, tương tác chọn cung vẫn ở client. `scripts/measure-home-bundle.cjs` lưu kích thước trước/sau theo production manifests. Xem báo cáo `reports/DATASET-BUNDLE-OPTIMIZATION.md` để biết phạm vi phép đo.
