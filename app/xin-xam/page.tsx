import type { Metadata } from 'next';
import { publicMetadata } from '@/lib/seo';
import XinXamWidget from '@/components/XinXamWidget';
import StructuredData from '@/components/StructuredData';

export const metadata: Metadata = publicMetadata(
  '/xin-xam',
  'Xin xăm Quan Âm online – 100 quẻ xăm kèm lời giải | Xem Tử Vi Online',
  'Tĩnh tâm xin xăm Quan Âm trực tuyến với 100 linh quẻ cổ truyền, thơ tứ tuyệt, điển cố xưa và lời bình giải chi tiết cho công danh, tài lộc, gia đạo.'
);

const XIN_XAM_FAQS = [
  {
    question: 'Xin xăm Quan Âm online có linh nghiệm không?',
    answer: 'Cổ nhân dạy: "Tâm thành tất ứng". Khi xin xăm trực tuyến, nếu giữ tâm ý thanh tịnh, chuyên nhất hướng thiện và thành tâm cầu lời khuyên thì lời quẻ đều mang tính chiêm nghiệm và soi sáng đường đi rất chuẩn xác.'
  },
  {
    question: 'Mỗi ngày nên xin xăm Quan Âm mấy lần?',
    answer: 'Mỗi ngày chỉ nên xin một quẻ cho một việc muốn hỏi. Tránh việc xin liên tiếp nhiều quẻ cho cùng một việc khiến tâm ý bị phân tán.'
  },
  {
    question: 'Ý nghĩa các thứ bậc quẻ xăm Quan Âm?',
    answer: '100 quẻ xăm Quan Âm được chia thành các bậc: Thượng Thượng (Đại Cát Đại Lợi), Thượng Cát (May Mắn Thuận Lợi), Trung Cát (Trung Bình Cát Lợi), Trung Bình (Bình Thường Ổn Định) và Hạ Hạ (Cần Cẩn Trọng Tích Đức Hóa Giải).'
  }
];

export default function XinXamPage() {
  return (
    <main className="editorial-page mx-auto max-w-5xl px-4 py-10">
      <StructuredData data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: XIN_XAM_FAQS.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer
          }
        }))
      }} />
      {/* Header Card */}
      <div className="relative mb-8 rounded-2xl border border-[#dcc9af] bg-gradient-to-r from-[#fffdf9] via-[#fcf5e8] to-[#f7eedc] p-6 sm:p-8 shadow-sm">
        <p className="site-eyebrow mb-2">
          <span className="eyebrow-line" /> CHIÊM NGHIỆM TÂM LINH · VĂN HÓA CỔ TRUYỀN
        </p>
        <h1 className="font-serif text-3xl font-bold text-son sm:text-4xl">
          Xin xăm Quan Âm online
        </h1>
        <p className="mt-3 max-w-3xl leading-relaxed text-[#5a4a36]">
          100 quẻ xăm Quan Âm cổ truyền với bài thơ tứ tuyệt, điển tích lịch sử và lời đoán cát hung theo từng phương diện cuộc sống. 
          Giữ tâm thanh tịnh, nghĩ về việc muốn hỏi trước khi lắc ống xăm để đón nhận lời khuyên chân thành.
        </p>
        <p className="mt-2 text-xs text-[#8c6729]">
          Đối chiếu với <a href="/huong-dan/cach-doc-la-so-tu-vi" className="text-son underline font-medium">hướng dẫn đọc lá số</a> hoặc <a href="/xem-ngay" className="text-son underline font-medium">xem ngày tốt xấu</a> để hiểu rõ thiên thời địa lợi.
        </p>
      </div>

      {/* Main Interactive Ritual Widget */}
      <XinXamWidget />

      {/* Cultural Knowledge Guide Section */}
      <section className="mt-12 rounded-2xl border border-[#e5d8c3] bg-[#fffefa] p-6 sm:p-8 shadow-sm" aria-labelledby="xin-xam-guide-heading">
        <h2 id="xin-xam-guide-heading" className="font-serif text-2xl font-bold text-son">
          Ý nghĩa và phép xin xăm cổ truyền
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-[#ebdcc7] bg-[#fffdf9] p-5">
            <h3 className="font-serif text-base font-bold text-[#352516]">1. Tâm thành tất ứng</h3>
            <p className="mt-2 text-xs leading-relaxed text-[#5c4a35]">
              Cổ nhân dạy: "Tâm thành ý tịnh, thần minh cảm ứng". Khi xin xăm, cần giữ tâm ý chuyên nhất, buông bỏ tạp niệm thì lời quẻ mới sáng tỏ.
            </p>
          </div>

          <div className="rounded-xl border border-[#ebdcc7] bg-[#fffdf9] p-5">
            <h3 className="font-serif text-base font-bold text-[#352516]">2. Mỗi ngày một việc</h3>
            <p className="mt-2 text-xs leading-relaxed text-[#5c4a35]">
              Không nên xin liên tiếp nhiều lần cho cùng một sự việc. Lời quẻ ban đầu là lời cảnh tỉnh chân thực nhất để soi chiếu và định hướng hành vi.
            </p>
          </div>

          <div className="rounded-xl border border-[#ebdcc7] bg-[#fffdf9] p-5">
            <h3 className="font-serif text-base font-bold text-[#352516]">3. Đức năng thắng số</h3>
            <p className="mt-2 text-xs leading-relaxed text-[#5c4a35]">
              Quẻ Thượng Cát nhắc ta chớ kiêu căng lơ là; quẻ Hạ Hạ khuyên ta cẩn trọng tích đức lánh họa. Hành thiện tích phúc ắt chuyển nguy thành an.
            </p>
          </div>
        </div>

        <div className="mt-6 border-t border-[#ebdcc7] pt-4 text-xs text-[#705e49] leading-relaxed">
          <p>
            <b>Lời ngỏ:</b> Xin xăm là nét đẹp tín ngưỡng dân gian mang tính chiêm nghiệm và định hướng tâm lý, giúp con người hướng thiện và thận trọng trước mọi ngã rẽ cuộc đời.
          </p>
        </div>
      </section>
    </main>
  );
}
