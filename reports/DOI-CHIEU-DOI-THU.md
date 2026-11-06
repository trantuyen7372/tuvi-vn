# Đối chiếu và các cải thiện đã áp dụng — 05/11/2026

Chỉ đối chiếu thông tin công khai; chưa mua sản phẩm hoặc kiểm chứng độ chính xác của lời luận, doanh thu, tốc độ và trải nghiệm di động của đối thủ. Không có cơ sở xếp hạng site mình tốt hơn họ.

| Website | Quan sát công khai | Hướng áp dụng cho site mình |
|---|---|---|
| [Tử Vi Online](https://tuvionline.vn/ho-tro/huong-dan-su-dung/) | Gói trọn đời 230.000đ, tài khoản, quy trình VietQR và hướng dẫn đọc cung | Hiển thị giá và các bước rõ; không so giá trực tiếp như hai sản phẩm tương đương |
| [LaSoAI](https://lasoai.vn/dieu-kien-giao-dich) | Mua nội dung bằng xu; có tổng quan miễn phí, tài khoản và quy trình khiếu nại | Giữ cách mua theo lượt đơn giản; bổ sung tổng quan trước trả phí, hỗ trợ khôi phục link sau xác minh |
| [Huyền Cơ Tử Vi](https://tuvi.work/) | Có lá số mẫu, lời luận miễn phí một số cung, hướng dẫn nhập môn và hỏi đáp | Thêm trang mẫu, hướng dẫn nhập giờ/lịch và FAQ; không mở thêm bộ môn ngoài nhu cầu hiện tại |
| [Lý Số](https://lyso.vn/) | Có diễn đàn, thư viện, công cụ và kênh tư vấn | Nhận diện khoảng trống về cộng đồng/nội dung, chưa xây diễn đàn chỉ để có số tính năng tương đương |

## Đã đưa vào site

- Trang chủ có phần miễn phí/trả phí, quy trình ba bước, bảng giá từ cấu hình chung và FAQ.
- `/bai-luan-mau`: ba trích đoạn từ kho Việt hóa cho lá số minh họa; ghi rõ không phải bài AI trả phí hoặc dữ liệu khách hàng.
- Tổng quan miễn phí ngay trên trang lá số. API chỉ trả một đoạn tối đa khoảng 700 ký tự, không gọi AI, không trừ lượt và không trả toàn bộ tài liệu tham khảo.
- Giải thích giá sau coupon, gói gia đình, không gia hạn định kỳ và quyền xem lại.
- Nhãn ô nhập, cảnh báo giờ sinh/tháng nhuận, vùng cuộn riêng cho lá số trên màn hình nhỏ, nút có kích thước chạm tối thiểu và trạng thái focus bàn phím.
- Quản trị có thể cấp lại link đơn sau khi xác minh; link đơn cũ bị thu hồi, các bài đã lưu giữ nguyên. Chưa có tự khôi phục qua email hoặc tài khoản khách hàng.
- Bài hoàn thành ngừng thăm dò trạng thái; sửa xử lý tiến trình AI chết, trả lượt và ngăn tiến trình cũ ghi đè bài mới. Không gửi họ tên sang mô hình AI.

## Kết quả kiểm tra

Build production và 42 kiểm tra đạt (16 nghiệp vụ, 26 HTTP). `npm audit --omit=dev --audit-level=high` trả 0 vulnerabilities tại thời điểm kiểm tra. Đã chạy thử sao lưu SQLite trên DB demo và kiểm tra `quick_check` đạt.

**Đã kiểm thử UI local qua Chromium riêng/Playwright:** 27 kiểm tra đạt, đã chụp và xem ảnh. Công cụ Chrome/CUA vẫn lỗi nhưng không còn chặn việc kiểm thử local. Chi tiết và giới hạn phạm vi ở `UI-REVIEW.md`. Chưa thay thế thử trên tên miền HTTPS, Safari hoặc điện thoại vật lý.

## Sẵn sàng triển khai ở mức nào?

`reports/preflight-preview.json` đạt điều kiện kỹ thuật để chuẩn bị bản xem thử: Node/SQLite/zstd có sẵn, đủ 924 tháng và có build. Đây là kết quả ở máy local.

`reports/preflight-live.json` chưa đạt: còn thiếu tên miền HTTPS, mật khẩu quản trị, PayOS, email và thông tin vận hành trong cấu hình kiểm tra. Chưa thử giao dịch, email hay phí AI thật. Chưa kiểm tra tài nguyên/DNS/Node/cổng trên VM hoặc cài cấu hình server; chưa thay đổi site khác.

Bộ cấu hình và các bước còn cần kiểm tra ở `deploy/README.md`; không tự triển khai khi chủ website chưa xác nhận.
