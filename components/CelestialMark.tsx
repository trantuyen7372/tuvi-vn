/** Decorative astrological astrolabe linework inspired by the twelve palaces. */
export default function CelestialMark() {
  return (
    <svg className="celestial-mark" viewBox="0 0 300 300" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="astrolabe-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c58b18" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#c58b18" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="150" cy="150" r="144" fill="url(#astrolabe-glow)" />
      <circle cx="150" cy="150" r="140" stroke="#b89355" strokeWidth="1.2" strokeOpacity="0.85" />
      <circle cx="150" cy="150" r="132" stroke="#d4bb88" strokeWidth="0.8" strokeDasharray="2 4" strokeOpacity="0.75" />
      <circle cx="150" cy="150" r="106" stroke="#b89355" strokeWidth="1" strokeOpacity="0.8" />
      <circle cx="150" cy="150" r="74" stroke="#cfae74" strokeWidth="0.8" strokeDasharray="3 3" strokeOpacity="0.6" />
      {Array.from({ length: 12 }, (_, index) => {
        const angle = (index * Math.PI) / 6;
        const point = (radius: number) => [
          150 + Math.sin(angle) * radius,
          150 - Math.cos(angle) * radius,
        ].map((n) => Number(n.toFixed(3)));
        const [x1, y1] = point(106),
          [x2, y2] = point(140),
          [cx, cy] = point(118);
        return (
          <g key={index}>
            <path d={`M${x1} ${y1}L${x2} ${y2}`} stroke="#b89355" strokeWidth="1" strokeOpacity="0.8" />
            <circle cx={cx} cy={cy} r="2.2" fill="#9b1c1c" />
          </g>
        );
      })}
      <path
        d="m150 42 26 82 82 26-82 26-26 82-26-82-82-26 82-26 26-82Z"
        stroke="#9b1c1c"
        strokeWidth="1.2"
        strokeOpacity="0.75"
        fill="#9b1c1c"
        fillOpacity="0.04"
      />
      <path
        d="m88 88 62 26 62-26-26 62 26 62-62-26-62 26 26-62-26-62Z"
        stroke="#b89355"
        strokeWidth="1"
        strokeOpacity="0.65"
      />
      <circle cx="150" cy="150" r="44" stroke="#b89355" strokeWidth="1" strokeOpacity="0.8" fill="#fffdf9" />
      <path
        d="m150 126 6 18 18 6-18 6-6 18-6-18-18-6 18-6 6-18Z"
        fill="#9b1c1c"
      />
      <circle cx="150" cy="150" r="4" fill="#fcf6ec" stroke="#9b1c1c" strokeWidth="1" />
    </svg>
  );
}
