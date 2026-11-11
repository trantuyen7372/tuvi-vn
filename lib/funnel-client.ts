type ClientEvent='visit'|'chart_created'|'preview_view'|'pricing_view';
let pending:Promise<void>|undefined;
let startedAt=0;
function optedOut() {
  return typeof window==='undefined'||navigator.doNotTrack==='1'||!!(navigator as Navigator & {globalPrivacyControl?:boolean}).globalPrivacyControl;
}
function source() {
  const campaign=new URL(location.href).searchParams.get('utm_source')?.toLowerCase();
  if(campaign){
    if(['google','facebook','tiktok','zalo','email'].includes(campaign))return campaign;
    return 'other';
  }
  if(!document.referrer)return 'direct';
  try{
    const host=new URL(document.referrer).hostname;
    if(host===location.hostname)return 'direct';
    if(/(^|\.)google\.[a-z.]+$/.test(host))return 'google';
    if(/(^|\.)(facebook\.com|fb\.com)$/.test(host))return 'facebook';
    if(/(^|\.)tiktok\.com$/.test(host))return 'tiktok';
    if(/(^|\.)zalo\.(me|com)$/.test(host))return 'zalo';
  }catch{}
  return 'other';
}
async function send(event:ClientEvent) {
  try{await fetch('/api/events',{method:'POST',credentials:'same-origin',keepalive:true,referrerPolicy:'no-referrer',headers:{'Content-Type':'application/json'},body:JSON.stringify({event,source:source()}),signal:AbortSignal.timeout(3000)});}catch{}
}
export async function startMeasurement() {
  if(optedOut())return;
  if(!pending||Date.now()-startedAt>25*60000){startedAt=Date.now();pending=send('visit');}
  await pending;
}
export async function trackFunnel(event:ClientEvent) {
  if(optedOut())return;
  await startMeasurement();
  if(event!=='visit')await send(event);
}
