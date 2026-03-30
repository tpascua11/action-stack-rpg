// ============================================================
//  TagPool — Card-shaped active buff/debuff tags left of Vrax
// ============================================================

import { ui_registry, UI_DEFAULT } from '../battle/registry/ui_registry';
import DEFAULT_ICON from '../asssets/STATUS/DEFAULT.png';

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
        return (
          <div
            key={i}
            className="flex flex-col overflow-hidden border-2"
            style={{
              width: '4rem',
              background: '#09090f',
              borderColor: display.color,
              borderRadius: '3px',
              boxShadow: `0 0 10px ${display.color}55, inset 0 0 6px ${display.color}11`,
            }}
          >
            {/* Header strip — tag name */}
            <div
              className="flex-shrink-0 text-center text-[7px] font-bold text-white tracking-widest truncate px-1 font-body"
              style={{ background: display.color, lineHeight: '1.3rem' }}
            >
              {tag.tag_name.replace(/_/g, ' ')}
            </div>

            {/* Icon — fixed square, never shrinks */}
            <div className="flex items-center justify-center p-1" style={{ width: '4rem', height: '4rem' }}>
              <img
                src={display.statusIcon ?? DEFAULT_ICON}
                alt={tag.tag_name}
                className="w-full h-full object-contain"
                style={{ border: '1px solid rgba(255,255,255,0.25)', borderRadius: '2px' }}
              />
            </div>

            {/* Footer — duration */}
            {tag.duration && (
              <div
                className="flex-shrink-0 text-center text-[7px] font-mono text-[#ffd700]"
                style={{ background: '#0d0d1a', borderTop: `1px solid ${display.color}55`, lineHeight: '1.1rem' }}
              >
                {tag.duration}T
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
