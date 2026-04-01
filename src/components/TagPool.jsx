// ============================================================
//  TagPool — Active buff/debuff tags left of Vrax
// ============================================================

import { ui_registry, UI_DEFAULT } from '../battle/registry/ui_registry';
import DEFAULT_ICON from '../asssets/STATUS/DEFAULT.png';
import FROST_1 from '../asssets/STATUS/FROST_1.png';
import FOX_31 from '../asssets/FOX_SUMMURAI/fox_summurai_31.png';
import FOX_10 from '../asssets/FOX_SUMMURAI/fox_summurai_10.png';

const TAG_SIZE = 'calc((24rem - 7 * 0.375rem) / 8)';

// --- TEST TEMPLATES (remove when done) ---
const TEST_TAGS = [
  { tag_name: 'FROST_AURA',  _testIcon: FROST_1, color: '#7ec8e3', stacks: 3, duration: 4 },
  { tag_name: 'FOX_SPIRIT',  _testIcon: FOX_31,  color: '#e8a045', stacks: 1, duration: 2 },
  { tag_name: 'BLADE_DANCE', _testIcon: FOX_10,  color: '#c084fc', stacks: 5, duration: null },
];

// ── Top section: icon-only square tiles ─────────────────────
function IconTag({ icon, color, stacks, name, duration, tooltip }) {
  return (
    <div
      className="group relative flex flex-row items-center overflow-visible"
      style={{ height: TAG_SIZE }}
    >
      <div
        className="flex-shrink-0 relative flex items-center justify-center"
        style={{
          width: TAG_SIZE,
          height: TAG_SIZE,
          background: '#09090f',
          border: `1px solid ${color}`,
          borderRadius: '3px',
          boxShadow: `0 0 8px ${color}55, inset 0 0 4px ${color}11`,
        }}
      >
        <img src={icon} alt={name} className="w-full h-full object-contain" style={{ borderRadius: '2px' }} />
        <span
          className="absolute bottom-0 right-0 text-[14px] text-white font-mono leading-none"
          style={{ textShadow: '0 0 3px #000, 0 0 3px #000', padding: '1px 2px' }}
        >
          {stacks}
        </span>
      </div>

      {tooltip && (
        <div
          className="pointer-events-none absolute bottom-[calc(100%+6px)] left-0
            w-44 rounded-lg border border-gray-600 shadow-xl z-[100]
            opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          style={{ background: '#1a1a2e' }}
        >
          <div className="h-1 rounded-t-lg" style={{ background: color }} />
          <div className="px-3 py-2 flex flex-col gap-1">
            <div className="text-[11px] font-bold font-body" style={{ color }}>{name}</div>
            <div className="text-[10px] text-gray-300 font-mono leading-tight">{tooltip}</div>
            {duration && <div className="text-[9px] text-[#ffd700] font-mono">{duration} turns remaining</div>}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Bottom section: old bar style (icon + stack + name + duration) ──
function BarTag({ icon, color, stacks, name, duration }) {
  return (
    <div
      className="group relative flex flex-row items-center overflow-visible"
      style={{
        width: '12rem',
        minHeight: '2.5rem',
        background: '#09090f',
        border: `2px solid ${color}`,
        borderRadius: '3px',
        boxShadow: `0 0 10px ${color}55, inset 0 0 6px ${color}11`,
      }}
    >
      {/* Left — icon */}
      <div
        className="flex-shrink-0 self-stretch flex items-center justify-center"
        style={{ width: '2.5rem', borderRight: `1px solid ${color}` }}
      >
        <img
          src={icon}
          alt={name}
          className="w-full h-full object-contain"
          style={{ borderRadius: '2px' }}
        />
      </div>

      {/* Right — stack + name + duration */}
      <div className="flex flex-row items-center justify-between min-w-0 flex-1 self-stretch py-1">
        <>
          <span className="flex-shrink-0 text-[13px] text-white font-mono mx-2 self-center">x{stacks}</span>
          <div className="flex-shrink-0 self-stretch w-px ml-0.5 mr-1.5" style={{ background: 'rgba(255,255,255,0.15)' }} />
        </>
        <div
          className="text-[13px] font-bold tracking-wide font-body leading-tight flex-1 min-w-0 flex items-center"
          style={{ color }}
        >
          <span className="break-words">{name}</span>
        </div>
        {duration && (
          <span className="flex-shrink-0 text-[13px] text-[#ffd700] font-mono ml-1 self-center">{duration}⏳</span>
        )}
      </div>
    </div>
  );
}

export default function TagPool({ tags }) {
  // Chunk into columns of 8, newest tags in the rightmost column
  const columns = [];
  for (let i = 0; i < tags.length; i += 8) columns.push(tags.slice(i, i + 8));

  const testColumn = (
    <div className="flex flex-col-reverse gap-1.5" style={{ marginRight: '16px' }}>
      {TEST_TAGS.map((t, i) => (
        <BarTag
          key={i}
          icon={t._testIcon}
          color={t.color}
          stacks={t.stacks}
          name={t.tag_name.replace(/_/g, ' ')}
          duration={t.duration}
        />
      ))}
    </div>
  );

  // Always show a full first column even if no tags yet
  const paddedColumns = columns.length === 0 ? [[]] : columns;

  return (
    <div className="flex flex-row-reverse gap-1.5">
      {paddedColumns.map((col, ci) => (
        <div key={ci} className="flex flex-col-reverse gap-1.5">
          {/* Fill up to 8 slots — empty placeholders at the top (rendered first in col-reverse) */}
          {Array.from({ length: 8 }).map((_, si) => {
            const tag = col[si];
            if (!tag) return (
              <div
                key={si}
                style={{
                  width: TAG_SIZE,
                  height: TAG_SIZE,
                  border: '1px solid rgba(255,255,255,0.18)',
                  borderRadius: '3px',
                  background: 'rgba(255,255,255,0.02)',
                }}
              />
            );
            const display = ui_registry[tag.tag_name] || UI_DEFAULT;
            const description = display.describe(tag);
            const stacks = tag.stacks ?? tag.stack_count ?? 1;
            return (
              <IconTag
                key={si}
                icon={display.statusIcon ?? DEFAULT_ICON}
                color={display.color}
                stacks={stacks}
                name={tag.tag_name.replace(/_/g, ' ')}
                duration={tag.duration}
                tooltip={description && description !== 'active' ? description : null}
              />
            );
          })}
        </div>
      ))}
      {/* Test column — last in flex-row-reverse = leftmost */}
      {testColumn}
    </div>
  );
}
