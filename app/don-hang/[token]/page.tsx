export const dynamic='force-dynamic';
import OrderStatus from '@/components/OrderStatus';
export const metadata = { title: 'Đơn luận giải', robots: { index: false, follow: false }, referrer: 'no-referrer' as const };
export default async function Page({ params }: { params: Promise<{ token: string }> }) { const {token}=await params;return <OrderStatus key={token} token={token} />; }
