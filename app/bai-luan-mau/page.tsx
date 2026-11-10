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
  return <main className="mx-auto max-w-3xl space-y-6 px-4 py-10">
    <header><p className="text-sm font-semibold text-[#6b5b45]">ĐỌC THỬ MIỄN PHÍ · KHÔNG CẦN ĐĂNG NHẬP</p><h1 className="mt-2 font-serif text-3xl font-bold text-son sm:text-4xl">Bài luận minh họa</h1>
      <p className="mt-4 leading-relaxed">Đọc trọn bài mẫu về tính cách, sự nghiệp, tài lộc, tình duyên, 12 cung và các giai đoạn vận hạn. Bài luận của bạn được lập theo ngày giờ sinh và năm xem bạn chọn.</p>
      <dl className="mt-5 grid grid-cols-2 gap-4 rounded-xl border border-[#d9c7a3] bg-[#fffaf0] p-4 text-sm sm:grid-cols-4">
        <div><dt className="text-[#8a7a62]">Giới tính</dt><dd className="mt-1 font-semibold">Nam</dd></div>
        <div><dt className="text-[#8a7a62]">Ngày sinh dương lịch</dt><dd className="mt-1 font-semibold">01/01/2000</dd></div>
        <div><dt className="text-[#8a7a62]">Giờ sinh</dt><dd className="mt-1 font-semibold">Tý sớm · 0h–1h</dd></div>
        <div><dt className="text-[#8a7a62]">Năm xem</dt><dd className="mt-1 font-semibold">2026</dd></div>
      </dl>
      <p className="mt-3 text-xs text-[#6b5b45]">Hồ sơ minh họa dùng để đọc thử cách trình bày. Nội dung mang tính tham khảo.</p>
      <div className="mt-4 flex flex-wrap gap-3"><a className="btn" href="#bai-mau">Đọc bài mẫu ↓</a><a className="btn-outline" href={chartUrl}>Mở lá số minh họa</a></div>
    </header>
    <article id="bai-mau" className="scroll-mt-5 rounded-xl border border-[#d9c7a3] bg-white p-5 sm:p-6"><ReadingContents text={text}/><Markdown text={text}/></article>
    <section className="rounded-xl border border-[#d9c7a3] bg-[#fffaf0] p-5"><h2 className="font-serif text-xl font-bold text-son">Đọc bài luận theo lá số của bạn</h2><p className="mt-2 text-sm leading-relaxed">Nhập ngày giờ sinh để lập lá số miễn phí và xem phần tổng quan dành cho bạn.</p><a className="btn mt-4" href="/#lap-la-so">Lập lá số của bạn miễn phí</a></section>
  </main>;
}
