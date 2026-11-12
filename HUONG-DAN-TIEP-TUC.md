# Hướng dẫn cho AI khác: tiếp tục dự án website Tử Vi (tiếng Việt)

## Giao diện mobile — 12/11/2026

Hoàn tất phần chỉnh giao diện đang dở: rút gọn giới thiệu, đưa form sinh lên cao, tăng cỡ chữ và vùng bấm; menu mobile giữ Lập lá số và Khám phá cùng hàng. Trang kết quả có tổng quan Mệnh/Thân/đại hạn, CTA đọc luận và cửa sổ phóng to 12 cung; chọn cung đồng bộ với trang chính. Nút đóng luôn nhìn thấy khi cuộn cửa sổ, Escape trả focus về nút mở. Giữ màu kem/đỏ trầm và bố cục desktop.

Build, typecheck và 15 nhóm Chromium đạt ở 320/390/768/1440px; đã xem ảnh trang chủ, menu và cửa sổ phóng to sau sửa. Chạy lại bằng `npm run preview:customers`, rồi `npm run test:mobile`; kết quả và ảnh ở `outputs/mobile-usability/`. Đọc `reports/MOBILE-USABILITY.md`. Chỉ kiểm tra local với DB preview, chưa triển khai VM hoặc thử Safari/thiết bị thật.

## Email xác minh qua Gmail — 09/11/2026

Chủ website xác nhận địa chỉ gửi và nhận hỗ trợ `xemtuvionlinevn@gmail.com`. Đọc `deploy/EMAIL.md`. Gửi qua Gmail SMTP TLS 465 bằng Nodemailer; `MAIL_PROVIDER=gmail`, `SMTP_USER`, `SMTP_PASSWORD` (Mật khẩu ứng dụng Google), `MAIL_FROM`, `SUPPORT_EMAIL`. Email xác minh/khôi phục/bài luận gửi tới từng khách; Reply-To về Gmail hỗ trợ, không tự BCC dữ liệu khách. Giữ tương thích Resend khi chọn rõ provider. Đã cấu hình địa chỉ ở `.env.example` và local riêng; mật khẩu để trống, chưa gửi thư thật hoặc triển khai server.

Mẫu thư HTML/văn bản thuần, hạn xác minh 24 giờ/reset 30 phút; thông báo gửi thành công/thất bại lưu trong audit chỉ gồm mã tài khoản/trạng thái/thời điểm. Dashboard có gửi lại, hướng dẫn kiểm tra Spam, nhận cập nhật xác minh từ tab khác. Link hết hạn có đường về tài khoản để gửi lại. Xác minh xong không hiện nút xác nhận lần nữa. Chính sách một lượt vẫn được giữ.

Build/typecheck đạt, 8 nhóm HTTP email, 7 nhóm SMTP, 6 nhóm cấp lượt, 31 HTTP khách, 5 nhóm Chromium email và 11 UI khách đạt. Đã xem ảnh mẫu thư/trang tài khoản mobile. Mô phỏng dùng sender code thật + HTTP/SMTP loopback và SQLite riêng, không gọi Gmail/Resend thật. Postman CLI 1.13.1 không có Simulation/status nên bỏ qua tìm mock của nhà cung cấp; báo cáo ghi rõ hạn chế. Không suy ra Inbox hay Google đã chấp nhận mật khẩu. Local đang chạy `preview:customers` cổng 3100. Dependency đã đổi; updater preview cũ chặn lockfile khác, cần `npm ci` khi triển khai.

## Chính sách lượt trải nghiệm — 09/11/2026

Tài khoản mới nhận đúng 1 lượt sau khi xác minh email, kể cả khi bật bán hàng. Chưa xác minh không tạo đơn welcome hoặc dùng lượt welcome cũ; vẫn lưu lá số và xem lại bài đã có. Xác minh qua link đặt lại mật khẩu cũng chứng minh quyền sở hữu email và chỉ cấp một lần. Đăng nhập, xác minh lại, reset và tải lại tài khoản không cộng thêm lượt. `FREE_READING_CREDITS` mặc định 1, giới hạn tối đa 1 để cấu hình cũ 3 không cấp sai; đặt 0 để tắt. Giữ nguyên số lượt đã cấp và bài đã lưu cho tài khoản cũ. Chưa cập nhật máy chủ trong đợt thay đổi này.

Typecheck/build đạt; 6 nhóm kiểm tra cấp lượt và xác minh (`node scripts/test-welcome-credits.cjs`), 16 commerce, 31 HTTP khách và 11 nhóm Chromium tài khoản đạt. Kiểm thử dùng DB thử và link email demo, không gửi email hoặc nhận tiền thật. `smoke-server.mjs` tạo token một lần qua quyền truy cập DB cho đúng tài khoản triển khai rồi gọi endpoint xác minh thật; không phải bằng chứng gửi thư thành công. Local chạy `preview:customers` tại cổng 3100.

Người dùng: MINH ĐĂNG, viết tiếng Việt không dấu, trả lời tiếng Việt. Không gắn dòng Claude/Co-Authored-By vào commit.

