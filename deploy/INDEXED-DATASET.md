# Kho tra theo bản ghi — record-zstd-v1

Nội dung giữ nguyên từ kho Việt hóa hiện có, giữ thông tin ghi nguồn của dự án. Đóng gói khác cách truy cập, không biên tập lại lời luận.

Mỗi tháng gồm `YYYY-MM.records.zst` và `YYYY-MM.index.json`. File data nối các zstd frame độc lập, mỗi frame là một dòng JSONL gốc, gồm dấu xuống dòng nếu có. Index có phiên bản, tháng, số byte và SHA256 data, SHA256 dữ liệu gốc sau giải nén, và bản đồ key → `[offset, compressedBytes, rawBytes, rawSha256]`. Offset tính theo byte từ đầu file data. Reader/verifier luôn giải nén từng frame theo index; không dùng một lần `zstdDecompressSync` cho cả tệp nối frame (helper trên Node local có thể chỉ trả frame đầu). Reader giới hạn index 512 KiB, tối đa 1.000 entry/tháng, bản ghi 4 MiB, cache 16 index và 8 MiB Buffer bản ghi. Đây không phải giới hạn toàn bộ bộ nhớ tiến trình.

Chuẩn hóa key dùng chung `lib/dataset-key.ts`, gồm Tý muộn chuyển ngày/tháng/năm. `hasReference()` chỉ dùng index và metadata tệp; `lookupReference()` đọc đủ số byte bằng positional read, giải nén một frame, kiểm tra SHA256, key và payload. Index xác nhận có bản ghi, không hứa phát hiện hỏng nội dung frame mà chưa đọc; lúc đọc thật vẫn kiểm tra checksum. `fs.readSync`/giải nén vẫn đồng bộ nhưng phạm vi nhỏ, không tuyên bố hoàn toàn không chặn event loop.

## Tạo và đối chiếu

Dùng Node >=22.15 có zstd. Luôn xuất thư mục mới, không ghi lên kho đang chạy:

```
node scripts/pack-indexed-dataset.mjs --source data/v4-vi --target data/v5-indexed --workers 3
node scripts/verify-indexed-dataset.mjs data/v5-indexed
```

Có thể thử vài tháng với `--months 1950-02,1992-04,2000-01,2026-12 --target data/indexed-pilot`. Pilot không đủ điều kiện kích hoạt ứng dụng.

Đóng gói so byte sau roundtrip mọi frame; bước verify đọc lại toàn bộ data trên đĩa, so checksum từng frame và đối chiếu chuỗi byte giải nén với SHA256 tháng gốc. `verification.json` khóa manifest và 924 index. Kho đã có verification bị từ chối đóng gói lại; muốn xây lại chọn thư mục khác. Resume chỉ chấp nhận các tháng đã có đúng hash nguồn/data/level. Tệp `.tmp-*` sau lỗi không được coi là dữ liệu sẵn sàng; không kích hoạt kho chưa xong.

## Chuyển ứng dụng và quay lại

Sau khi sao lưu `.env.local` riêng, có thể dùng:

```
node scripts/activate-indexed-dataset.mjs data/v5-indexed
```

Restart ứng dụng sau đổi cấu hình. Helper chỉ đổi `TUVI_DATASET_DIR`, kiểm tra dấu đối chiếu và hash index trước khi ghi. Ứng dụng không dùng kho indexed chưa có verification khớp manifest. Giữ `data/v4-vi` để rollback; không xóa dữ liệu cũ hoặc DB khách. Chỉ đổi lại đường dẫn và restart nếu cần quay về.

Trên VM, tạo kho từ nguồn đã có ngay trên VM, không cần truyền 10 GB từ máy local. Upload updater mới sang `uploads/update-preview-indexed.sh` để script đang chạy không tự bị ghi đè khi bung gói nguồn, xác minh SHA256 gói, rồi chạy:

```
INDEXED_DATASET_DIR=data/v5-indexed bash uploads/update-preview-indexed.sh
```

Updater sao lưu cấu hình mode riêng cùng mã/build/DB, đổi đường dẫn sau khi kiểm tra, build, preflight và smoke. Khi lỗi, khôi phục cả cấu hình, mã và build; hai thư mục dữ liệu vẫn giữ nguyên. Không đổi DNS, nginx hoặc thanh toán.

Đợt đầu: bản indexed 10.711.132.380 byte cho 674.976 bản ghi; nguồn local 5.690.685.490 byte, nguồn đã nén lại trên VM 402.627.917 byte. Dung lượng là đánh đổi thực tế của frame độc lập; cần dự trù đĩa cho cả kho mới và cũ. Không dùng số giảm thời gian tra đơn lẻ để hứa tốc độ toàn website.
