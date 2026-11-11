export const dynamic='force-dynamic';
import CustomerDashboard from '@/components/CustomerDashboard';
export const metadata={title:'Tài khoản của tôi',robots:{index:false,follow:false},referrer:'no-referrer' as const};
export default function Page(){return <CustomerDashboard/>;}