## Cập nhật tại máy local ngày 05/11/2026
- Dự án hiện ở `/Users/duka/Work/Gin/tuvi-vn`. Bộ nhớ dịch ở `tm/tm.jsonl`, dữ liệu Việt ở `data/v4-vi` (đủ 924 tệp tháng 1950–2026). Chưa có `data/v4` tiếng Hán gốc ở máy này; không chạy `tm-apply` cho đến khi có nguồn.
- Đã soát 4.238 khuôn: 21 khuôn chủ động bỏ, không còn chữ Hán trong trường `vi`, không lệch token so với `zh`.
- Đã chỉnh 6 khuôn để diễn đạt tự nhiên hơn: tiêu đề nhận định ngắn gọn, ba đến năm năm, tố chất làm quân sư, tập trung một hướng, chia tay rồi tái hợp, ảnh hưởng mạnh của sao. Bản TM trước sửa: `tm/tm.jsonl.before-polish`.
- `node scripts/tm-polish.mjs --apply` áp dụng cùng các chỉnh sửa vào dữ liệu Việt có sẵn, không cần nguồn Hán; bỏ `--apply` để chỉ thống kê. Script chạy lại an toàn, bỏ qua tệp đã sửa; xác minh giải nén trước khi thay tệp.
- `.env.local` và `.env.example` đã trỏ `TUVI_DATASET_DIR=data/v4-vi`. Chưa kiểm thử website trong trình duyệt ở đợt soát bản dịch này.
- Danh sách sửa dùng chung: `lib/translation-corrections.json`; `lib/translation.ts` áp dụng khi tra dữ liệu trong `lib/dataset.ts`, nên mọi tháng hiển thị câu đã sửa dù chưa tái xuất tệp nén.
- Đợt tiếp theo đã HOÀN TẤT tái xuất và quét 924/924 tệp: 674.976 lá số, 8.774.688 mục luận giải. Số bản ghi từng tháng khớp số ngày × 24. Không phát hiện chữ Hán (CJK cơ bản/mở rộng A/tương thích), token chưa thay, Cung Cung hoặc ký tự U+FFFD. Mỗi tệp đã kiểm tra JSON và đối chiếu giải nén sau khi ghi.
- Biên tập thêm 145 khuôn bằng 48 quy tắc dùng chung (gồm 6 quy tắc đợt trước); giữ nguyên token và thuật ngữ. Sửa nghĩa thường của Thái Dương trong câu tắm nắng qua modifier `nghia` ở `scripts/tm-lib.mjs`.
- Báo cáo cuối: `reports/vietnamese-audit.json`; đối chiếu trước/sau và nguyên văn: `reports/editorial-changes.json`; tóm tắt: `reports/BIEN-TAP-DU-LIEU.md`. TM trước đợt biên tập: `tm/tm.jsonl.before-editorial`.
- Dữ liệu đã được ghi trực tiếp vào tệp nén. Do dùng mức nén nhanh để hoàn tất toàn kho, dung lượng hiện khoảng 5,3 GiB (lớn hơn bản nén mức 19 ban đầu). Khi cần chuyển máy có thể nén lại ở mức cao; không cần dịch lại.
- Lệnh quét/sửa có lưu tiến độ: `node scripts/audit-vietnamese.mjs --shard=0 --apply` và `--shard=1 --apply` (hai nhóm tháng độc lập), rồi `node scripts/merge-vietnamese-audit.mjs`. Lệnh không có `--apply` chỉ kiểm tra. Chưa thử website trong trình duyệt ở đợt này.


## Cập nhật thanh toán local — 05/11/2026

Đọc `THANH-TOAN-README.md` và phần tiến độ cuối `KE-HOACH-THANH-TOAN.md`. Đã thay TUVI_CODES bằng đơn hàng/coupon/SQLite; cấu hình giá ở `lib/commerce/config.ts`. Build dùng Webpack. Chạy `npm run demo:payments` để thử riêng, mật khẩu quản trị thử ở `storage/demo-credentials.json` (không commit). Chưa nhận tiền/gửi email/AI thật, chưa deploy; UI trình duyệt còn chờ do công cụ kết nối lỗi. Các ghi chú TUVI_CODES bên dưới là lịch sử.

## 1. Dự án là gì
Website Tử Vi tiếng Việt, thu phí, có AI "luận giải lá số". Tên miền dự kiến xemtuvionline.vn (người dùng tự mua). Code ở máy chủ cloud này: `/home/claude/tuvi-vn` (Next.js 16, React 19, iztro, Anthropic SDK). Bản sao mã nguồn: `/mnt/project-files/tuvi/tuvi-vn-src.tar.gz` (có thể đã cũ, hãy tạo lại, xem bước 7). Cần Node >= 22.15 (giải nén zstd có sẵn).

