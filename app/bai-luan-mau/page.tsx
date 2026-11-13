import sample from '@/lib/sample-reading-full';
import {inputToQuery} from '@/lib/birth-input';
import Markdown from '@/components/Markdown';
import ReadingContents from '@/components/ReadingContents';
import {publicMetadata} from '@/lib/seo';
export const metadata=publicMetadata('/bai-luan-mau','Bài luận minh họa — đọc trọn bài mẫu Tử Vi','Đọc miễn phí bài luận mẫu đầy đủ 12 cung, đại hạn và vận năm 2026–2030. Xem cách trình bày trước khi lập bài luận theo lá số của bạn.');

export default function Page(){
  // Bản mẫu cố định theo hồ sơ minh họa công khai, không đọc bài riêng của khách.
  const {text}=sample;
  const chartUrl='/la-so?'+inputToQuery(sample.input);
  return <main className="editorial-page mx-auto max-w-3xl space-y-8 px-4 py-10">
    <header>
      <p className="site-eyebrow"><span className="eyebrow-line" /> BẢN MẪU KHẢO SÁT TOÀN DIỆN</p>
      <h1 className="mt-2 font-serif text-3xl font-bold text-son sm:text-4xl lg:text-5xl tracking-tight">Bài luận minh họa</h1>
      <p className="mt-3.5 text-base leading-relaxed text-[#5e4c39]">Đọc trọn bài mẫu về tính cách, sự nghiệp, tài lộc, tình duyên, 12 cung và các giai đoạn vận hạn. Bài luận của bạn được lập theo ngày giờ sinh và năm xem bạn chọn.</p>
      
      <div className="mt-6 overflow-hidden rounded-2xl border border-[#d8c5a6] border-t-3 border-t-[#b5894c] bg-gradient-to-b from-[#fffefc] to-[#fbf6eb] p-5 sm:p-6 shadow-[0_8px_24px_rgba(68,44,18,0.06)]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ebdcc7] pb-3 mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8c6729] flex items-center gap-1.5">
            <span aria-hidden="true">✦</span> HỒ SƠ MẪU ĐỂ ĐỐI CHIẾU
          </span>
          <span className="rounded-full bg-[#f4ead6] border border-[#d9c5a3] px-3 py-0.5 text-xs font-semibold text-[#6d573b]">
            Dương Nam · Kỷ Mão 2000
          </span>
        </div>
        <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <div className="rounded-xl border border-[#e8dcc4] bg-[#fffdfa] p-3 text-center sm:text-left">
            <dt className="text-xs text-[#8a7a62]">Giới tính</dt>
            <dd className="mt-1 font-serif text-base font-bold text-[#2d2117]">Nam</dd>
          </div>
          <div className="rounded-xl border border-[#e8dcc4] bg-[#fffdfa] p-3 text-center sm:text-left">
            <dt className="text-xs text-[#8a7a62]">Ngày sinh dương lịch</dt>
            <dd className="mt-1 font-serif text-base font-bold text-[#2d2117]">01/01/2000</dd>
          </div>
          <div className="rounded-xl border border-[#e8dcc4] bg-[#fffdfa] p-3 text-center sm:text-left">
            <dt className="text-xs text-[#8a7a62]">Giờ sinh</dt>
            <dd className="mt-1 font-serif text-base font-bold text-[#2d2117]">Tý sớm · 0h–1h</dd>
          </div>
          <div className="rounded-xl border border-[#e8dcc4] bg-[#fffdfa] p-3 text-center sm:text-left">
            <dt className="text-xs text-[#8a7a62]">Năm xem</dt>
            <dd className="mt-1 font-serif text-base font-bold text-son">2026</dd>
          </div>
        </dl>
      </div>

      <p className="mt-3 text-xs text-[#7e6d56] italic">Hồ sơ minh họa dùng để đọc thử cách trình bày. Nội dung mang tính tham khảo.</p>
      
      <div className="mt-5 flex flex-wrap gap-3">
        <a className="btn" href="#bai-mau">Đọc bài mẫu ↓</a>
        <a className="btn-outline" href={chartUrl}>Mở lá số minh họa <span aria-hidden="true">↗</span></a>
      </div>
    </header>

    <article id="bai-mau" className="reading-manuscript scroll-mt-5 rounded-2xl border border-[#dac6a3] bg-[#fffdf8] p-6 sm:p-10 shadow-[0_20px_54px_rgba(62,40,18,0.09)]">
      <div className="mb-6 border-b border-[#ebdcc7] pb-5 text-center">
        <span className="font-serif text-xs font-semibold tracking-widest text-[#8c6729] uppercase">
          ✦ TỬ VI ĐẨU SỐ DIỄN BÀN ✦
        </span>
        <p className="mt-1 font-serif text-2xl font-bold text-son sm:text-3xl">Bản Luận Giải Chi Tiết</p>
        <p className="mt-1 text-xs text-[#7c6952]">Phối hợp 12 cung, vòng Tràng Sinh, các tổ hợp chính tinh và biến động đại hạn</p>
      </div>
      <ReadingContents text={text}/>
      <Markdown text={text}/>
    </article>

    <section className="rounded-2xl border-2 border-[#b5894c] bg-gradient-to-br from-[#fffdf8] to-[#fbf2df] p-7 sm:p-9 text-center shadow-md">
      <span className="text-xs font-bold uppercase tracking-wider text-[#8c6729]">KHỞI TẠO LÁ SỐ CỦA BẠN</span>
      <h2 className="mt-1 font-serif text-2xl font-bold text-son sm:text-3xl">Đọc bài luận theo lá số của bạn</h2>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-[#544432]">Nhập ngày giờ sinh để lập lá số miễn phí và xem phần tổng quan dành cho bạn.</p>
      <a className="btn mt-5 inline-flex items-center gap-2 px-8 py-3 text-base shadow-md" href="/#lap-la-so">
        Lập lá số của bạn miễn phí <span aria-hidden="true">↗</span>
      </a>
    </section>
  </main>;
}
