import type { Metadata } from 'next';
import { publicMetadata } from '@/lib/seo';
import AlmanacCalendar from '@/components/AlmanacCalendar';
import StructuredData from '@/components/StructuredData';

export const metadata: Metadata = publicMetadata(
  '/xem-ngay',
  'Xem ngày tốt xấu, lịch vạn niên và giờ hoàng đạo | Xem Tử Vi Online',
  'Tra cứu lịch vạn niên theo Âm Dương, xem ngày tốt xấu, giờ hoàng đạo và chọn ngày khai trương, cưới hỏi, xuất hành chính xác theo cổ thư.'
);

const ALMANAC_FAQS = [
  {
    question: 'Ngày hoàng đạo là gì và khác gì ngày hắc đạo?',
    answer: 'Ngày hoàng đạo là ngày có các thiên thần thiện tinh chiếu rọi, mang lại sinh khí tốt lành, rất thích hợp cho các việc lớn như khai trương, cưới hỏi, xuất hành. Ngược lại, ngày hắc đạo là ngày có ác tinh trấn thủ, nên kiêng kỵ các việc đại sự.'
  },
  {
    question: 'Thập Nhị Kiến Trừ (12 Trực) ứng dụng thế nào khi chọn ngày tốt?',
    answer: 'Thập Nhị Trực gồm Kiến, Trừ, Mãn, Bình, Định, Chấp, Phá, Nguy, Thành, Thâu, Khai, Bế. Mỗi trực cai quản một ngày và mang ý nghĩa cát hung riêng cho từng loại công việc cụ thể.'
  },
  {
    question: 'Giờ hoàng đạo trong ngày được tính như thế nào?',
    answer: 'Mỗi ngày có 12 giờ âm lịch (tương ứng 12 địa chi). Trong đó có 6 giờ hoàng đạo (tốt) và 6 giờ hắc đạo (xấu). Khởi giờ hoàng đạo dựa trên địa chi của ngày theo bài thơ Lục Nhật Hoàng Đạo truyền thống.'
  }
];

export default function XemNgayPage() {
  return (
    <main className="editorial-page mx-auto max-w-6xl px-4 py-10">
      <StructuredData data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: ALMANAC_FAQS.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer
          }
        }))
      }} />
      {/* Hero Header Card */}
      <div className="relative mb-8 rounded-2xl border border-[#dcc9af] bg-gradient-to-r from-[#fffdf9] via-[#fcf5e8] to-[#f7eedc] p-6 sm:p-8 shadow-sm">
        <p className="site-eyebrow mb-2">
          <span className="eyebrow-line" /> LỊCH VẠN NIÊN · TRA CỨU CÁT HUNG
        </p>
        <h1 className="font-serif text-3xl font-bold text-son sm:text-4xl">
          Xem ngày tốt xấu & Lịch vạn niên
        </h1>
        <p className="mt-3 max-w-3xl leading-relaxed text-[#5a4a36]">
          Tra cứu ngày Âm Dương, Can Chi, Thập Nhị Trực, sao Nhị Thập Bát Tú và 6 khung giờ Hoàng Đạo mỗi ngày. 
          Chọn ngày đẹp cho các công việc trọng đại như khai trương, cưới hỏi, xuất hành, nhập trạch và ký kết hợp đồng.
        </p>
        <p className="mt-2 text-xs text-[#8c6729]">
          Đối chiếu với <a href="/huong-dan/cach-doc-la-so-tu-vi" className="text-son underline font-medium">hướng dẫn đọc lá số</a> hoặc tra cứu <a href="/sao" className="text-son underline font-medium">14 chính tinh</a> để hiểu rõ ngũ hành tương sinh tương khắc.
        </p>
      </div>

      {/* Main Interactive Calendar Widget */}
      <AlmanacCalendar />

      {/* Educational Knowledge Section */}
      <section className="mt-12 rounded-2xl border border-[#e5d8c3] bg-[#fffefa] p-6 sm:p-8 shadow-sm" aria-labelledby="almanac-guide-heading">
        <h2 id="almanac-guide-heading" className="font-serif text-2xl font-bold text-son">
          Kiến thức về cách xem ngày tốt xấu theo cổ truyền
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-[#ebdcc7] bg-[#fffdf9] p-5">
            <h3 className="font-serif text-base font-bold text-[#352516]">1. Hoàng Đạo & Hắc Đạo</h3>
            <p className="mt-2 text-xs leading-relaxed text-[#5c4a35]">
              Vòng 12 thần tinh chuyển động theo từng tháng âm lịch. 6 vị thần cát (Thanh Long, Minh Đường, Kim Quỹ, Kim Đường, Ngọc Đường, Tư Mệnh) quản ngày Hoàng Đạo mang lại sinh khí thuận lợi.
            </p>
          </div>

          <div className="rounded-xl border border-[#ebdcc7] bg-[#fffdf9] p-5">
            <h3 className="font-serif text-base font-bold text-[#352516]">2. Thập Nhị Trực</h3>
            <p className="mt-2 text-xs leading-relaxed text-[#5c4a35]">
              12 trực biểu thị chu kỳ biến đổi của vạn vật: Kiến, Trừ, Mãn, Bình, Định, Chấp, Phá, Nguy, Thành, Thâu, Khai, Bế. Trong đó trực Thành, Khai, Định là những ngày đại cát cho việc trọng đại.
            </p>
          </div>

          <div className="rounded-xl border border-[#ebdcc7] bg-[#fffdf9] p-5">
            <h3 className="font-serif text-base font-bold text-[#352516]">3. Nhị Thập Bát Tú</h3>
            <p className="mt-2 text-xs leading-relaxed text-[#5c4a35]">
              28 chòm sao thiên văn cổ đại chủ quản từng ngày trong tuần. Các sao như Phòng, Vĩ, Cơ, Đẩu, Thất, Bích, Lâu, Vị, Trương là đại cát tinh phù trợ tài lộc và gia đạo vững bền.
            </p>
          </div>
        </div>

        <div className="mt-6 border-t border-[#ebdcc7] pt-4 text-xs text-[#705e49] leading-relaxed">
          <p>
            <b>Lưu ý khi chọn ngày:</b> Ngày tốt là ngày hòa hợp giữa thiên thời (tiết khí, hoàng đạo), địa lợi (phương hướng) và nhân hòa (tuổi tác gia chủ). Cần tránh ngày có địa chi xung trực tiếp với tuổi của người đứng đầu khởi sự.
          </p>
        </div>
      </section>
    </main>
  );
}