Dữ liệu tham khảo: bộ "Ziwei Doushu Open Interpretation Dataset v4.0" (CC BY 4.0), 674.976 lá số, 1950–2026, đã lọc bỏ trích dẫn Nghê Hải Hạ (giấy phép phi thương mại). Bản lọc gốc tiếng Hán: `/mnt/project-files/tuvi/du-lieu-v4-da-loc.tar` (giải ra `data/v4/YYYY-MM.jsonl.zst`). Phải giữ dòng ghi nguồn CC BY 4.0 ở chân trang.

## 2. Việc đã làm
- Lập lá số bằng iztro, 45 cách cục, 14 chính tinh, trích cổ thư tiếng Việt, prompt cho AI (`lib/prompt.ts`), mã kích hoạt `TUVI_CODES` thay cho cổng thanh toán.
- Dịch TOÀN BỘ dữ liệu v4.0 sang tiếng Việt để web không cần AI dịch. Cách làm: tách mỗi dòng thành "khuôn câu" có chỗ trống ⟨n⟩ (tên sao, cung, số), dịch khuôn một lần, dùng chung cho mọi năm.
  - Bộ nhớ dịch (TM): `/mnt/project-files/tuvi/tm/tm.jsonl`, mỗi dòng `{"zh","vi"}`. `vi:""` nghĩa là bỏ dòng đó (trích bài giảng, dòng lỗi).
  - Đã dịch 100% khuôn của cả 77 năm (lần quét gộp cuối cùng cho kết quả 0 khuôn chưa dịch).
  - Đầu ra tiếng Việt: `data/v4-vi/YYYY-MM.jsonl.zst`.

## 3. Việc cần kiểm tra ngay (bước tiếp theo)
1. Đảm bảo lệnh tạo dữ liệu đã chạy xong cho đủ năm 1950–2026:
   ```bash
   cd /home/claude/tuvi-vn
   for y in $(seq 1950 2026); do node scripts/tm-apply.mjs /mnt/project-files/tuvi/tm/tm.jsonl $y | tail -1; done
   ```
   Không dùng --stats (chế độ đó chỉ thống kê, không ghi file). Mỗi dòng phải ghi `(100.0%)`. Kích thước `data/v4-vi` sau khi xong khoảng vài trăm MB (hiện có thể mới chỉ vài MB nếu chưa chạy xong).
2. Kiểm tra mẫu: giải nén một tháng bằng Node (`zlib.zstdDecompressSync`), tìm chữ Hán `[一-鿿]` (phải 0) và chuỗi lặp "Cung Cung" (phải 0).
3. Trỏ web sang dữ liệu Việt: đặt biến môi trường `TUVI_DATASET_DIR=data/v4-vi` (file `.env.local`). `referenceBlock` trong `lib/prompt.ts` tự nhận bản tiếng Việt.
4. Chạy thử trong trình duyệt thật (quy tắc của người dùng: phải thử trên trình duyệt, không chỉ test code): `npm run build && npm start` rồi mở http://localhost:3100, lập một lá số, bấm luận giải, xem phần "tham khảo" có tiếng Việt tự nhiên không. Không có `ANTHROPIC_API_KEY` thì web chạy chế độ demo.
5. Đọc vài chục dòng ngẫu nhiên của dữ liệu đã dịch để soát lỗi dịch (thuật ngữ: Mệnh, Thân, Hóa Lộc/Quyền/Khoa/Kỵ, "Bát Tọa", "Phó Tiệt", "Phó Tuần"). Sửa lỗi bằng cách sửa `vi` trong `tm.jsonl` rồi chạy lại `tm-apply`.

## 4. Cách thêm/sửa bản dịch (nếu sau này có dữ liệu mới)
```bash
node scripts/tm-extract.mjs <năm> /mnt/project-files/tuvi/tm/tm.jsonl <thư mục lô> 80
# ra <năm>-001.json (khuôn tiếng Hán) và <năm>-001.ex.json (giá trị mẫu cho từng ⟨n⟩)
# dịch ra mảng JSON cùng độ dài, lưu thành vi.json
node scripts/tm-add.mjs <lô>.json vi.json /mnt/project-files/tuvi/tm/tm.jsonl
node scripts/tm-apply.mjs /mnt/project-files/tuvi/tm/tm.jsonl <năm> data/v4-vi --stats
```
Quy tắc dịch:
- Giữ đúng mọi token ⟨n⟩ như bản gốc, mỗi token đúng số lần; `tm-add` từ chối nếu thừa chữ Hán hoặc lệch token.
- ⟨n|than⟩ dùng khi giá trị là người thân (cha mẹ, anh chị em, con cái, vợ chồng, bạn bè, nhà cửa, tiền bạc). Các giá trị khác tự lấy tên Việt của sao/cung.
- （进财）= "(vào tiền)", （掌权）= "(nắm quyền)", （阻碍）= "(trở ngại)", （名声）= "(danh tiếng)".
- Dòng là trích bài giảng hoặc có token hỏng (ví dụ chữ "来" bị nhận nhầm là sao) thì đặt `""`.
- Không dùng heredoc để ghi JSON dài, hãy dùng công cụ ghi file.

