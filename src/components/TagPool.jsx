// ============================================================
//  TagPool — Card-shaped active buff/debuff tags left of Vrax
// ============================================================

const TAG_DISPLAY = {
  MAGIC_CHARGE:       { icon: '✨', color: '#7c3aed' },
  MOMENTUM:           { icon: '💨', color: '#ff6b35' },
  FIRE_CHARGE:        { icon: '🔥', color: '#ef4444' },
  SPEED_BOOST:        { icon: '⚡', color: '#eab308' },
  COMBO_STACK:        { icon: '⚔️',  color: '#6b7280' },
  FORWARD_INITIATIVE: { icon: '🎯', color: '#22c55e' },
};

const DEFAULT = { icon: '🔮', color: '#4da6ff' };

export default function TagPool({ tags }) {
  if (tags.length === 0) {
    return <div className="w-24 flex items-center justify-center">
      <div className="text-[10px] text-gray-700 font-mono italic">no buffs</div>
    </div>;
  }

  return (
    <div className="flex flex-row gap-2">
      {tags.map((tag, i) => {
        const display = TAG_DISPLAY[tag.tag_name] || DEFAULT;
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

            {/* Stats */}
            <div className="flex flex-col items-center px-1 py-2 flex-1">
              {tag.stack_count > 0 && (
                <div className="text-[11px] font-bold font-mono" style={{ color: display.color }}>
                  ×{tag.stack_count} stacks
                </div>
              )}
              {tag.duration && (
                <div className="text-[9px] text-[#ffd700] font-mono">{tag.duration}T left</div>
              )}
              {!tag.stack_count && !tag.duration && (
                <div className="text-[9px] text-gray-400 font-mono">active</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
