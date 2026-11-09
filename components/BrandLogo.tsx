export default function BrandLogo() {
  return (
    <a href="/" className="group mr-4 flex shrink-0 items-center gap-2.5 text-son">
      <svg
        aria-hidden="true"
        viewBox="0 0 64 64"
        className="h-9 w-9 shrink-0 rounded-lg shadow-sm transition-transform group-hover:scale-105"
        fill="none"
      >
        <rect x="2" y="2" width="60" height="60" rx="14" fill="#9b1c1c" />
        <rect x="5.5" y="5.5" width="53" height="53" rx="11" stroke="#d9c7a3" strokeWidth="1.5" strokeOpacity="0.8" />
        <circle cx="32" cy="32" r="22" stroke="#f5ead4" strokeWidth="1.25" strokeDasharray="2.5 3.2" strokeOpacity="0.8" />
        <circle cx="32" cy="32" r="16" stroke="#d9c7a3" strokeWidth="1" strokeOpacity="0.5" />
        <circle cx="32" cy="10" r="1.8" fill="#f5ead4" />
        <circle cx="32" cy="54" r="1.8" fill="#f5ead4" />
        <circle cx="10" cy="32" r="1.8" fill="#f5ead4" />
        <circle cx="54" cy="32" r="1.8" fill="#f5ead4" />
        <path
          d="M32 13L35.4 25.2L44 20L38.8 28.6L51 32L38.8 35.4L44 44L35.4 38.8L32 51L28.6 38.8L20 44L25.2 35.4L13 32L25.2 28.6L20 20L28.6 25.2L32 13Z"
          fill="#fffaf0"
        />
        <circle cx="32" cy="32" r="4.2" fill="#9b1c1c" />
        <circle cx="32" cy="32" r="2" fill="#f5ead4" />
      </svg>
      <span className="leading-tight">
        <span className="block font-serif text-lg font-bold tracking-tight text-son sm:text-xl">Tử Vi Đẩu Số</span>
        <span className="hidden text-[11px] font-medium tracking-wider text-[#6b5b45] sm:block">XEMTUVIONLINE.VN</span>
      </span>
    </a>
  );
}
