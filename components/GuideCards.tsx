import type {Guide} from '@/lib/guides';

export default function GuideCards({guides}: {guides: Guide[]}) {
  return <div className="mt-5 grid gap-4 sm:grid-cols-2">
    {guides.map(guide => <a key={guide.slug} href={`/huong-dan/${guide.slug}`} className="rounded-xl border border-[#d9c7a3] bg-white p-5 hover:border-son focus-visible:outline-son">
      <h3 className="font-serif text-xl font-bold text-son">{guide.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[#6b5b45]">{guide.description}</p>
      <span className="mt-3 inline-block text-sm font-semibold text-son">Đọc hướng dẫn →</span>
    </a>)}
  </div>;
}
