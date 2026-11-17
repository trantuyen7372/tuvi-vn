'use client';

import { useState } from 'react';

interface ShareWidgetProps {
  title: string;
  text: string;
  url?: string;
  className?: string;
  label?: string;
}

export default function ShareWidget({
  title,
  text,
  url,
  className = '',
  label = 'Chia sẻ lá số'
}: ShareWidgetProps) {
  const [copied, setCopied] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const getShareUrl = () => {
    if (url) return url;
    if (typeof window !== 'undefined') return window.location.href;
    return '';
  };

  const handleShareClick = async () => {
    const targetUrl = getShareUrl();

    // If native Web Share API is available on mobile, prioritize it
    if (typeof navigator !== 'undefined' && navigator.share && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      try {
        await navigator.share({
          title,
          text,
          url: targetUrl
        });
        return;
      } catch (err) {
        // Fall back to modal dialog if user cancelled or share failed
        if ((err as Error).name === 'AbortError') return;
      }
    }

    setOpenDialog(true);
  };

  const copyToClipboard = async () => {
    const targetUrl = getShareUrl();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(targetUrl);
      } else {
        const input = document.createElement('input');
        input.value = targetUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Ignore copy error
    }
  };

  const shareUrl = encodeURIComponent(getShareUrl());
  const shareText = encodeURIComponent(`${title} · ${text}`);

  return (
    <>
      <button
        type="button"
        onClick={handleShareClick}
        className={`btn-outline ${className}`}
        aria-label={label}
      >
        {label} <span aria-hidden="true">↗</span>
      </button>

      {openDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-dialog-title"
          onClick={() => setOpenDialog(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-[#d8c5a6] bg-[#fffdfa] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#ebdcc7] pb-3">
              <h3 id="share-dialog-title" className="font-serif text-lg font-bold text-son">
                ✦ Chia sẻ lá số Tử Vi
              </h3>
              <button
                type="button"
                onClick={() => setOpenDialog(false)}
                className="rounded-lg p-1 text-[#8c7456] hover:bg-[#f5e9d5] hover:text-son"
                aria-label="Đóng"
              >
                ✕
              </button>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-[#665744]">
              Chia sẻ liên kết lá số này để bạn bè, người thân cùng xem hoặc lưu trữ lại đối chiếu:
            </p>

            {/* Quick Share Buttons */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              {/* Zalo Share */}
              <a
                href={`https://zalo.me/share?url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-[#0068ff]/30 bg-[#0068ff]/10 py-3 text-xs font-bold text-[#0068ff] transition-colors hover:bg-[#0068ff]/20"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0068ff] text-[10px] font-black text-white">
                  Z
                </span>
                Gửi qua Zalo
              </a>

              {/* Facebook Share */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${shareText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-[#1877f2]/30 bg-[#1877f2]/10 py-3 text-xs font-bold text-[#1877f2] transition-colors hover:bg-[#1877f2]/20"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1877f2] text-[10px] font-black text-white">
                  f
                </span>
                Facebook
              </a>
            </div>

            {/* Copy Link Input */}
            <div className="mt-4">
              <label htmlFor="share-link-input" className="block text-[11px] font-semibold text-[#78644e]">
                Hoặc sao chép đường dẫn:
              </label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  id="share-link-input"
                  type="text"
                  readOnly
                  value={getShareUrl()}
                  className="input flex-1 text-xs text-[#423323] truncate"
                  onFocus={(e) => e.target.select()}
                />
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className={`btn shrink-0 px-4 py-2 text-xs font-bold ${
                    copied ? 'bg-emerald-700 text-white' : ''
                  }`}
                >
                  {copied ? '✓ Đã chép' : 'Sao chép'}
                </button>
              </div>
            </div>

            <div className="mt-5 border-t border-[#ebdcc7] pt-3 text-center">
              <button
                type="button"
                onClick={() => setOpenDialog(false)}
                className="text-xs text-[#8c7456] underline hover:text-son"
              >
                Đóng cửa sổ
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
