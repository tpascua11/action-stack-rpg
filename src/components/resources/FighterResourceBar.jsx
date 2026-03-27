// ============================================================
//  FIGHTER — Rage Bar
// ============================================================

export default function FighterResourceBar({ current, max }) {
  const pct = max > 0 ? Math.min(current / max, 1) : 0;

  return (
    <div className="relative w-full h-5 rounded-full overflow-hidden"
      style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(220,38,38,0.3)' }}>

      {/* Flame fill */}
      <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-300"
        style={{
          width: `${pct * 100}%`,
          background: 'linear-gradient(90deg, #7f1d1d, #dc2626, #f97316, #fbbf24)',
          boxShadow: pct > 0 ? '0 0 8px #f97316, 0 0 16px #dc262666' : 'none',
        }} />

      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none rounded-full"
        style={{ background: 'repeating-linear-gradient(90deg, transparent 0px, transparent 6px, rgba(0,0,0,0.15) 6px, rgba(0,0,0,0.15) 7px)' }} />

      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-white drop-shadow">
        {current} / {max} RAGE
      </span>
    </div>
  );
}
