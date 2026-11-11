import '../admin.css';
export const dynamic='force-dynamic';
import AdminPanel from '@/components/AdminPanel';
import {adminMfaRequired} from '@/lib/commerce/admin-auth';
export const metadata = { title: 'Quản trị', robots: { index:false,follow:false }, referrer:'no-referrer' as const };
export default function Page(){return <AdminPanel mfaRequired={adminMfaRequired()}/>;}
