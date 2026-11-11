'use client';
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';
import {startMeasurement,trackFunnel} from '@/lib/funnel-client';

export default function FunnelTracker() {
  const pathname=usePathname();
  useEffect(()=>{
    if(['/quan-tri','/dat-lai-mat-khau','/xac-minh-email','/quen-mat-khau'].includes(pathname))return;
    void startMeasurement();
  },[pathname]);
  return null;
}

export function TrackChartCreated() {
  useEffect(()=>{void trackFunnel('chart_created');},[]);
  return null;
}