## 5. Việc còn lại phía kinh doanh (cần người dùng)
- Mua tên miền xemtuvionline.vn; trỏ DNS A (@ và www) về VM Oracle 138.2.81.196.
- Cấp `ANTHROPIC_API_KEY` thật (mô hình mặc định `TUVI_MODEL`, độ sâu `TUVI_EFFORT`).
- Chọn cổng thanh toán (hiện chỉ có mã kích hoạt `TUVI_CODES`, giá đã chốt theo đối chiếu đối thủ 06/11/2026: 99.000đ/1 lượt, 299.000đ/5 lượt, giá niêm yết gạch ngang 129.000đ/449.000đ).
- Tạo repo git cho dự án.
- Thông báo website với Bộ Công Thương (online.gov.vn) và trang chính sách, vì là site thu phí.

## 6. Triển khai lên VM (CHỈ khi người dùng đồng ý)
VM: `ubuntu@138.2.81.196`, web chạy dưới user `ubuntu`. Thêm một vhost nginx riêng + dịch vụ `npm start -p 3100` (systemd), Let's Encrypt, Cloudflare để chế độ chỉ DNS. Đặt `data/v4-vi` và `.env.local` trên VM. Không đụng tới site Magento (/var/www/minhdang) và velofront.

## 7. Cuối mỗi đợt làm việc
- Nén lại mã nguồn (loại `node_modules`, `.next`, `data/`) vào `/mnt/project-files/tuvi/tuvi-vn-src.tar.gz`.
- Có thể nén `data/v4-vi` thành `/mnt/project-files/tuvi/du-lieu-v4-viet.tar` để người dùng mang đi.
- Cập nhật ghi chú dự án trong bộ nhớ nhóm (`project-tuvi-website.md`).

## Đợt rà soát trước lên server và cải thiện — 05/11/2026

Đọc `reports/DOI-CHIEU-DOI-THU.md` và `deploy/README.md`. Build + 42 kiểm tra đạt, audit production báo 0 vulnerabilities. Đã thêm `/bai-luan-mau`, `/api/preview`, bảng giá/FAQ và hỗ trợ cấp lại link đơn trong quản trị; sửa lỗi lease AI/trả lượt/email. Không gửi tên vào AI. Dataset mặc định đã đổi sang `data/v4-vi`. Có preflight, health, backup SQLite và cấu hình nginx/systemd mẫu, chưa cài lên VM. Preflight preview local đạt, live chưa đạt; vẫn thiếu cấu hình và kiểm thử tiền/email thật. UI trình duyệt còn chưa xác nhận do công cụ kết nối lỗi.

## Đã gỡ chặn kiểm thử giao diện — 05/11/2026

Chủ website đã cho phép Chromium riêng qua Playwright. `npm run test:ui` đạt 27 kiểm tra; đã xem ảnh desktop/mobile. Xem `reports/UI-REVIEW.md` và `outputs/ui-review/report.json`. Đã sửa CTA vào form, nhãn chọn cung và lời thông báo demo/email. Chrome/CUA vẫn lỗi nhưng không còn là blocker cho kiểm thử local. Máy chủ demo local chạy cổng 3100, Chromium kiểm thử chạy ẩn và đóng sau khi hoàn thành. Chưa thử tiền/email/AI thật hoặc triển khai VM.

## Nội dung khách hàng và quyền xem demo — 05/11/2026

Theo yêu cầu chủ website, đã bỏ cách gọi luận giải AI khỏi nội dung/metadata/màn hình khách hàng; giữ mô tả trung thực về bên xử lý dữ liệu trong chính sách bảo mật. Thuật ngữ kỹ thuật vẫn có ở quản trị/nội bộ. Build đạt. Script `scripts/create-demo-access.mjs` tạo gói khách demo đã mở với bài mẫu; thông tin link riêng ở `storage/customer-demo.json` (không commit). Đây không phải tài khoản email/mật khẩu, khách dùng link riêng.

## Cập nhật mới nhất: khách hàng và VM — 05/11/2026

Đọc `reports/CUSTOMER-RELEASE.md`. Chủ website xác nhận xemtuvionline.vn, yêu cầu Pay làm sau. Đã hoàn thiện tài khoản khách và lời luận riêng theo kho Việt hóa; không trả mẫu chung. 26 kiểm tra HTTP và 10 UI mới đạt. Local chạy `preview:customers`, tài khoản demo khách thật ở `storage/customer-demo-access.json`; bài đọc thử chuyên sâu do chủ website yêu cầu nằm trong outputs và DB local riêng. Không công khai mật khẩu/link hoặc ngày giờ sinh trong báo cáo.

Đã triển khai bản trải nghiệm riêng trên VM 138.2.81.196, /srv/tuvi-vn, Node riêng /opt/tuvi-node. Service nội bộ 3100 và backup active, smoke test đăng ký/luận riêng trên VM đạt. Nginx chỉ hiện trang chờ HTTPS (503); DNS chưa có IPv4, chưa cấp HTTPS/mở public; email thật và thông tin hỗ trợ còn chờ. Không sửa Magento/velofront. Phần ghi chú cũ nói chưa có tài khoản/chưa chuyển lên VM là lịch sử, đã được thay bằng cập nhật này.

