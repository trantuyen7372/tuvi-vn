export const dynamic='force-dynamic';
import CustomerAuth from '@/components/CustomerAuth';
export const metadata={title:'Đặt lại mật khẩu',robots:{index:false,follow:false},referrer:'no-referrer' as const};
export default function Page(){return <CustomerAuth mode="reset"/>;}
