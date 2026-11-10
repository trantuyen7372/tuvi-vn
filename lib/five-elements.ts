export type FiveElement = 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ';

// Shared palette for star names, Cục and the chart legend.
export const FIVE_ELEMENTS: Record<FiveElement, {color: string; swatch: string; label: string}> = {
  Kim: {color: '#eab308', swatch: '#eab308', label: 'vàng rực'},
  Mộc: {color: '#166534', swatch: '#166534', label: 'xanh lá'},
  Thủy: {color: '#0ea5e9', swatch: '#0ea5e9', label: 'xanh da trời'},
  Hỏa: {color: '#b42318', swatch: '#b42318', label: 'đỏ'},
  Thổ: {color: '#8a5700', swatch: '#ca8a04', label: 'vàng nâu'},
};

// Major stars follow the primary element in lib/stars.ts, including Tham Lang
// (Mộc kiêm Thủy). Supporting stars: https://docs.iztro.com/learn/minor-star
// and https://docs.iztro.com/learn/adj-star. Unspecified elements stay neutral.
const STAR_ELEMENTS: Readonly<Partial<Record<string, FiveElement>>> = {
  'Tử Vi': 'Thổ', 'Thiên Cơ': 'Mộc', 'Thái Dương': 'Hỏa', 'Vũ Khúc': 'Kim',
  'Thiên Đồng': 'Thủy', 'Liêm Trinh': 'Hỏa', 'Thiên Phủ': 'Thổ', 'Thái Âm': 'Thủy',
  'Tham Lang': 'Mộc', 'Cự Môn': 'Thủy', 'Thiên Tướng': 'Thủy', 'Thiên Lương': 'Thổ',
  'Thất Sát': 'Kim', 'Phá Quân': 'Thủy',
  'Tả Phù': 'Thổ', 'Hữu Bật': 'Thủy', 'Văn Xương': 'Kim', 'Văn Khúc': 'Thủy',
  'Lộc Tồn': 'Thổ', 'Thiên Mã': 'Hỏa', 'Kình Dương': 'Kim', 'Đà La': 'Kim',
  'Hỏa Tinh': 'Hỏa', 'Linh Tinh': 'Hỏa', 'Thiên Khôi': 'Hỏa', 'Thiên Việt': 'Hỏa',
  'Địa Không': 'Hỏa', 'Địa Kiếp': 'Hỏa',
  'Hồng Loan': 'Thủy', 'Thiên Hỷ': 'Thủy', 'Thiên Diêu': 'Thủy',
  'Cô Thần': 'Hỏa', 'Quả Tú': 'Hỏa', 'Thiên Hình': 'Hỏa',
  'Long Trì': 'Thủy', 'Phụng Các': 'Thổ', 'Thiên Tài': 'Mộc',
  'Tam Thai': 'Thổ', 'Bát Tọa': 'Thổ', 'Ân Quang': 'Hỏa', 'Thiên Quý': 'Thổ',
  'Thiên Quan': 'Thổ', 'Thiên Khốc': 'Kim', 'Thiên Hư': 'Thổ',
  'Phá Toái': 'Hỏa', 'Phi Liêm': 'Hỏa', 'Thiên Phúc': 'Thổ',
  'Thiên Thọ': 'Thổ', 'Thiên Thương': 'Thủy', 'Thiên Sứ': 'Thủy',
  'Đài Phụ': 'Thổ', 'Phong Cáo': 'Thổ',
};

export function starElement(name: string): FiveElement | undefined {
  return Object.hasOwn(STAR_ELEMENTS, name) ? STAR_ELEMENTS[name] : undefined;
}

export function cucElement(cuc: string): FiveElement | undefined {
  const normalized = cuc.replace('Thuỷ', 'Thủy').replace('Hoả', 'Hỏa');
  return (Object.keys(FIVE_ELEMENTS) as FiveElement[]).find(element => normalized.startsWith(element));
}
