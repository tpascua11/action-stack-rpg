// ============================================================
//  SAMURAI — Battle Spirit Bar (10 aztec sun pips)
// ============================================================

// 8 triangle rays pre-computed at 45° intervals (0° = up, clockwise)
// viewBox 0 0 24 24, center (12,12), tip r=10, base r=6.5, half-width=1.2
const RAY_POINTS = [
  '12,2 13.2,5.5 10.8,5.5',
  '19.1,4.9 17.4,8.3 15.8,6.6',
  '22,12 18.5,13.2 18.5,10.8',
  '19.1,19.1 15.8,17.4 17.4,15.8',
  '12,22 10.8,18.5 13.2,18.5',
  '4.9,19.1 6.6,15.8 8.3,17.4',
  '2,12 5.5,10.8 5.5,13.2',
  '4.9,4.9 8.3,6.6 6.6,8.3',
];

// state: 'filled' | 'planned' | 'empty'
function AztecSun({ state }) {
  const c =
    state === 'filled' ? 'white' :
    state === 'planned' ? 'white' :
    'rgba(255,255,255,0.15)';

  return (
    <svg
      viewBox="0 0 24 24"
      width="100%"
      height="100%"
      fill={c}
      style={state === 'planned' ? { animation: 'spiritPlanned 0.8s ease-in-out infinite' } : undefined}
    >
      {RAY_POINTS.map((pts, i) => <polygon key={i} points={pts} />)}
      <circle cx="12" cy="12" r="5" fill="none" stroke={c} strokeWidth="1.2" />
      <polygon points="12,9.5 13.5,12 12,14.5 10.5,12" />
    </svg>
  );
}

export default function SamuraiResourceBar({ resources, planned = {} }) {
  const { current = 0, max = 10 } = resources?.BATTLE_SPIRIT ?? {};
  const plannedAmount = Math.min(planned.BATTLE_SPIRIT ?? 0, current);

  // Pips: [0, current-planned) = filled, [current-planned, current) = planned, [current, max) = empty
  const freeFilled = current - plannedAmount;

  return (
    <>
      <style>{`
        @keyframes spiritPlanned {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.25; }
        }
      `}</style>
      <div className="relative flex items-center justify-center">
        <div className="relative flex" style={{ gap: '3px', zIndex: 0 }}>
          {Array.from({ length: max }, (_, i) => {
            const state =
              i < freeFilled ? 'filled' :
              i < current ? 'planned' :
              'empty';
            return (
              <div key={i} style={{ width: '30px', height: '30px', flexShrink: 0 }}>
                <AztecSun state={state} />
              </div>
            );
          })}
        </div>
        <span className="absolute text-[11px] font-mono tracking-widest whitespace-nowrap pointer-events-none"
          style={{
            color: 'white',
            zIndex: 1,
            bottom: '-8px',
            textShadow: '0 0 4px #000, 0 1px 3px #000, 0 0 8px #000',
          }}>
          BATTLE SPIRIT
        </span>
      </div>
    </>
  );
}
