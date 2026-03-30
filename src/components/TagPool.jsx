// ============================================================
//  TagPool — Active buff/debuff tags left of Vrax
// ============================================================

import { ui_registry, UI_DEFAULT } from '../battle/registry/ui_registry';
import DEFAULT_ICON from '../asssets/STATUS/DEFAULT.png';

export default function TagPool({ tags }) {
  if (tags.length === 0) {
    return <div className="w-24 flex items-center justify-center">
      <div className="text-[10px] text-gray-700 font-mono italic">no buffs</div>
    </div>;
  }

  // Chunk into columns of 6, newest tags in the rightmost column
  const columns = [];
  for (let i = 0; i < tags.length; i += 6) columns.push(tags.slice(i, i + 6));

  return (
    <div className="flex flex-row-reverse gap-1.5">
      {columns.map((col, ci) => (
        <div key={ci} className="flex flex-col gap-1.5">
          {col.map((tag, i) => {
            const display = ui_registry[tag.tag_name] || UI_DEFAULT;
            const description = display.describe(tag);
            const hasDesc = description && description !== 'active';
            return (
              <div
                key={i}
                className="group relative flex flex-row items-center overflow-visible border"
                style={{
                  width: '11rem',
                  minHeight: '2.5rem',
                  background: '#09090f',
                  borderColor: display.color,
                  borderRadius: '3px',
                  boxShadow: `0 0 10px ${display.color}55, inset 0 0 6px ${display.color}11`,
                }}
              >
                {/* Left — icon */}
                <div className="flex-shrink-0 self-start flex items-center justify-center p-1" style={{ width: '2.5rem', height: '2.5rem' }}>
                  <img
                    src={display.statusIcon ?? DEFAULT_ICON}
                    alt={tag.tag_name}
                    className="w-full h-full object-contain"
                    style={{ border: '1px solid rgba(255,255,255,0.25)', borderRadius: '2px' }}
                  />
                </div>

                {/* Right — name + duration on same row */}
                <div className="flex flex-row items-center justify-between min-w-0 flex-1 self-stretch py-1">
                  <span className="flex-shrink-0 text-[13px] text-white font-mono mr-1 self-center">
                    x{tag.stack_count ?? 1}
                  </span>
                  <div
                    className="text-[13px] font-bold tracking-wide font-body leading-tight flex-1 min-w-0 flex items-center"
                    style={{ color: display.color }}
                  >
                    <span className="break-words">{tag.tag_name.replace(/_/g, ' ')}</span>
                  </div>
                  {tag.duration && (
                    <span className="flex-shrink-0 text-[13px] text-[#ffd700] font-mono ml-1 self-center">{tag.duration}⏳</span>
                  )}
                </div>

                {/* Tooltip — shown on hover */}
                {hasDesc && (
                  <div
                    className="pointer-events-none absolute bottom-[calc(100%+6px)] left-0
                      w-44 rounded-lg border border-gray-600 shadow-xl z-[100]
                      opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                    style={{ background: '#1a1a2e' }}
                  >
                    <div className="h-1 rounded-t-lg" style={{ background: display.color }} />
                    <div className="px-3 py-2 flex flex-col gap-1">
                      <div className="text-[11px] font-bold font-body" style={{ color: display.color }}>
                        {tag.tag_name.replace(/_/g, ' ')}
                      </div>
                      <div className="text-[10px] text-gray-300 font-mono leading-tight">{description}</div>
                      {tag.duration && (
                        <div className="text-[9px] text-[#ffd700] font-mono">{tag.duration} turns remaining</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
