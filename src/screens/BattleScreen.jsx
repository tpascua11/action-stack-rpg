// ============================================================
//  BattleScreen — battle and queue setup UI
// ============================================================

import { useEffect, useRef, useState } from 'react';
import { CLASS_REGISTRY } from '../data/classes/class_registry';
import { useGame } from '../context/GameContext';

import EnemyZone from '../components/battle/EnemyZone';
import BattleLog from '../components/battle/BattleLog';
import BattleQueue from '../components/battle/BattleQueue';
import TagPool from '../components/battle/TagPool';
import PlayerPortrait from '../components/battle/PlayerPortrait';
import ActionQueue from '../components/battle/ActionQueue';
import Hand from '../components/battle/Hand';

export default function BattleScreen() {
  const { gs, dispatch, onBattleEnd } = useGame();
  const [logOpen, setLogOpen] = useState(false);
  const [retargetingSlot, setRetargetingSlot] = useState(null);
  const [lineCoords, setLineCoords] = useState(null);
  const battleTimerRef = useRef(null);

  const player = gs.characters.find(c => c.faction === 'player');
  const enemies = gs.characters.filter(c => c.faction === 'enemy');
  const { ResourceBar } = CLASS_REGISTRY[player.class_id] ?? {};

  const [scale, setScale] = useState(() => Math.min(1, window.innerWidth / 1920, window.innerHeight / 1080));
  useEffect(() => {
    const onResize = () => setScale(Math.min(1, window.innerWidth / 1920, window.innerHeight / 1080));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Drive battle loop with timed steps
  useEffect(() => {
    if (gs.phase !== 'BATTLE') return;
    battleTimerRef.current = setTimeout(() => {
      dispatch({ type: 'BATTLE_STEP' });
    }, 1000);
    return () => clearTimeout(battleTimerRef.current);
  }, [gs.phase, gs.stepCount]);

  // Stop shake animation
  useEffect(() => {
    if (!gs.shakingEnemyId) return;
    const t = setTimeout(() => dispatch({ type: 'STOP_SHAKE' }), 350);
    return () => clearTimeout(t);
  }, [gs.shakingEnemyId]);

  // Stop fizzle animation
  useEffect(() => {
    if (!gs.fizzlingCard) return;
    const t = setTimeout(() => dispatch({ type: 'STOP_FIZZLE' }), 600);
    return () => clearTimeout(t);
  }, [gs.fizzlingCard]);

  const slotTargetId = retargetingSlot !== null ? player.queue[retargetingSlot]?.target_id ?? null : null;

  useEffect(() => {
    if (retargetingSlot === null || !slotTargetId) { setLineCoords(null); return; }
    const boxEl = document.querySelector(`[data-retarget-slot="${retargetingSlot}"]`);
    const enemyEl = document.querySelector(`[data-enemy-id="${slotTargetId}"]`);
    if (!boxEl || !enemyEl) { setLineCoords(null); return; }
    const b = boxEl.getBoundingClientRect();
    const e = enemyEl.getBoundingClientRect();
    setLineCoords({
      x1: b.left + b.width / 2,
      y1: b.top,
      x2: e.left + e.width / 2,
      y2: e.bottom,
    });
  }, [retargetingSlot, slotTargetId]);

  function handleEnemyClick(targetId) {
    if (gs.phase !== 'QUEUE_SETUP') return;
    if (retargetingSlot !== null) {
      dispatch({ type: 'RETARGET_SLOT', index: retargetingSlot, targetId });
    } else {
      dispatch({ type: 'SELECT_TARGET', targetId });
    }
  }

  function handleRetargetBoxClick(index) {
    if (gs.phase !== 'QUEUE_SETUP') return;
    setRetargetingSlot(prev => prev === index ? null : index);
  }

  function handleCardClick(card) {
    if (gs.phase !== 'QUEUE_SETUP') return;
    if (player.queue.filter(Boolean).length >= player.total_action_slots) return;
    dispatch({ type: 'ADD_TO_QUEUE', card });
  }

  function handleClearSlot(index) {
    dispatch({ type: 'CLEAR_SLOT', index });
  }

  function handleExecute() {
    if (gs.phase === 'RESULT') {
      onBattleEnd(player.health, gs.result === 'WIN');
      return;
    }
    if (gs.phase !== 'QUEUE_SETUP') return;
    if (!player.queue.some(Boolean)) return;
    dispatch({ type: 'START_BATTLE' });
  }

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#0f0f1a', position: 'relative' }}>

      {/* Retarget line overlay — outside scaled container so fixed+getBoundingClientRect coords align */}
      {lineCoords && (() => {
        const { x1, y1, x2, y2 } = lineCoords;
        return (
          <svg className="fixed inset-0 pointer-events-none" style={{ zIndex: 40 }} width="100%" height="100%">
            <defs>
              <filter id="arc-glow">
                <feGaussianBlur stdDeviation="2.5" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>

            {/* Track */}
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#4da6ff" strokeWidth="0.5" opacity="0.12"/>

            {/* Arc A — wide, slow, irregular */}
            <line x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#4da6ff" strokeWidth="3" opacity="0.5"
              strokeDasharray="10 5 2 8 14 3 6 4"
              filter="url(#arc-glow)"
              style={{ animation: 'electricA 0.6s linear infinite' }}
            />

            {/* Arc B — thin, faster, different rhythm */}
            <line x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#a0d4ff" strokeWidth="1.2" opacity="0.9"
              strokeDasharray="3 11 8 4 2 9 5 6"
              style={{ animation: 'electricB 0.4s linear infinite' }}
            />

          </svg>
        );
      })()}

      {/* Game canvas — fixed 1920×1080 scaled down when viewport is smaller; fluid layout when larger */}
      <div
        style={scale < 1 ? {
          width: 1920,
          height: 1080,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          position: 'absolute',
          top: `${(window.innerHeight - 1080 * scale) / 2}px`,
          left: `${(window.innerWidth - 1920 * scale) / 2}px`,
        } : {}}
        className={scale < 1
          ? "flex flex-col overflow-hidden bg-[#0f0f1a]"
          : "w-screen h-screen flex flex-col overflow-hidden bg-[#0f0f1a]"}
        onClick={() => setRetargetingSlot(null)}
      >

        {/* TOP — Enemy Zone */}
        <EnemyZone
          enemies={enemies}
          shakingEnemyId={gs.shakingEnemyId}
          activeEnemyId={gs.activeEnemyId}
          selectedTargetId={gs.lastTargetId}
          phase={gs.phase}
          retargetingSlot={retargetingSlot}
          onSelectTarget={handleEnemyClick}
        />

        {/* MIDDLE — Battle Queue Row */}
        <BattleQueue
          characters={gs.characters}
          phase={gs.phase}
        />

        {/* BOTTOM — Player Zone */}
        <div className="flex-shrink-0 flex flex-col overflow-hidden">

          {/* Center row: Buff Column | Character Column | Slot Column */}
          <div className="flex-1 flex items-end justify-center overflow-hidden pt-2 pb-4 max-h-[26rem]">

            {/* LEFT — Condition tag column (fixed width, right-aligned so buffs hug the gap) */}
            <div style={{ width: '340px', paddingRight: '12px', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', alignSelf: 'flex-end' }}>
              <TagPool tags={player.active_tag_pool.filter(t => t.status_type === 'debuff')} />
            </div>

            {/* CENTER — Character column */}
            <PlayerPortrait player={player} />

            {/* RIGHT — Advanced tag column + Slot column */}
            <div style={{ width: '340px', paddingLeft: '12px', display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: '12px' }}>
              <TagPool tags={player.active_tag_pool.filter(t => t.status_type === 'buff')} growRight />
              <ActionQueue
                queue={player.queue}
                totalSlots={player.total_action_slots}
                enemies={enemies}
                onClearSlot={handleClearSlot}
                retargetingSlot={retargetingSlot}
                onRetargetBoxClick={handleRetargetBoxClick}
                onExecute={handleExecute}
                isBattling={gs.phase === 'BATTLE'}
                isResult={gs.phase === 'RESULT'}
                fizzlingCard={gs.fizzlingCard ?? null}
              />
            </div>

          </div>

          {/* BOTTOM — Hand */}
          <Hand
            cards={player.cards}
            queue={player.queue}
            totalSlots={player.total_action_slots}
            onCardClick={handleCardClick}
            disabled={gs.phase !== 'QUEUE_SETUP'}
            resources={player.resources}
            ResourceBar={ResourceBar}
          />
        </div>

      </div>

      {/* FLOATING — Log toggle button */}
      <button
        onClick={() => setLogOpen(o => !o)}
        className="text-[8px] font-mono tracking-widest px-2 py-1 rounded border transition-colors"
        style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          zIndex: 50,
          borderColor: logOpen ? '#4da6ff' : '#374151',
          color: logOpen ? '#4da6ff' : '#4b5563',
          background: 'rgba(9,9,15,0.85)',
        }}
      >
        LOG
      </button>

      {/* FLOATING — Battle Log modal (outside scaled container so fixed+drag coords are viewport-relative) */}
      <BattleLog
        logs={gs.logs}
        turn={gs.turn}
        isOpen={logOpen}
        onClose={() => setLogOpen(false)}
      />
    </div>
  );
}