## Chuẩn cách luận được chủ website phản hồi tích cực — 05/11/2026

Chủ website nhận xét bản cũ chung chung, thiếu diễn giải sao tại cung và xu hướng về sau. Đã biên tập lại bản riêng local `outputs/ban-luan-doc-thu.md`: 11 chương, đủ 12 cung, giai đoạn 33–72 tuổi và các năm 2026–2030. Cách viết: sao + trạng thái + cung → phối hợp các sao/cung → biểu hiện đời sống cụ thể → lớp đại hạn/lưu niên, phân biệt dữ liệu an sao với cách diễn giải truyền thống. Không hứa chắc sự kiện, chẩn đoán sức khỏe hoặc phán số con/tuổi thọ. Chủ website phản hồi: “luan giai nhu hien tai co ve ok hon”. Giữ cách viết này cho các đợt biên tập tiếp theo.

Bản riêng đã cập nhật đúng dòng đọc thử trong DB local, không trừ lượt, không ghi đè bài dataset gốc; URL riêng nằm ở `storage/editorial-preview.json`. Chrome đã mở bản mới. `scripts/check-editorial-preview.mjs` đạt: 11 chương, 11 đích mục lục, không tràn ngang 390px và không lỗi JavaScript. Đã xem ảnh desktop. Cách luận mới hiện mới áp dụng bản biên tập này, chưa tự động áp dụng cho mọi bài trên site; không khẳng định ngược lại. Không chuyển dữ liệu sinh/bản riêng lên VM.

## Đã áp dụng cách luận cho bài tự động và cập nhật VM — 05/11/2026

Theo yêu cầu “làm đi”, đã thay phần ghép nguyên lời kho bằng bộ quy tắc biên tập ở `lib/reading-rules.ts` và `lib/personal-reading.ts`; `lib/reading-timing.ts` tính từng kỳ riêng bằng iztro. Có căn cứ 12 cung, tổ hợp thực tế, đại hạn hiện tại + tối đa hai kỳ sau, năm đã chọn + tối đa bốn năm sau. Vị trí sao ghi theo cung gốc, phân biệt với tên cung xoay theo hạn. Đã sửa đối cung Tử Nữ trong bản biên tập cũ cho đúng Điền Trạch tại Mão (Thái Dương/Thiên Lương), không phải Phụ Mẫu. Đã cập nhật yêu cầu viết cho nhánh mô hình ngoài nhưng chưa gọi API ngoài.

Đọc `reports/READING-UPGRADE.md`. Build đạt, 13 kiểm tra cách luận (78 lá số), 16 kiểm tra commerce, 26 HTTP tài khoản và 11 UI đạt. Bài kho cũ nâng khi xem lại bằng dấu mở đầu chính xác, giữ URL/lượt; không ghi đè bản biên tập riêng. Tổng quan miễn phí và bài mẫu công khai dùng cùng cách luận mới. Chrome local đang mở bài tự động đã nâng cấp; URL ở `storage/customer-demo-access.json`, không công khai thông tin đăng nhập.

Đã cập nhật VM bằng `deploy/update-preview.sh`, backup mã/build và DB trước cập nhật; build Node 24 và kiểm tra tạo bài trên VM đạt. Giữ thanh toán tắt và vhost chờ HTTPS. Cập nhật này thay thế trạng thái trước đó nói mới áp dụng bản riêng. DNS vẫn chưa phân giải IPv4 ở lần kiểm tra; đang chờ chủ website cho biết nơi quản lý DNS, email hỗ trợ và cấu hình email thật để hoàn tất public. Không tự tạo một email hỗ trợ chưa được xác nhận.

## Bài luận v2 và sửa menu sau đăng nhập — 06/11/2026

Chủ website yêu cầu nâng bài luận thêm và báo đã đăng nhập nhưng vẫn hiện nút Đăng nhập. Đọc `reports/READING-NAVIGATION-V2.md`. Đã sửa menu và nút trang chủ theo phiên thực tế, đồng bộ sau thao tác tài khoản và giữa các tab. Chromium đạt 7 kiểm tra riêng cho điều hướng. Không giả lập trạng thái đăng nhập bằng localStorage.

Bài luận v2 thêm tam phương tứ chính, liên kết nghề nghiệp–thành quả, tình huống Lộc/Kỵ có đủ căn cứ và nhìn nhanh từng năm. 17 kiểm tra lời luận/78 lá số, 26 HTTP và 11 UI đạt. Bài v1 được nâng khi xem lại không trừ lượt; dấu phiên bản ẩn tránh nâng lặp. Không ghi đè bản biên tập riêng hoặc bản có ai_usage. Nhánh mô hình ngoài chỉ cập nhật yêu cầu viết, chưa gọi thật.

