import type { Metadata } from 'next';
import './globals.css';
import CustomerNavigation from '@/components/CustomerNavigation';
import BrandLogo from '@/components/BrandLogo';
import {SITE_ORIGIN,SITE_NAME} from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase:new URL(SITE_ORIGIN),
  title: {default:'Lập lá số Tử Vi miễn phí và luận giải | '+SITE_NAME,template:'%s | '+SITE_NAME},
  description: 'Lập lá số Tử Vi Đẩu Số miễn phí, xem 12 cung, đại hạn, lưu niên và luận giải chi tiết.',
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/apple-touch-icon.svg', type: 'image/svg+xml' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&family=Noto+Serif:wght@600;700&display=swap"
        />
      </head>
      <body>
        <header className="no-print border-b border-[#d9c7a3] bg-white/60">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <BrandLogo />
            <nav aria-label="Điều hướng chính" className="flex flex-wrap justify-end gap-x-4 gap-y-2 text-sm text-[#6b5b45]"><a href="/#lap-la-so" className="hover:text-son">Lập lá số</a><a href="/bai-luan-mau" className="hover:text-son">Bài luận mẫu</a><CustomerNavigation/><a href="/sao" className="hover:text-son">14 chính tinh</a></nav>
          </div>
        </header>
        {children}
        <footer className="no-print mt-12 border-t border-[#d9c7a3] py-6 text-center text-xs text-[#8a7a62]">
          <nav className="mb-3 flex flex-wrap justify-center gap-4"><a href="/chinh-sach/dieu-khoan">Điều khoản</a><a href="/chinh-sach/bao-mat">Bảo mật</a><a href="/chinh-sach/hoan-tien">Hoàn tiền</a><a href="/chinh-sach/gioi-thieu">Giới thiệu / liên hệ</a></nav>
          Nội dung mang tính tham khảo.
        </footer>
      </body>
    </html>
  );
}
