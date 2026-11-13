import ReactMarkdown from 'react-markdown';
import {headingAnchor} from './reading-format';

function getPlainText(node: unknown): string {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(getPlainText).join('');
  if (typeof node === 'object' && 'props' in (node as Record<string, unknown>)) {
    return getPlainText((node as { props?: { children?: unknown } }).props?.children);
  }
  return '';
}

export default function Markdown({text}:{text:string}){
  return <div className="prose-tuvi"><ReactMarkdown skipHtml components={{
    h2:({children})=><h2 tabIndex={-1} id={headingAnchor(String(children))}>{children}</h2>,
    p:({children})=>{
      const plain = getPlainText(children).trim();
      if (plain.startsWith('Căn cứ:')) {
        return (
          <aside className="my-5 rounded-xl border border-[#e5d8c3] border-l-4 border-l-[#b5894c] bg-gradient-to-r from-[#faf4e6] to-[#fffdfa] p-4 text-sm text-[#382b1c] shadow-sm">
            <div className="flex items-center gap-1.5 font-bold text-[#8c6729] text-[11px] uppercase tracking-wider mb-1.5">
              <span aria-hidden="true">📜</span> CĂN CỨ SAO & CUNG
            </div>
            <div className="font-medium leading-relaxed">{children}</div>
          </aside>
        );
      }
      return <p>{children}</p>;
    },
    a:({children,href})=><a href={href} target="_blank" rel="noopener noreferrer">{children}</a>,
    img:()=>null,
  }}>{text}</ReactMarkdown></div>;
}
