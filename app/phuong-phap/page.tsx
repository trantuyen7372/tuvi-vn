import Breadcrumbs from '@/components/Breadcrumbs';
import {publicMetadata} from '@/lib/seo';

export const metadata = publicMetadata('/phuong-phap', 'Phương pháp lập lá số, nguồn nội dung và cách dùng AI', 'Tìm hiểu quy ước ngày giờ sinh, cách tính lá số bằng iztro, nguồn trích yếu cổ thư và vai trò AI trong nội dung Xem Tử Vi Online.');

export default function MethodPage() {
  return <main className="mx-auto max-w-3xl px-4 py-10">
    <Breadcrumbs items={[{name: 'Trang chủ', path: '/'}, {name: 'Phương pháp và nguồn', path: '/phuong-phap'}]}/>
    <h1 className="font-serif text-3xl font-bold text-son">Phương pháp lập lá số và nguồn nội dung</h1>
    <p className="mt-5 text-lg leading-relaxed text-[#5a4a36]">Xem Tử Vi Online là công cụ lập lá số và tìm hiểu cách diễn giải Tử Vi Đẩu Số. Trang này giải thích dữ liệu được tính như thế nào, nội dung đến từ đâu và những giới hạn cần biết khi đọc.</p>
    <section className="mt-8 space-y-4 leading-relaxed"><h2 className="font-serif text-2xl font-bold text-son">Lá số được tính từ dữ liệu bạn nhập</h2>
      <p>Website dùng thư viện mã nguồn mở <a href="https://docs.iztro.com/quick-start" className="text-son underline" rel="noopener noreferrer">iztro</a> để lập các cung, an sao và lấy thông tin vận hạn. Đầu vào gồm ngày sinh, loại lịch, canh giờ, giới tính theo tùy chọn của biểu mẫu và năm xem hạn. Phần tính bố cục lá số được thực hiện bằng mã, không giao cho mô hình ngôn ngữ tự suy đoán vị trí sao.</p>
      <p>Biểu mẫu nhận ngày âm hoặc dương lịch. Tháng nhuận chỉ áp dụng khi chọn âm lịch. Giờ Tý tách thành 0h–1h và 23h–24h theo đầu vào thư viện. Website hiện không có trường nơi sinh, múi giờ hoặc điều chỉnh giờ mùa hè; người sinh ở nước ngoài hoặc sát ranh giới ngày cần lưu ý giới hạn này.</p>
      <p>Phần tổng quan lưu niên dùng mốc 01/07 của năm xem hạn để lấy thông tin sau Tết. Tuổi trên phần vận hạn là tuổi danh nghĩa do thư viện trả về. Các trường phái hoặc phần mềm khác có thể sử dụng quy ước khác, vì vậy cần đối chiếu đầu vào và quy tắc trước khi so sánh.</p>
    </section>
    <section className="mt-8 space-y-4 leading-relaxed"><h2 className="font-serif text-2xl font-bold text-son">Nguồn kiến thức và bản trích yếu</h2>
      <p>Mục <a href="/sao" className="text-son underline">14 chính tinh</a> và <a href="/co-thu" className="text-son underline">cổ thư</a> sử dụng dữ liệu tiếng Việt đã Việt hóa, biên tập từ dự án <a href="https://github.com/Renhuai123/ziwei-doushu" className="text-son underline" rel="noopener noreferrer">ziwei-doushu</a>. Các đoạn cổ thư trên website là bản trích lược và diễn giải; không thay thế một ấn bản nguyên văn có khảo chứng.</p>
      <p>Các bài hướng dẫn và phần mở rộng về sao có AI hỗ trợ biên soạn. Liên kết nguồn trong bài giúp bạn đối chiếu với bản trích yếu và quy ước vận hành của công cụ. Website không gán danh tính chuyên gia hoặc bằng cấp cho nội dung do AI hỗ trợ.</p>
      <p>Tên gọi, quan hệ cung–sao và lời luận phản ánh hệ thống biểu tượng truyền thống. Việc một nội dung được dẫn từ cổ thư không biến nó thành bằng chứng khoa học về tính cách hoặc sự kiện tương lai.</p>
    </section>
    <section className="mt-8 space-y-4 leading-relaxed"><h2 className="font-serif text-2xl font-bold text-son">Vai trò của kho dữ liệu và AI trong bài luận</h2>
      <p>Tùy cấu hình vận hành, bài luận cá nhân có thể dùng kho nội dung tiếng Việt theo lá số hoặc dịch vụ AI để diễn đạt từ dữ liệu cung, sao và vận hạn. Bài luận có thể thiếu ngữ cảnh, diễn giải sai hoặc khác với hoàn cảnh thực tế. Không coi văn phong chi tiết là bằng chứng cho độ chính xác.</p>
      <p><a href="/bai-luan-mau" className="text-son underline">Bài luận mẫu</a> giúp bạn xem cách trình bày trước khi tạo bài riêng. Dữ liệu sinh, đơn hàng và đường link luận giải cá nhân không được đưa vào sitemap công khai. Xem <a href="/chinh-sach/bao-mat" className="text-son underline">chính sách bảo mật</a> để hiểu cách website xử lý thông tin.</p>
    </section>
    <section className="mt-8 space-y-4 leading-relaxed"><h2 className="font-serif text-2xl font-bold text-son">Cách đọc và phản hồi nội dung</h2>
      <p>Hãy bắt đầu từ <a href="/huong-dan/cach-doc-la-so-tu-vi" className="text-son underline">hướng dẫn đọc lá số</a>, kiểm tra dữ liệu sinh rồi mới đọc diễn giải. Nội dung phục vụ tham khảo, giải trí; không dùng để chẩn đoán bệnh hoặc quyết định điều trị, đầu tư hay các quyết định quan trọng khác.</p>
      <p>Nếu phát hiện sai tên sao, liên kết nguồn hoặc đoạn diễn giải, liên hệ qua <a href="/chinh-sach/gioi-thieu" className="text-son underline">thông tin vận hành và hỗ trợ</a>. Gửi đường dẫn trang kiến thức và đoạn cần sửa; tránh công khai ngày giờ sinh hoặc link bài luận riêng.</p>
    </section>
    <a href="/huong-dan" className="btn-outline mt-8">Xem các bài hướng dẫn</a>
  </main>;
}
