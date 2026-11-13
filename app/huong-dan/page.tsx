import Breadcrumbs from '@/components/Breadcrumbs';
import GuideCards from '@/components/GuideCards';
import {GUIDES} from '@/lib/guides';
import {publicMetadata} from '@/lib/seo';

export const metadata = publicMetadata('/huong-dan', 'Hướng dẫn lập và đọc lá số Tử Vi cho người mới', 'Bắt đầu với ngày giờ sinh, cách đọc 12 cung, chính tinh, phụ tinh, đại hạn và lưu niên. Hướng dẫn sử dụng lá số kèm ví dụ và nguồn tham khảo.');

export default function GuideIndex() {
  return <main className="editorial-page mx-auto max-w-5xl px-4 py-10">
    <Breadcrumbs items={[{name: 'Trang chủ', path: '/'}, {name: 'Hướng dẫn', path: '/huong-dan'}]}/>
    <p className="site-eyebrow mb-2"><span className="eyebrow-line" /> BẮT ĐẦU TỪ DỮ LIỆU ĐÚNG</p>
    <h1 className="mt-2 font-serif text-3xl font-bold text-son md:text-4xl">Hướng dẫn lập và đọc lá số Tử Vi</h1>
    <p className="mt-3.5 max-w-3xl leading-relaxed text-[#5a4a36]">Bạn mới xem lá số? Đọc cách chọn ngày giờ sinh trước, sau đó tìm hiểu 12 cung và các lớp thông tin trên bảng. Các bài viết giải thích cách dùng website và thuật ngữ truyền thống, kèm giới hạn khi diễn giải.</p>
    <section className="mt-8" aria-labelledby="guide-list"><h2 id="guide-list" className="font-serif text-2xl font-bold text-son">Chọn điều bạn đang cần tìm hiểu</h2><GuideCards guides={GUIDES}/></section>
    <aside className="mt-10 rounded-2xl border border-[#d8c5a6] border-t-3 border-t-[#b5894c] bg-gradient-to-b from-[#fffefc] to-[#fbf6ec] p-6 sm:p-7 leading-relaxed shadow-sm">
      <span className="text-xs font-bold uppercase tracking-wider text-[#8c6729]">✦ CÔNG CỤ ĐI KÈM</span>
      <h2 className="mt-1 font-serif text-xl font-bold text-son">Tra cứu trong lúc đọc</h2>
      <p className="mt-3 text-[#443525]">Bạn có thể mở <a href="/sao" className="text-son underline font-medium">14 chính tinh</a>, đối chiếu <a href="/co-thu" className="text-son underline font-medium">bản trích yếu cổ thư</a> hoặc xem <a href="/bai-luan-mau" className="text-son underline font-medium">bài luận minh họa</a>.</p>
      <p className="mt-2.5 text-xs text-[#7c6952]">Nội dung do chúng tôi biên soạn. Đọc <a href="/phuong-phap" className="underline">phương pháp, nguồn và quy ước của website</a> trước khi diễn giải kết quả cá nhân.</p>
      <a href="/#lap-la-so" className="btn mt-4 inline-flex items-center gap-1.5">
        Lập lá số miễn phí <span aria-hidden="true">↗</span>
      </a>
    </aside>
  </main>;
}
