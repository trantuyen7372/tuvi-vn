// Giá đang bán; không hiển thị giá gạch ngang khi chưa có chương trình riêng.
export interface Product {
  id: 'single' | 'deep' | 'family';
  name: string;
  credits: number;
  price: number;
  listPrice: number;
  summary: string;
}
export const PRODUCTS: readonly Product[] = [
  { id: 'single', name: 'Luận giải 1 lá số', credits: 1, price: 49000, listPrice: 49000, summary: 'Bắt đầu với 1 lá số: đầy đủ 12 cung, đại hạn và vận năm. Được cá nhân hóa theo bố cục sao–cung từ kho nội dung của website.' },
  { id: 'deep', name: 'Luận giải chuyên sâu', credits: 1, price: 199000, listPrice: 199000, summary: '1 bài được AI biên soạn theo lá số, chủ đề và hoàn cảnh bạn cung cấp. Phù hợp khi cần phân tích tập trung vào một vấn đề.' },
  { id: 'family', name: 'Gói gia đình', credits: 5, price: 199000, listPrice: 199000, summary: '5 lượt luận giải từ kho nội dung, cùng phạm vi như gói 1 lá số. Dùng cho nhiều người hoặc nhiều năm xem hạn.' },
] as const;
export const familySaving = () => PRODUCTS.find(p=>p.id==='single')!.price*PRODUCTS.find(p=>p.id==='family')!.credits-PRODUCTS.find(p=>p.id==='family')!.price;
export const discountPercent = (p: { price: number; listPrice: number }) =>
  p.listPrice > p.price ? Math.round((1 - p.price / p.listPrice) * 100) : 0;
export const ORDER_TTL = 30 * 60 * 1000;
export const MAX_RETRIES = 3;
export const money = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + 'đ';
export function siteUrl() {
  try {
    const url = new URL(process.env.SITE_URL || 'http://localhost:3100');
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new Error();
    return url.origin;
  } catch {
    throw new Error('SITE_URL chưa hợp lệ. Dùng http://localhost:3100 khi chạy local hoặc https://ten-mien-cua-ban khi triển khai.');
  }
}
