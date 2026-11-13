'use client';
import { useEffect, useState } from 'react';
import type { BirthInput } from '@/lib/birth-input';
import FunnelSection from './FunnelSection';

export default function FreePreview({ input }: { input: BirthInput }) {
  const [excerpts, setExcerpts] = useState<{ title: string; text: string }[]>([]);
  const [questions, setQuestions] = useState<string[]>([]);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setText('');
    setExcerpts([]);
    setQuestions([]);
    setError('');
    fetch('/api/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input }),
      signal: controller.signal,
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw Error(data.error);
        return data;
      })
      .then((data) => {
        setText(data.text || '');
        setExcerpts(data.excerpts || []);
        setQuestions(data.questions || []);
      })
      .catch((e) => {
        if (!controller.signal.aborted) setError(e.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [input]);

  return (
    <FunnelSection event="preview_view" className="reading-panel">
      <div aria-busy={loading}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eadfc7] pb-4 mb-4">
          <div>
            <p className="site-eyebrow">BẢN XEM TRƯỚC TỔNG QUAN</p>
            <h2 className="font-serif text-2xl font-bold text-son">Đọc thử theo lá số của bạn</h2>
          </div>
          <span className="rounded-full bg-[#fdfaf3] border border-[#d9c7a3] px-3.5 py-1 text-xs font-semibold text-[#845f28] shadow-sm">
            Miễn phí · không dùng lượt
          </span>
        </div>

        <p className="text-sm leading-relaxed text-[#6b5b45]">
          Các đoạn dưới đây được chọn theo bố cục sao và cung vừa lập, giúp bạn xem cách website diễn giải trước khi chọn bài đầy đủ.
        </p>

        {loading ? (
          <div role="status" className="mt-5 rounded-xl border border-[#e5d8bf] bg-[#fffdf8] p-5 text-center text-sm text-[#7c6952]">
            <span className="inline-block animate-pulse font-medium">Đang lấy nội dung tham khảo…</span>
          </div>
        ) : text ? (
          <div className="mt-4 space-y-4">
            {excerpts.length ? (
              excerpts.map((e) => (
                <div
                  key={e.title}
                  className="rounded-xl border border-[#e8dcc4] border-l-4 border-l-[#b8860b] bg-[#fffdf9] p-4.5 sm:p-5 shadow-xs"
                >
                  <h3 className="font-serif text-lg font-bold text-[#2d2218]">{e.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#3d3124]">{e.text}</p>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-[#e8dcc4] bg-[#fffdf9] p-4 text-sm leading-relaxed text-[#3d3124]">
                {text}
              </div>
            )}

            {questions.length > 0 && (
              <div className="rounded-xl border border-[#d9c7a3] bg-gradient-to-br from-[#fffefc] to-[#fbf5e8] p-4.5 sm:p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-[#b8860b] text-base" aria-hidden="true">✦</span>
                  <h3 className="font-serif text-base font-bold text-[#352516]">
                    Các câu hỏi để đọc tiếp theo lá số này
                  </h3>
                </div>
                <ul className="mt-3 space-y-2.5 text-sm">
                  {questions.map((q) => (
                    <li key={q} className="flex items-start gap-2.5 text-[#4a3b2c] leading-relaxed">
                      <span className="shrink-0 text-xs mt-1 text-[#b5894c]">🔍</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <p className="mt-4 rounded-xl border border-[#e5d8bf] bg-[#fffdf8] p-4 text-sm text-[#7c6952]">
            {error || 'Chưa có đoạn tổng quan cho ngày giờ này. Bạn vẫn xem được lá số, sao và cách cục miễn phí ở trên.'}
          </p>
        )}

        <div className="mt-6 rounded-xl border border-[#d8c5a6] bg-gradient-to-br from-[#fffdfa] to-[#fbf4e6] p-5 shadow-sm">
          <h3 className="font-serif text-lg font-bold text-son flex items-center gap-2">
            <span>Bài đầy đủ bổ sung những gì?</span>
          </h3>
          <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-[#443627]">
            <li className="flex items-start gap-2.5">
              <span className="shrink-0 text-[#1b6b3e] font-bold mt-0.5">✓</span>
              <span>Diễn giải đủ 12 cung và cách các sao phối hợp, thay vì chỉ xem từng sao riêng lẻ.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="shrink-0 text-[#1b6b3e] font-bold mt-0.5">✓</span>
              <span>Đối chiếu đại hạn, năm đang chọn và tối đa bốn năm tiếp theo.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="shrink-0 text-[#1b6b3e] font-bold mt-0.5">✓</span>
              <span>Lưu trong tài khoản để đọc lại và in hoặc lưu PDF; đọc lại không mất thêm lượt.</span>
            </li>
          </ul>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href="#mo-bai-luan" className="btn">
              Xem gói phù hợp với tôi
            </a>
            <a href="/bai-luan-mau" className="btn-outline">
              Đọc trọn bài minh họa
            </a>
          </div>
        </div>

        <p className="mt-3.5 text-xs text-[#7e6d56] italic">
          Đây là phần tổng quan tham khảo từ kho nội dung, không phải toàn bộ bài luận. Các nhận định không phải dự đoán chắc chắn.
        </p>
      </div>
    </FunnelSection>
  );
}