Đã cập nhật cả local và VM; build và kiểm tra trực tiếp VM đạt. Backup mã/build trước cập nhật tại `storage/backups/release-20261106T025744Z`. Cửa sổ đã mở trước cập nhật cần tải lại để nhận menu mới. Server local hiện chạy `npm run preview:customers`, phiên 15241. Không mở thêm Chrome ẩn danh để tránh gây nhầm với phiên người dùng vừa đăng nhập; trạng thái được xác nhận trên Chromium qua phiên đăng nhập thật của tài khoản kiểm thử riêng.

## Rà SEO và hướng luận — 06/11/2026

Chủ website hỏi SEO và còn tối ưu gì, hướng luận đã ổn chưa. Đọc `reports/SEO-CONTENT-REVIEW.md`. Đã bổ sung canonical/metadata chia sẻ cho 25 trang công khai, sitemap/robots đúng tên miền, JSON-LD Website và breadcrumb có điều hướng thật. Không lập chỉ mục nội dung riêng tư; 10 loại trang có noindex trong HTML và HTTP header. Trang sao bỏ lời gán bệnh theo sao ở mục sức khỏe. Không coi các sửa kỹ thuật là bằng chứng có thứ hạng Google hoặc đã đo Core Web Vitals.

Sửa một nhánh return sớm khiến đã luận bản mệnh thì bỏ sót quan hệ đại hạn/lưu niên; bản quy tắc v3 và nâng bản cũ khi đọc lại. Build đạt, 5 nhóm SEO (25 trang), 18 kiểm tra lời luận (78 lá số), 11 UI đạt. Hướng luận tốt hơn bản cũ nhưng còn dùng nhiều câu mẫu; cần rà nội dung nhiều lá số, mở rộng tổ hợp và đối chiếu hoàn cảnh trước khi coi là bài chuyên sâu trả phí. Không đồng nhất kiểm thử phần mềm với kiểm chứng dự báo. Server local hiện ở phiên 7875.

Đã cập nhật VM cho đợt SEO/bài luận v3; build và kiểm tra chức năng trực tiếp máy chủ đạt. Backup mã/build trước cập nhật: `storage/backups/release-20261106T040438Z`. Chưa có xác nhận Search Console hoặc số đo hiệu năng trên tên miền thật; không báo SEO đã hoàn hảo hay bảo đảm xếp hạng.

## Ba việc nâng cấp bài luận v4 — 06/11/2026

Chủ website yêu cầu làm cả ba việc: chọn 3–5 trọng tâm, mở rộng phối hợp, rà nhiều bài. Đọc `reports/READING-EDITORIAL-REVIEW.md` và `reports/reading-editorial-checks.json`. Bộ dựng bài v4 đã áp dụng các ý trọng tâm có chứng cứ, 16 nhóm liên kết nghề nghiệp–nguồn lực, 20 cặp chủ đề Lộc/Kỵ và năm dạng phối hợp lớp hạn. Năm loại đối chiếu đều đã xuất hiện trong 12 hồ sơ minh họa được sinh từ dữ liệu thật của bộ an sao/kho (không phải khách hàng).

Lưu trước/sau ở `outputs/reading-editorial/`, giảm 24,1% ký tự, đủ 12 cung, không còn đoạn lặp nguyên văn. Rà nội dung phát hiện/sửa đếm trùng Kỵ, diễn nhà cửa bằng từ vựng nghề nghiệp, bỏ sót độ sáng hãm, sao phụ che cặp chính tinh, lời chung về sốt ruột không khớp Thiên Đồng Kỵ và diễn năm tuổi nhỏ bằng hoàn cảnh người lớn. Có trường hợp đại hạn đi qua 18 tuổi: dùng tuổi đang xem cho nội dung, giữ tuổi đầu kỳ cho dữ liệu hạn. Báo cáo nêu rõ phạm vi đọc rà, không tự nhận thẩm định dự báo độc lập.

Bản cũ có dấu phiên bản được nâng khi xem lại mà không đổi URL/trừ lượt; không hạ bản tương lai hoặc thay bài có ai_usage/bản biên tập riêng. Mục lục mặc định thu gọn, các script UI đã mở mục lục trước khi kiểm tra điều hướng. Server local hiện chạy phiên 41762.

Đã cập nhật v4 lên VM, build và smoke test trực tiếp máy chủ đạt (gồm kiểm tra phần trọng tâm và dấu phiên bản). Backup mã/build trước cập nhật tại `storage/backups/release-20261106T045115Z`. Kiểm tra cuối: 23 lời luận/78 lá số, 12 hồ sơ biên tập, 26 HTTP, 11 UI, 7 điều hướng và 5 nhóm SEO đều đạt. Không đổi cấu hình thanh toán/DNS/email. Người dùng mở lại hoặc tải lại bài cũ để nhận bản v4.

## Vòng biên tập tiếp v5 — 06/11/2026

Đọc `reports/READING-ITERATION-V5.md` và `reports/reading-v5-checks.json`. Bổ sung 12 hướng đổi hóa có lời giải riêng theo cung/lớp hạn, căn cứ Thân cư/vô chính diệu, điều kiện khi nói về con cái. Sửa gán đại hạn đầu cho trẻ chưa vào hạn; ngoài phạm vi tuổi/năm thì không bịa hạn và năm. Giờ Tý muộn giao thừa được đối chiếu với Tý sớm ngày sau, giữ cách an sao hiện có.

