export const dynamic='force-dynamic';
import CustomerAuth from '@/components/CustomerAuth';
export const metadata={title:'Tạo tài khoản',robots:{index:false,follow:false}};
export default function Page(){return <CustomerAuth mode="signup"/>;}
