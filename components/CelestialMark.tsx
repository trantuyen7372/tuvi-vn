/** Decorative linework inspired by the twelve palaces, not a calculated birth chart. */
export default function CelestialMark(){
  return <svg className="celestial-mark" viewBox="0 0 300 300" fill="none" aria-hidden="true">
    <circle cx="150" cy="150" r="139" stroke="currentColor" strokeWidth=".7"/>
    <circle cx="150" cy="150" r="124" stroke="currentColor" strokeWidth=".7" strokeDasharray="1 6"/>
    <circle cx="150" cy="150" r="102" stroke="currentColor" strokeWidth=".7"/>
    {Array.from({length:12},(_,index)=>{
      const angle=index*Math.PI/6;
      const point=(radius:number)=>[150+Math.sin(angle)*radius,150-Math.cos(angle)*radius].map(n=>Number(n.toFixed(3)));
      const [x1,y1]=point(102),[x2,y2]=point(139),[cx,cy]=point(113);
      return <g key={index}><path d={`M${x1} ${y1}L${x2} ${y2}`} stroke="currentColor" strokeWidth=".7"/><circle cx={cx} cy={cy} r="2" fill="currentColor"/></g>;
    })}
    <path d="m150 48 24 78 78 24-78 24-24 78-24-78-78-24 78-24 24-78Z" stroke="currentColor" strokeWidth=".7"/>
    <path d="m92 92 58 24 58-24-24 58 24 58-58-24-58 24 24-58-24-58Z" stroke="currentColor" strokeWidth=".7"/>
    <circle cx="150" cy="150" r="44" stroke="currentColor" strokeWidth=".7"/>
    <path d="m150 128 5 17 17 5-17 5-5 17-5-17-17-5 17-5 5-17Z" fill="currentColor"/>
    <circle cx="150" cy="150" r="4" fill="var(--giay)"/>
  </svg>;
}
