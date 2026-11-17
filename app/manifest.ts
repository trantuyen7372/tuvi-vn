import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Xem Tử Vi Online – Lập Lá Số & Luận Giải',
    short_name: 'Xem Tử Vi',
    description: 'Lập lá số Tử Vi Đẩu Số trọn đời miễn phí, xem ngày tốt xấu, xin xăm Quan Âm và xem bói hợp tuổi.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fbf7ee',
    theme_color: '#991b1b',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/apple-touch-icon.svg',
        sizes: '180x180',
        type: 'image/svg+xml',
      },
    ],
  };
}
