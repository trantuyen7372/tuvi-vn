import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BOOKS } from '@/lib/classics';
import {publicMetadata} from '@/lib/seo';
import Breadcrumbs from '@/components/Breadcrumbs';

export function generateStaticParams() {
  return BOOKS.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const b = BOOKS.find((x) => x.slug === slug);
  return b ? publicMetadata(`/co-thu/${b.slug}`,`${b.title} – trích yếu tiếng Việt`,b.intro) : {};
}

export default async function Book({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const b = BOOKS.find((x) => x.slug === slug);
  if (!b) notFound();
  return (
    <main className="editorial-page mx-auto max-w-3xl px-4 py-10">
      <Breadcrumbs items={[{name:'Trang chủ',path:'/'},{name:'Cổ thư',path:'/co-thu'},{name:b.title,path:`/co-thu/${b.slug}`}]}/>
      <h1 className="mt-3 font-serif text-4xl font-bold text-son">{b.title}</h1>
      <p className="mt-1 text-[#6b5b45]">{b.hanTitle} · {b.era} · {b.author}</p>
      <p className="mt-4 leading-relaxed">{b.intro}</p>
      <p className="mt-2 text-xs italic text-[#8a7a62]">Bản trích yếu, một số đoạn đã được diễn giải cho dễ hiểu.</p>
      {b.chapters.map((c) => (
        <section key={c.title} className="mt-8">
          <h2 className="font-serif text-2xl font-bold text-son">{c.title}</h2>
          {c.subtitle && <p className="text-sm text-[#8a7a62]">{c.subtitle}</p>}
          <div className="mt-3 space-y-3">
            {c.paragraphs.map((p) => (
              <p key={p.id} id={p.id} className="leading-relaxed">{p.vi}</p>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
