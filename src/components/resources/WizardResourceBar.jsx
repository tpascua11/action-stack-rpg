// ============================================================
//  WIZARD — Mana Bar
// ============================================================

export default function WizardResourceBar({ resources }) {
  const { current = 0, max = 300 } = resources?.MANA ?? {};
  const pct = max > 0 ? Math.min(current / max, 1) : 0;

  return (
    <div className="relative w-full h-5 rounded-full overflow-hidden"
      style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(124,58,237,0.3)' }}>

      {/* Mana fill */}
      <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
        style={{
          width: `${pct * 100}%`,
          background: 'linear-gradient(90deg, #4c1d95, #7c3aed, #a78bfa)',
          boxShadow: pct > 0 ? '0 0 8px #a78bfa, 0 0 16px #7c3aed66' : 'none',
        }} />

      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-white drop-shadow">
        {current} / {max} MP
      </span>
    </div>
  );
}
