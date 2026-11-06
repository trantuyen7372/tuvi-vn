# Tối ưu kho dữ liệu và bundle — 06/11/2026

## Thay đổi

Tách `lib/birth-input.ts` (kiểu input, giờ sinh, validate/query/identity) khỏi engine. Tách lưới cung và nhãn cách cục sang module nhẹ. `tuvi.ts` và engine cách cục có `server-only`; CLI kiểm thử stub sentinel riêng, không vô hiệu hóa ranh giới build của Next. Trang `/la-so` trước đây là client tự tính chart, nay tính trên server rồi truyền dữ liệu cho `ChartResult` giữ tương tác chọn cung. Ngày âm/tháng nhuận/Tý muộn vẫn cùng thuật toán; URL và định danh lượt giữ nguyên.

Kho `record-zstd-v1` có frame độc lập cho từng dòng JSONL và index theo tháng. Key dùng chung cho has/read, gồm Tý muộn qua tháng/năm. Đọc đủ byte theo offset, giới hạn kích thước, checksum frame/raw payload, key và nội dung. Cache 16 index + 8 MiB Buffer bản ghi, không cache cả tháng trong nhánh indexed. Nhánh tháng cũ giữ để rollback. `hasReference()` tại `/api/preview`, `/api/account/readings` và health chỉ kiểm tra index/metadata trong nhánh mới, không đọc hoặc giải nén frame.

Dựng riêng `data/v5-indexed` ở cả local và VM, không chuyển 10 GB qua mạng hoặc sửa kho cũ. Đã đóng gói, đọc lại, đối chiếu 924 tháng và 674.976 bản ghi trên mỗi máy. Tất cả SHA256 dữ liệu nguồn giải nén và 924 index giữa hai máy khớp. Nguồn local 5.690.685.490 byte; nguồn VM đã nén lại 402.627.917 byte; kho indexed 10.711.132.380 byte, khoảng 1,88 lần local và 26,6 lần nguồn VM. Đánh đổi này được đo thực tế; không tuyên bố giảm dung lượng. Còn đủ đĩa, giữ cả kho cũ. Không đưa data/storage/.env vào gói nguồn.

Có compiler, verifier, activation helper và hướng dẫn `deploy/INDEXED-DATASET.md`. Kho niêm phong không được đóng gói lại tại cùng thư mục. Activation chỉ chấp nhận manifest/verification/index đã đối chiếu. Updater mới phải chạy bản staging trong uploads để không tự ghi đè script đang thực thi; sao lưu và rollback cả `.env.local`, mã/build, DB nhất quán. Không đổi schema DB, nginx, DNS hoặc thanh toán.

## Số đo

Bundle JS trang chủ theo production client-reference/build manifests: raw 1,103,498 → 574,136 byte (giảm 529,362); gzip tính local 340,883 → 177,426 (giảm 163,457); Brotli 282,170 → 150,118. Đây là tập chunk theo manifest và nén tính local, không phải số đo mạng hoặc Core Web Vitals. Build xác nhận ranh giới server-only.

Tra đủ nội dung + polish, 48 lượt xen kẽ bốn tháng, tắt cache bản ghi: trung vị 73.061 → 3.441 ms; p95 134.096 → 8.266 ms; frame điển hình 15,608 byte. Batch 24 lượt nhường event loop giữa các lượt: độ trễ event loop tối đa 165.15 → 10.36 ms. Đọc/giải nén vẫn đồng bộ ở quy mô một bản ghi; không tuyên bố event loop hoàn toàn không bị chặn.

API `/api/preview` local, cùng 40 ngày sinh tổng hợp, 8 yêu cầu đang chạy, đo lại khi không có bài kiểm thử khác chạy xen: trung vị 1203.87 → 632.8 ms, p95 2749.25 → 1475.11 ms, tổng 8303.61 → 4372.17 ms. Bao gồm tính chart/cách cục; vì vậy không đồng nhất với thời gian đọc frame. Đây không phải đo tải thực tế trên tên miền hoặc cam kết năng lực phục vụ.

## Kiểm tra

`reports/indexed-integration-checks.json`: tồn tại kiểm tra đủ 924 tháng, không đọc frame, không giải nén; một lookup đọc 15.711 byte và một frame. Các hash index giữa hai máy khớp. Pilot đối chiếu toàn bộ 2.880 nội dung, giải nén riêng các frame rồi nối byte về nguyên JSONL, kiểm tra Tý qua năm/tháng nhuận, invalid key, file thiếu/cắt ngắn, đổi tệp làm cache mất hiệu lực, checksum, offset/hash/key sai, đọc thiếu byte và giới hạn cache.

29 lời luận/78 lá số và 16 commerce đạt sau tách input. 26 HTTP tài khoản, 5 bảo vệ tùy chọn và 5 nhóm SEO/25 trang đạt với kho indexed. 11 UI tài khoản và 11 UI đọc/cá nhân hóa đạt trên build mới; 10 kiểm tra điều hướng/chart gồm validate form, chọn cung, 12 cung không tràn ngang và có chart thật trong HTML khi tắt JavaScript. Đã xem ảnh chart mobile. Production build và preflight indexed đạt. Không gọi mô hình ngoài, không thử tiền/email thật. Bản luận vẫn v7 vì không đổi nội dung dữ liệu/quy tắc.

Không dùng kết quả tối ưu kỹ thuật để khẳng định bài đã đáng trả tiền hoặc website đã public. Trạng thái cập nhật máy chủ được ghi sau khi smoke thành công.

Đã cập nhật máy chủ thành công bằng updater staging và chọn `data/v5-indexed`. Build Node 24.22.2 đạt, preflight nhận `record-zstd-v1` đủ 924 tháng không có issue; smoke trực tiếp tạo bài, tổng hợp giai đoạn, lưu/xóa hoàn cảnh, giữ số lượt và xóa tài khoản kiểm thử đạt. Backup trước cập nhật: `storage/backups/release-20261106T093406Z` (gồm cấu hình cũ). SHA256 gói nguồn đã triển khai: `065fe475947ed3fc61b6e87e7ed35763215fbf03e9858b437f85cb1d156bd700`. Kho cũ vẫn giữ; thanh toán và cấu hình tên miền/HTTPS không thay đổi. Kiểm tra pilot cuối đạt 9 nhóm, không dùng giải nén cả tệp nối frame bằng helper Node.
