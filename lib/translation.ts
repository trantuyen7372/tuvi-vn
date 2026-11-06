import corrections from './translation-corrections.json';

/** Áp dụng các sửa câu đã đối chiếu với TM, kể cả tệp dữ liệu chưa tái xuất. */
export function polishTranslation(text: string): string {
  for (const [before, after] of corrections) text = text.split(before).join(after);
  return text;
}
