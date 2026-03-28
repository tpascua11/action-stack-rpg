// ============================================================
//  BattleLog — Draggable floating modal showing battle events
// ============================================================

import { useEffect, useRef, useState } from 'react';

const LOG_COLORS = {
  dmg:   'text-[#e94560]',
  heal:  'text-green-400',
  buff:  'text-[#4da6ff]',
  clash:  'text-purple-400',
  fizzle: 'text-orange-400',
  info:  'text-[#ffd700]',
  normal:'text-gray-400',
};

export default function BattleLog({ logs, turn, isOpen, onClose }) {
  const scrollRef = useRef(null);
  const dragOrigin = useRef(null);
  const [pos, setPos] = useState({ x: 24, y: 120 });

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [logs]);

  function onMouseDown(e) {
    dragOrigin.current = { mx: e.clientX - pos.x, my: e.clientY - pos.y };

    function onMove(e) {
      setPos({ x: e.clientX - dragOrigin.current.mx, y: e.clientY - dragOrigin.current.my });
    }
    function onUp() {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed z-[300] flex flex-col rounded border border-white/10 shadow-2xl"
      style={{ left: pos.x, top: pos.y, width: '22rem', height: '16rem', background: '#0f0f1a' }}
    >
      {/* Drag handle / title bar */}
      <div
        onMouseDown={onMouseDown}
        className="flex items-center justify-between px-3 py-1 border-b border-white/10 cursor-grab active:cursor-grabbing select-none flex-shrink-0"
        style={{ background: '#1a1a2e' }}
      >
        <span className="text-[9px] font-mono tracking-widest text-gray-500">
          BATTLE LOG — T{turn}
        </span>
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-white text-[11px] font-mono transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Log entries */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-[2px]">
        {logs.map((l, i) => (
          <div key={i} className={`text-[11px] font-mono leading-tight ${LOG_COLORS[l.type] || LOG_COLORS.normal}`}>
            {l.msg}
          </div>
        ))}
      </div>
    </div>
  );
}