12 hồ sơ mới + 12 hồi quy đạt, 26 kiểm tra lời luận/78 lá số, 26 HTTP, 11 UI Chromium, 5 nhóm SEO/25 trang, typecheck/build đạt. Phạm vi đọc thủ công có mục tiêu được ghi rõ trong báo cáo. Bản v5 nâng bài cũ khi đọc lại không trừ lượt; bảo toàn bản biên tập riêng. Local đang chạy `preview:customers` phiên 38584.

Đã triển khai v5 lên VM và kiểm tra trực tiếp thành công: build, health, đăng ký, tạo bài riêng, căn cứ sao/cung, hạn tiếp theo và trừ đúng một lượt; dữ liệu tài khoản kiểm thử được xóa. Backup trước cập nhật: `storage/backups/release-20261106T070214Z`. SHA256 gói triển khai: `36cf71df56b70a77188caa4737c0d471f3d7aadcbf1bab539f3877c40ad88ade`. Dịch vụ nội bộ đã cập nhật; không đồng nghĩa tên miền đã mở công khai. Thanh toán, DNS và email giữ trạng thái đang chờ như đợt trước.

## Ba tối ưu v6 — 06/11/2026

Đọc `reports/READING-OPTIMIZATION-V6.md`, `reports/reading-v6-checks.json`, `reports/dataset-cache-checks.json` và `reports/reading-navigation-tests.json`. Bài v6 diễn Lộc theo sao, giảm câu hỏi chung và dẫn lại phối hợp hóa đã giải thích (tách nhóm trẻ/trưởng thành/cao tuổi). Cache LRU Buffer kho tối đa 64 MiB/tiến trình, chỉ giải mã dòng cần tra; dữ liệu tháng thay thì nhận biết lại. Tra đầy đủ local trung vị khoảng 768 ms cũ → 7 ms khi cache ấm, không suy thành tốc độ toàn trang.

Thêm mục lục nhanh, mục đang đọc, lời mời đọc tiếp theo mục lưu riêng từng bài; lưu khóa băm mã bài và mã mục, không nội dung/link riêng. Chromium kiểm tra chặn storage, hai bài độc lập, vị trí cũ và Escape. 27 lời luận/78 lá số, 24 bài biên tập, 7 điều hướng đọc, 11 UI tài khoản, 26 HTTP, 5 SEO/25 trang đạt; build đạt. Local phiên 64466. Không coi các kiểm tra là đủ để chứng minh giá trị trả phí; đã đề xuất nhưng chưa làm tổng hợp giai đoạn sâu hơn/cá nhân hóa nhu cầu/đọc thử với chuyên gia và người dùng thật.

Đã cập nhật v6 lên VM: production build và kiểm tra tạo bài trực tiếp đạt, xác nhận bài có đúng phiên bản từ mã nguồn vừa triển khai. Backup trước cập nhật: `storage/backups/release-20261106T074301Z`. SHA256 gói triển khai: `99be1bfa3581b613f5ddcc1eae844695c11a6534afe0ef8863c3c32b59d9548d`. Tài khoản kiểm thử được xóa, thanh toán vẫn tắt. Việc cập nhật dịch vụ nội bộ không đồng nghĩa tên miền đã mở công khai.

## Tổng hợp và cá nhân hóa v7 — 06/11/2026

Đọc `reports/READING-SYNTHESIS-V7.md`, `reports/reading-v7-checks.json`, `reports/reading-preferences-tests.json`, `reports/reading-navigation-tests.json`. Bài có phần tổng hợp giai đoạn (tối đa 3 ý có nền chính tinh và tác động đúng kỳ), phân biệt tuổi/nhóm hoàn cảnh và thay đổi chủ đề giữa các chặng. Không buộc đủ 3 hoặc coi số yếu tố là xác suất. 24 bài/70 chặng của bộ thử có 2–3 ý; độ dài tăng 29,2% so v6, cần phản hồi người thật về lượng thông tin hữu ích.

Trong bài riêng của tài khoản, mở “Chọn vấn đề bạn muốn đọc kỹ” để chọn chủ đề/hoàn cảnh và ghi chú tự nguyện. Đổi/xóa không trừ lượt hoặc đổi URL; định danh lá số không gồm tùy chọn. API sở hữu riêng, chặn bài manual/future/usage/running. Không gửi ghi chú vào mô hình ngoài; thông tin tự khai hiển thị tách căn cứ. Mục lục 22 phần; nút nổi chỉ hiện sau mục lục đầu, không che form.

