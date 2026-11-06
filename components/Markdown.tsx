import ReactMarkdown from 'react-markdown';
import {headingAnchor} from './reading-format';
export default function Markdown({text}:{text:string}){
  return <div className="prose-tuvi"><ReactMarkdown skipHtml components={{
    h2:({children})=><h2 tabIndex={-1} id={headingAnchor(String(children))}>{children}</h2>,
    a:({children,href})=><a href={href} target="_blank" rel="noopener noreferrer">{children}</a>,
    img:()=>null,
  }}>{text}</ReactMarkdown></div>;
}
