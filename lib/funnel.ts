import {createHash,randomBytes} from 'node:crypto';
import {all,get,run,transaction} from './commerce/db';

export const FUNNEL_EVENTS=['visit','chart_created','preview_view','pricing_view','order_created','purchase','reading_opened'] as const;
export type FunnelEvent=typeof FUNNEL_EVENTS[number];
export const FUNNEL_SOURCES=['direct','google','facebook','tiktok','zalo','email','other'] as const;
export type FunnelSource=typeof FUNNEL_SOURCES[number];
const sessionMs=30*60000,retentionMs=90*86400000;
let lastPrune=0;
const digest=(value:string)=>createHash('sha256').update(value).digest('hex');

export function measurementAllowed(req:Request) {
  return process.env.FUNNEL_ANALYTICS_ENABLED!=='0'&&req.headers.get('dnt')!=='1'&&req.headers.get('sec-gpc')!=='1';
}

export function pruneFunnel(now=Date.now()) {
  if(now-lastPrune<3600000)return;
  transaction(()=>{
    run('UPDATE orders SET funnel_visit=NULL WHERE funnel_visit IN (SELECT id FROM funnel_visits WHERE created<?)',now-retentionMs);
    run('DELETE FROM funnel_visits WHERE created<?',now-retentionMs);
  });
  lastPrune=now;
}

export function visitForRequest(req:Request) {
  if(!measurementAllowed(req))return undefined;
  const token=req.headers.get('cookie')?.match(/(?:^|;\s*)tuvi_visit=([a-f0-9]{32})(?:;|$)/)?.[1];
  if(!token)return undefined;
  const id=digest(token);
  return get('SELECT id FROM funnel_visits WHERE id=? AND last_seen>?',id,Date.now()-sessionMs)?id:undefined;
}
export function safeVisitForRequest(req:Request) {try{return visitForRequest(req);}catch{return undefined;}}

export function startVisit(req:Request,source:FunnelSource) {
  pruneFunnel();
  const existing=visitForRequest(req),now=Date.now();
  const token=existing?req.headers.get('cookie')!.match(/(?:^|;\s*)tuvi_visit=([a-f0-9]{32})(?:;|$)/)![1]:randomBytes(16).toString('hex');
  const id=existing||digest(token);
  run('INSERT OR IGNORE INTO funnel_visits VALUES (?,?,?,?)',id,source,now,now);
  run('UPDATE funnel_visits SET last_seen=? WHERE id=?',now,id);
  milestone(id,'visit');
  return {id,cookie:`tuvi_visit=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=1800${process.env.SITE_URL?.startsWith('https://')?'; Secure':''}`};
}

/** Server-owned purchase/order milestones are never accepted by the public event endpoint. */
export function milestone(visit:string|undefined|null,event:FunnelEvent) {
  if(!visit||process.env.FUNNEL_ANALYTICS_ENABLED==='0')return;
  run('INSERT OR IGNORE INTO funnel_events SELECT id,?,? FROM funnel_visits WHERE id=?',event,Date.now(),visit);
}

// Measurement is best-effort; a broken analytics table must never block a purchase or reading.
export function safelyMeasure(fn:()=>void) {try{fn();}catch{/* No customer data or URL is logged. */}}

export function funnelReport(start:number,end:number) {
  pruneFunnel();
  const rows=all<{event:FunnelEvent;visits:number}>(`SELECT e.event,COUNT(*) visits FROM funnel_events e JOIN funnel_visits v ON v.id=e.visit_id WHERE v.created BETWEEN ? AND ? GROUP BY e.event`,start,end);
  const steps=FUNNEL_EVENTS.map(event=>({event,visits:rows.find(row=>row.event===event)?.visits||0}));
  const sources=all<{source:FunnelSource;visits:number;charts:number;orders:number;purchases:number}>(`SELECT v.source,COUNT(*) visits,
    SUM(EXISTS(SELECT 1 FROM funnel_events e WHERE e.visit_id=v.id AND e.event='chart_created')) charts,
    SUM(EXISTS(SELECT 1 FROM funnel_events e WHERE e.visit_id=v.id AND e.event='order_created')) orders,
    SUM(EXISTS(SELECT 1 FROM funnel_events e WHERE e.visit_id=v.id AND e.event='purchase')) purchases
    FROM funnel_visits v WHERE v.created BETWEEN ? AND ? GROUP BY v.source ORDER BY visits DESC`,start,end);
  const payments=get<{paidOrders:number;gross:number;refunded:number;net:number}>(`SELECT COUNT(*) paidOrders,COALESCE(SUM(amount),0) gross,
    COALESCE(SUM(CASE WHEN status='refunded' THEN amount ELSE 0 END),0) refunded,
    COALESCE(SUM(CASE WHEN status='paid' THEN amount ELSE 0 END),0) net
    FROM orders WHERE provider='payos' AND amount>0 AND status IN ('paid','refunded') AND paid_at BETWEEN ? AND ?`,start,end)!;
  const products=all<{product:string;paidOrders:number;net:number}>(`SELECT product,COUNT(*) paidOrders,COALESCE(SUM(CASE WHEN status='paid' THEN amount ELSE 0 END),0) net
    FROM orders WHERE provider='payos' AND amount>0 AND status IN ('paid','refunded') AND paid_at BETWEEN ? AND ? GROUP BY product`,start,end);
  return {enabled:process.env.FUNNEL_ANALYTICS_ENABLED!=='0',retentionDays:90,steps,sources,payments,products};
}
