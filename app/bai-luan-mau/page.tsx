import sample from '@/lib/sample-reading.json';
import {buildChart} from '@/lib/tuvi';
import {personalReading} from '@/lib/personal-reading';
import Markdown from '@/components/Markdown';
import ReadingContents from '@/components/ReadingContents';
import {publicMetadata} from '@/lib/seo';
export const metadata=publicMetadata('/bai-luan-mau','Đọc thử bài luận Tử Vi theo sao, cung và vận hạn','Bài luận minh họa giải thích sao, cung, đại hạn và từng năm. Xem cách trình bày, căn cứ và giới hạn của lời luận trước khi lập bài của bạn.');
export default function Page(){
  // Hồ sơ minh họa công khai từ trước, không lấy bài hoặc dữ liệu của khách hàng.
  const chart=buildChart({name:'',gender:'nam',calendar:'duong',date:'2000-01-01',hour:0,leap:false,year:2026});
  const text=personalReading(chart,Object.fromEntries(sample.sections.map(s=>[s.key,s.text])));
  return <main className="mx-auto max-w-3xl space-y-6 px-4 py-10">
    <header><p className="text-sm text-[#6b5b45]">Đọc thử cách luận</p><h1 className="mt-2 font-serif text-3xl font-bold text-son">Một bài luận nên giúp bạn hiểu điều gì?</h1>
      <p className="mt-4 leading-relaxed">Dưới đây là bài minh họa cho nam sinh ngày 01/01/2000 dương lịch, giờ Tý sớm (0h–1h), xem năm 2026. Đây là hồ sơ minh họa, không phải thông tin của khách hàng.</p>
      <p className="mt-3 rounded-lg border border-[#d9c7a3] bg-[#fff6e5] p-4 text-sm">Bạn có thể đọc căn cứ sao–cung, cách phối hợp các sao và sự thay đổi giữa từng giai đoạn. Bài của bạn được lập theo ngày giờ sinh và năm xem bạn nhập.</p>
      <div className="mt-4 flex flex-wrap gap-3"><a className="btn" href="/#lap-la-so">Lập lá số của bạn miễn phí</a><a className="btn-outline" href="/la-so?ten=Mau%20minh%20hoa&gt=nam&lich=duong&ngay=2000-01-01&gio=0&nhuan=0&nam=2026">Mở lá số minh họa</a></div>
    </header>
    <article className="rounded-xl border border-[#d9c7a3] bg-white p-5 sm:p-6"><ReadingContents text={text}/><Markdown text={text}/></article>
    <a className="btn" href="/#lap-la-so">Lập lá số của bạn</a>
  </main>;
}
