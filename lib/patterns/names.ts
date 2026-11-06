import map from './zh-vi.json';

const M = map as Record<string, string>;
const EXTRA: Record<string, string> = { '身宫': 'Thân', '仆役': 'Nô Bộc', '交友': 'Nô Bộc' };

/** Đổi tên sao / cung tiếng Trung (iztro zh-CN) sang tiếng Việt. */
export function vn(zh: string): string {
  return EXTRA[zh] ?? M[zh] ?? zh;
}
