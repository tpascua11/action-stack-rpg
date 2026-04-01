// ============================================================
//  TagPool — Active buff/debuff tags left of Vrax
// ============================================================

import { ui_registry, UI_DEFAULT } from '../battle/registry/ui_registry';
import { STATUS_DEFAULT as DEFAULT_ICON } from '../asssets';

const TAG_SIZE = 'calc((24rem - 7 * 0.375rem) / 8)';

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

// ── Left section: bar style for 'advanced' tier tags ─────────
function BarTag({ icon, color, stacks, name, duration, tooltip }) {
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

export default function TagPool({ tags }) {
  const advancedTags   = tags.filter(t => t.tier === 'advanced');
  const conditionTags  = tags.filter(t => t.tier === 'condition');

  // Chunk condition tags into columns of 8, newest rightmost
  const columns = [];
  for (let i = 0; i < conditionTags.length; i += 8) columns.push(conditionTags.slice(i, i + 8));

  // Always show at least one empty column
  const paddedColumns = columns.length === 0 ? [[]] : columns;

  const advancedColumn = advancedTags.length > 0 ? (
    <div className="flex flex-col-reverse gap-1.5" style={{ marginRight: '16px' }}>
      {advancedTags.map((tag, i) => {
        const display = ui_registry[tag.tag_name] || UI_DEFAULT;
        const stacks = tag.stacks ?? tag.stack_count ?? 1;
        const description = display.describe(tag);
        return (
          <BarTag
            key={i}
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
  ) : null;

  return (
    <div className="flex flex-row-reverse gap-1.5">
      {paddedColumns.map((col, ci) => (
        <div key={ci} className="flex flex-col-reverse gap-1.5">
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
      {/* Advanced tier tags — leftmost, bar style */}
      {advancedColumn}
    </div>
  );
}
