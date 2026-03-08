// ============================================================
//  TagPool — Left of Vrax, shows active buff/debuff tags
// ============================================================

export default function TagPool({ tags }) {
  return (
    <div className="w-36 flex flex-col gap-2 items-end justify-center pr-3">
      <div className="text-[9px] text-gray-600 font-mono tracking-widest mb-1 self-start">ACTIVE TAGS</div>
      {tags.length === 0 && (
        <div className="text-[10px] text-gray-700 font-mono italic">none</div>
      )}
      {tags.map((tag, i) => (
        <div key={i}
          className="w-full bg-black/50 border border-[#4da6ff]/30 rounded px-2 py-1 animate-fadeIn">
          <div className="text-[10px] text-[#4da6ff] font-mono font-bold">{tag.tag_name}</div>
          {tag.stack_count > 0 && (
            <div className="text-[9px] text-gray-400 font-mono">×{tag.stack_count} stacks</div>
          )}
          {tag.duration && (
            <div className="text-[9px] text-[#ffd700] font-mono">{tag.duration}T left</div>
          )}
          {tag.amount && (
            <div className="text-[9px] text-green-400 font-mono">+{tag.amount} SPD</div>
          )}
        </div>
      ))}
    </div>
  );
}
