import type { Metadata } from 'next';
import './globals.css';
import './site.css';
import SiteHeader from '@/components/SiteHeader';
import BrandLogo from '@/components/BrandLogo';
import {SITE_ORIGIN,SITE_NAME} from '@/lib/seo';
import FunnelTracker from '@/components/FunnelTracker';

export const metadata: Metadata = {
  metadataBase:new URL(SITE_ORIGIN),
  title: {default:'Lập lá số Tử Vi miễn phí và luận giải | '+SITE_NAME,template:'%s | '+SITE_NAME},
  description: 'Lập lá số Tử Vi Đẩu Số miễn phí, xem 12 cung, đại hạn, lưu niên và luận giải chi tiết.',
  verification: {google: process.env.GOOGLE_SITE_VERIFICATION || undefined},
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
        <a href="#noi-dung" className="skip-link">Đến nội dung chính</a>
        <FunnelTracker/>
        <SiteHeader/>
        <div id="noi-dung" className="site-content" tabIndex={-1}>{children}</div>
        <footer className="site-footer no-print">
          <div className="site-footer-grid">
            <div className="site-footer-brand"><BrandLogo/><p>Một nơi để lập lá số, tìm hiểu Tử Vi và lưu lại những góc nhìn dành cho bạn.</p><span>TỬ VI ĐẨU SỐ · TRI THỨC TRUYỀN THỐNG</span></div>
            <nav aria-label="Kiến thức Tử Vi"><h2>Khám phá</h2><a href="/huong-dan">Hướng dẫn đọc lá số</a><a href="/sao">14 chính tinh</a><a href="/co-thu">Cổ thư</a><a href="/phuong-phap">Phương pháp và nguồn</a></nav>
            <nav aria-label="Thông tin website"><h2>Thông tin & hỗ trợ</h2><a href="/chinh-sach/gioi-thieu">Giới thiệu / liên hệ</a><a href="/chinh-sach/dieu-khoan">Điều khoản</a><a href="/chinh-sach/bao-mat">Bảo mật</a><a href="/chinh-sach/hoan-tien">Hoàn tiền</a></nav>
          </div>
          <div className="site-footer-bottom"><p>Nội dung mang tính tham khảo, giải trí; không thay thế tư vấn chuyên môn.</p><a href="/#lap-la-so">Lập lá số của bạn <span aria-hidden="true">↗</span></a></div>
        </footer>
      </body>
    </html>
  );
}
