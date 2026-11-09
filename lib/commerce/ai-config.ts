import type {ReadingPreferences} from '../reading-preferences';

/** Keep every available subject, giving the selected focus more room. Chart facts are never trimmed. */
export function boundedReadingReference(source:Record<string,string>|null,preferences?:ReadingPreferences){
  if(!source)return null;
  const priority=preferences?.focus==='relationship'?['love','overview','personality']:
    preferences?.focus==='family'?['home','parents','family','children','overview']:['career','wealth','overview','personality'];
  const entries=Object.entries(source).filter(([,value])=>value.trim());
  const ordered=[...entries].sort(([a],[b])=>{
    const rank=(key:string)=>priority.includes(key)?priority.indexOf(key):priority.length;
    return rank(a)-rank(b);
  });
  const result:Record<string,string>={};
  let remaining=8000;
  for(let index=0;index<ordered.length;index++){
    const [key,value]=ordered[index];
    const reserve=Math.min(350,Math.floor(remaining/(ordered.length-index)));
    const limit=Math.max(reserve,Math.min(priority.includes(key)?1000:600,remaining-reserve*(ordered.length-index-1)));
    let excerpt=value.slice(0,limit);
    if(value.length>limit){
      const sentence=Math.max(excerpt.lastIndexOf('. '),excerpt.lastIndexOf('! '),excerpt.lastIndexOf('? '));
      if(sentence>=limit/2)excerpt=excerpt.slice(0,sentence+1);
      else {const space=excerpt.lastIndexOf(' ');if(space>0)excerpt=excerpt.slice(0,space);}
    }
    if(excerpt){result[key]=excerpt;remaining-=excerpt.length;}
  }
  return result;
}

/** Sonnet 5.5 rejects disabled; between_tools avoids up-front thinking on this text-only task. */
export function readingModelOptions(model:string){
  if(/^claude-sonnet-5-5(?:-|$)/.test(model))return {thinking:{type:'between_tools' as const},output_config:{effort:'medium' as const}};
  if(/^claude-(?:sonnet-5|(?:sonnet|opus)-4-[5-8]|haiku-[45]-5)(?:-|$)/.test(model))return {thinking:{type:'disabled' as const}};
  return {};
}
