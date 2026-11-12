import {notFound} from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import StructuredData from '@/components/StructuredData';
import GuideCards from '@/components/GuideCards';
import {GUIDES, findGuide} from '@/lib/guides';
import {publicMetadata, SITE_NAME, SITE_ORIGIN} from '@/lib/seo';

export function generateStaticParams() {
  return GUIDES.map(guide => ({slug: guide.slug}));
}

export async function generateMetadata({params}: {params: Promise<{slug: string}>}) {
  const guide = findGuide((await params).slug);
  if (!guide) notFound();
  const metadata = publicMetadata(`/huong-dan/${guide.slug}`, guide.title, guide.description);
  return {...metadata, openGraph: {...metadata.openGraph, type: 'article' as const}};
}

export default async function GuidePage({params}: {params: Promise<{slug: string}>}) {
  const guide = findGuide((await params).slug);
  if (!guide) notFound();
  const path = `/huong-dan/${guide.slug}`;
  return <main className="editorial-page mx-auto max-w-3xl px-4 py-10">
    <Breadcrumbs items={[{name: 'Trang chủ', path: '/'}, {name: 'Hướng dẫn', path: '/huong-dan'}, {name: guide.title, path}]}/>
    <StructuredData data={{'@context': 'https://schema.org', '@type': 'Article', headline: guide.title, description: guide.description, inLanguage: 'vi-VN', mainEntityOfPage: new URL(path, SITE_ORIGIN).href, author: {'@type': 'Organization', name: SITE_NAME, url: `${SITE_ORIGIN}/phuong-phap`}, publisher: {'@type': 'Organization', name: SITE_NAME, url: SITE_ORIGIN}}}/>
    <article>
      <h1 className="font-serif text-3xl font-bold leading-tight text-son md:text-4xl">{guide.title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-[#6b5b45]">Nội dung do chúng tôi biên soạn. <a href="/phuong-phap" className="underline">Nguồn và phương pháp</a></p>
      <p className="mt-6 text-lg leading-relaxed text-[#5a4a36]">{guide.intro}</p>
      <nav aria-label="Mục lục bài viết" className="mt-6 rounded-xl border border-[#d9c7a3] bg-white p-5">
        <h2 className="font-bold">Trong bài này</h2>
        <ul className="mt-3 space-y-2">{guide.sections.map(section => <li key={section.id}><a href={`#${section.id}`} className="text-son underline underline-offset-2">{section.title}</a></li>)}</ul>
      </nav>
      {guide.sections.map(section => <section key={section.id} id={section.id} className="mt-9 scroll-mt-6">
        <h2 className="font-serif text-2xl font-bold text-son">{section.title}</h2>
        {section.paragraphs.map(text => <p key={text} className="mt-4 leading-relaxed">{text}</p>)}
        {section.items && <dl className="mt-5 grid gap-4 sm:grid-cols-2">{section.items.map(item => <div key={item.name} className="rounded-xl border border-[#d9c7a3] bg-white p-4"><dt className="font-bold text-son">{item.name}</dt><dd className="mt-2 leading-relaxed text-[#5a4a36]">{item.text}</dd></div>)}</dl>}
      </section>)}
      <section className="mt-9 border-t border-[#d9c7a3] pt-6" aria-labelledby="sources-title">
        <h2 id="sources-title" className="font-serif text-xl font-bold text-son">Nguồn và bài đối chiếu</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">{guide.sources.map(source => <li key={source.href}><a href={source.href} className="text-son underline">{source.name}</a></li>)}</ul>
        <p className="mt-4 text-sm leading-relaxed text-[#6b5b45]">Phần diễn giải cổ thư phản ánh quan niệm truyền thống, phục vụ tham khảo và giải trí. Những ví dụ trong bài là minh họa cách đọc, không phải kết quả kiểm chứng khả năng dự báo.</p>
      </section>
    </article>
    <aside className="mt-9 rounded-xl border border-[#d9c7a3] bg-white p-5">
      <h2 className="font-serif text-xl font-bold text-son">Thực hành trên lá số của bạn</h2>
      <p className="mt-2 leading-relaxed">Chuẩn bị ngày và giờ sinh đã xác nhận, lập lá số rồi đối chiếu từng phần với hướng dẫn.</p>
      <a href="/#lap-la-so" className="btn mt-4">Lập lá số miễn phí</a>
      <a href="/sao" className="ml-4 inline-block py-3 text-son underline">Tra cứu các sao</a>
    </aside>
    <section className="mt-9" aria-labelledby="related-title"><h2 id="related-title" className="font-serif text-2xl font-bold text-son">Đọc tiếp</h2><GuideCards guides={GUIDES.filter(item => guide.related.includes(item.slug))}/></section>
  </main>;
}
