export const dynamic='force-dynamic';
import SavedReading from '@/components/SavedReading';
export const metadata = { title: 'Bản luận giải của bạn', robots: { index: false, follow: false }, referrer: 'no-referrer' as const };
export default async function Page({ params }: { params: Promise<{ token: string }> }) { return <SavedReading token={(await params).token} />; }
