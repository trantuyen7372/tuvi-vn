# Tử Vi – lập lá số và luận giải AI (tiếng Việt)

Next.js 16. Cần **Node >= 22.15** (dùng zstd có sẵn trong Node).

## Chạy local
```bash
npm install
cp .env.example .env.local   # chỉ khi chưa có .env.local; cấu hình theo file mẫu
npm run build && npm start   # http://localhost:3100
```

## Thanh toán

Xem [THANH-TOAN-README.md](THANH-TOAN-README.md) để chạy bản thử, cấu hình PayOS, quản trị, email và các kiểm tra. Mã kích hoạt TUVI_CODES đã được thay bằng đơn hàng và mã giảm giá.

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
- Dữ liệu tham khảo: Ziwei Doushu Open Interpretation Dataset v4.0 (674,976 charts × 13 dimensions), CC BY 4.0 – phải giữ dòng ghi nguồn ở chân trang.

## Kho indexed và bundle nhẹ

Đọc `deploy/INDEXED-DATASET.md`. Dùng `scripts/pack-indexed-dataset.mjs` rồi `scripts/verify-indexed-dataset.mjs` để tạo thư mục mới, đối chiếu đủ 924 tháng trước khi trỏ `TUVI_DATASET_DIR` vào đó. Giữ kho tháng cũ để rollback. Bản ghi được đọc theo offset/length; `hasReference` không giải nén. Nén độc lập tốn thêm đĩa: kho mới khoảng 10,7 GB, không coi là cách giảm dung lượng.

Form dùng `lib/birth-input.ts`; engine và cách cục chỉ chạy server. Trang lá số dựng chart trên server, tương tác chọn cung vẫn ở client. `scripts/measure-home-bundle.cjs` lưu kích thước trước/sau theo production manifests. Xem báo cáo `reports/DATASET-BUNDLE-OPTIMIZATION.md` để biết phạm vi phép đo.
