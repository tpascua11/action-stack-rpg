// ============================================================
//  TagPool — Card-shaped active buff/debuff tags left of Vrax
// ============================================================

import { ui_registry, UI_DEFAULT } from '../battle/registry/ui_registry';

export default function TagPool({ tags }) {
  if (tags.length === 0) {
    return <div className="w-24 flex items-center justify-center">
      <div className="text-[10px] text-gray-700 font-mono italic">no buffs</div>
    </div>;
  }

  return (
    <div className="flex flex-row gap-2">
      {tags.map((tag, i) => {
        const display = ui_registry[tag.tag_name] || UI_DEFAULT;
        const description = display.describe(tag);
        return (
          <div
            key={i}
            className="w-28 flex flex-col overflow-hidden rounded-lg border-2 shadow-lg"
            style={{ background: '#fff', borderColor: display.color }}
          >
            {/* Banner — buff name */}
            <div className="py-1 text-center text-[9px] font-bold text-white tracking-widest truncate px-1 font-body"
              style={{ background: display.color }}>
              {tag.tag_name.replace(/_/g, ' ')}
            </div>

            {/* Icon */}
            <div className="flex items-center justify-center py-3 bg-gray-100 text-3xl border-b border-gray-200">
              {display.icon}
            </div>

            {/* Description */}
            <div className="flex flex-col items-center px-1 py-2 flex-1 gap-1">
              <div className="text-[10px] font-bold font-mono text-center leading-tight" style={{ color: display.color }}>
                {description}
              </div>
              {tag.duration && (
                <div className="text-[9px] text-[#ffd700] font-mono">{tag.duration}T left</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