29 lời luận/78 lá số, 24 bài, 5 kiểm tra bảo vệ tùy chọn, 11 Chromium đọc/cá nhân hóa, 11 UI tài khoản, 26 HTTP, 16 commerce và 5 SEO/25 trang đạt, build đạt. Local phiên 21983. Đã chuẩn bị bộ đọc thử ở `outputs/reading-review-v7/tai-lieu-doc-thu.tar.gz` và phiếu `reports/PHIEU-DANH-GIA-BAI-LUAN.md`: 24 hồ sơ A/B + 3 ví dụ hoàn cảnh, chưa có người thật chấm; không tự kết luận sẵn sàng thu phí. Chưa liên hệ hoặc gửi dữ liệu cho ai.

Đã triển khai v7 lên VM, production build và kiểm tra trực tiếp đạt: tạo bài đúng phiên bản, có tổng hợp giai đoạn, lưu/xóa hoàn cảnh và giữ đúng số lượt. Tài khoản kiểm thử được xóa. Backup trước cập nhật: `storage/backups/release-20261106T080516Z`. SHA256 gói triển khai: `7884047326ee10ec248485c089da0d4d1d8738cc80e0c5ffe965150e4add654a`. Dịch vụ nội bộ đã cập nhật, không đồng nghĩa tên miền đã mở công khai; thanh toán vẫn tắt.

## Tối ưu frame/index và bundle — 06/11/2026

Đọc `reports/DATASET-BUNDLE-OPTIMIZATION.md` và `deploy/INDEXED-DATASET.md`. Đã tách birth-input/chart-layout/nhãn cách cục; thêm server-only engine, `/la-so` tính chart server rồi render client tương tác. Bundle home giảm 529.362 byte raw, gzip tính local giảm 163.457 byte. Không đổi định danh lượt, nội dung bài vẫn v7.

Kho mới `data/v5-indexed` trên local/VM: 924 tháng, 674.976 frame, 10.711.132.380 byte. Đã đọc lại toàn bộ và so hash nguồn/index khớp giữa hai máy. Kích thước lớn 1,88 lần nguồn local, 26,6 lần nguồn VM nén tháng; giữ kho cũ, dự trù đĩa. `verification.json` niêm phong catalog; activation cần verification khớp manifest/index. hasReference kiểm tra index ở preview/account/health, 924 lần has không đọc/giải nén frame. Đọc thật positional read + checksum/payload; cache 16 index/8 MiB record.

Các phép đo cold/interleaved, event loop và HTTP 40 ngày/8 song song ở reports; không dùng phép đo cache ấm v6 để đại diện khách ngẫu nhiên. 29 lời luận, 16 commerce, 26 HTTP, 5 bảo vệ tùy chọn, 11 UI tài khoản, 11 UI bài đọc, 10 điều hướng/chart, 5 SEO và build/preflight đạt. Local chạy kho indexed, phiên 13260. Bộ pilot vẫn giữ trong data/indexed-pilot, không dùng làm kho live. Updater cần chạy file staging uploads và sao lưu/rollback cả env.

Đã cập nhật máy chủ thành công bằng updater staging và chọn `data/v5-indexed`. Build Node 24.22.2 đạt, preflight nhận `record-zstd-v1` đủ 924 tháng không có issue; smoke trực tiếp tạo bài, tổng hợp giai đoạn, lưu/xóa hoàn cảnh, giữ số lượt và xóa tài khoản kiểm thử đạt. Backup trước cập nhật: `storage/backups/release-20261106T093406Z` (gồm cấu hình cũ). SHA256 gói nguồn đã triển khai: `065fe475947ed3fc61b6e87e7ed35763215fbf03e9858b437f85cb1d156bd700`. Kho cũ vẫn giữ; thanh toán và cấu hình tên miền/HTTPS không thay đổi. Kiểm tra pilot cuối đạt 9 nhóm, không dùng giải nén cả tệp nối frame bằng helper Node.

## CRO trang kết quả/QR — 06/11/2026

Đọc `reports/CRO-RESULT-PAGE.md`. Preview có trích đoạn thật + câu hỏi theo sao/cung/tuổi/khoảng năm, vạch mờ trang trí không chứa lời luận bị che. CTA đầu trang/từng cung/preview dẫn tới vùng mở bài; vùng này đặt trước cách cục. Coupon details, email tài khoản điền sẵn, nhãn gói theo mục đích và quyền lợi đúng phạm vi. Không thêm fake popularity/lifetime hoặc tự chọn gói đắt. Giữ giá đang có 99k/199k/299k và Pay tắt. QR có timer thật, tải PNG, sao chép thông tin từ payload có kiểm tra CRC, hết hạn ẩn thao tác; key theo token tránh giữ đơn cũ. 5 nhóm Chromium CRO, unit QR/3 preview, 26 HTTP, 10 điều hướng và build đạt. QR/paid chỉ test response giả lập, không tiền thật; chưa có đo CR/AOV. Local preview phiên 6401.

Đã cập nhật máy chủ: build/preflight indexed và smoke trực tiếp tài khoản/tạo bài/lượt đạt, thanh toán vẫn tắt. Backup `storage/backups/release-20261106T145308Z`; SHA256 gói nguồn `795460b3eca84c720d2f96a0e2745dae31f7dad21ff432a451ca0f65b258d1ba`. Local phiên 84419. Không đổi DNS/HTTPS.
