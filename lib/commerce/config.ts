// price = số tiền thu thật; listPrice = giá niêm yết hiển thị gạch ngang khi đang khuyến mại.
// Hết đợt khuyến mại thì đặt price bằng listPrice (giảm giá cần thông báo Sở Công Thương, tối đa 50%, có thời hạn).
export interface Product {
  id: 'single' | 'deep' | 'family';
  name: string;
  credits: number;
  price: number;
  listPrice: number;
  summary: string;
}
export const PRODUCTS: readonly Product[] = [
  { id: 'single', name: 'Luận giải 1 lá số', credits: 1, price: 99000, listPrice: 129000, summary: '1 lượt luận giải đầy đủ 12 cung, đại hạn và vận năm đã chọn. Xem lại bài đã lưu không mất thêm lượt.' },
  { id: 'deep', name: 'Luận giải chuyên sâu', credits: 1, price: 199000, listPrice: 279000, summary: '1 lượt biên soạn chuyên sâu, đi kỹ vào vấn đề và hoàn cảnh bạn đang quan tâm trên chính lá số.' },
  { id: 'family', name: 'Gói gia đình', credits: 5, price: 299000, listPrice: 449000, summary: '5 lượt luận giải theo lá số và năm xem hạn, dùng cho nhiều người thân trong gia đình.' },
] as const;
export const discountPercent = (p: { price: number; listPrice: number }) =>
  p.listPrice > p.price ? Math.round((1 - p.price / p.listPrice) * 100) : 0;
export const ORDER_TTL = 30 * 60 * 1000;
export const MAX_RETRIES = 3;
export const money = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + 'đ';
export function siteUrl() {
  const url = process.env.SITE_URL || 'http://localhost:3100';
  return new URL(url).origin;
}
