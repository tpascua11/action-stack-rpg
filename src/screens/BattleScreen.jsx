// ============================================================
//  BattleScreen — battle and queue setup UI
// ============================================================

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CLASS_REGISTRY } from '../data/classes/class_registry';
import { useGame } from '../context/GameContext';

import { MUSIC_REGISTRY } from '../assets/MUSIC/index';
import EnemyZone from '../components/battle/EnemyZone';
import BattleLog from '../components/battle/BattleLog';
import BattleQueue from '../components/battle/BattleQueue';
import TagPool from '../components/battle/TagPool';
import PlayerPortrait from '../components/battle/PlayerPortrait';
import ActionQueue from '../components/battle/ActionQueue';
import Hand from '../components/battle/Hand';

export default function BattleScreen() {
  const { gs, dispatch, onBattleEnd } = useGame();
  const [retargetingSlot, setRetargetingSlot] = useState(null);
  const [lineCoords, setLineCoords] = useState(null);
  const battleTimerRef = useRef(null);
  const musicRef = useRef(null);

  const player = gs.characters.find(c => c.faction === 'player');
  const enemies = gs.characters.filter(c => c.faction === 'enemy');
  const { ResourceBar } = CLASS_REGISTRY[player.class_id] ?? {};


  // Battle music — start on mount, stop on RESULT or unmount
  useEffect(() => {
    const src = gs.music ? MUSIC_REGISTRY[gs.music] : null;
    if (!src) return;
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0.2;
    audio.play().catch(() => {}); // ignore autoplay policy errors
    musicRef.current = audio;
    return () => {
      audio.pause();
      audio.currentTime = 0;
      musicRef.current = null;
    };
  }, [gs.music]);

  useEffect(() => {
    if (gs.phase === 'RESULT' && musicRef.current) {
      musicRef.current.pause();
      musicRef.current.currentTime = 0;
    }
  }, [gs.phase]);

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

  useEffect(() => {
    if (gs.phase !== 'QUEUE_SETUP') { setLineCoords(null); return; }
    const lines = [];
    player.queue.forEach((slot, i) => {
      if (!slot?.target_id) return;
      const boxEl = document.querySelector(`[data-retarget-slot="${i}"]`);
      const enemyEl = document.querySelector(`[data-enemy-id="${slot.target_id}"]`);
      if (!boxEl || !enemyEl) return;
      const b = boxEl.getBoundingClientRect();
      const e = enemyEl.getBoundingClientRect();
      lines.push({
        key: i,
        isActive: retargetingSlot === i,
        x1: b.left + b.width / 2,
        y1: b.top,
        x2: e.left + e.width / 2,
        y2: e.bottom,
      });
    });
    setLineCoords(lines.length > 0 ? lines : null);
  }, [gs.phase, player.queue, retargetingSlot]);

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
    if (retargetingSlot === index) {
      // Already in retarget mode for this slot — cycle to next living enemy
      const living = enemies.filter(e => e.health > 0);
      if (living.length < 2) return;
      const currentTargetId = player.queue[index]?.target_id;
      const currentIdx = living.findIndex(e => e.id === currentTargetId);
      const nextEnemy = living[(currentIdx + 1) % living.length];
      dispatch({ type: 'RETARGET_SLOT', index, targetId: nextEnemy.id });
    } else {
      setRetargetingSlot(index);
    }
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
    <>
      {/* Retarget line overlay — portalled to document.body so it sits outside the CSS-transformed GameCanvas */}
      {lineCoords && createPortal(
        <svg className="fixed inset-0 pointer-events-none" style={{ zIndex: 9999 }} width="100%" height="100%">
          <defs>
            <filter id="arc-glow">
              <feGaussianBlur stdDeviation="2.5" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          {lineCoords.map(({ key, isActive, x1, y1, x2, y2 }) => isActive ? (
            <g key={key}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#4da6ff" strokeWidth="0.5" opacity="0.12"/>
              <line x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="#4da6ff" strokeWidth="3" opacity="0.5"
                strokeDasharray="10 5 2 8 14 3 6 4"
                filter="url(#arc-glow)"
                style={{ animation: 'electricA 0.6s linear infinite' }}
              />
              <line x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="#a0d4ff" strokeWidth="1.2" opacity="0.9"
                strokeDasharray="3 11 8 4 2 9 5 6"
                style={{ animation: 'electricB 0.4s linear infinite' }}
              />
            </g>
          ) : (
            <g key={key}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#4da6ff" strokeWidth="2" opacity="0.12" filter="url(#arc-glow)"/>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#4da6ff" strokeWidth="1" opacity="0.35" strokeDasharray="4 6"/>
            </g>
          ))}
        </svg>,
        document.body
      )}

      <div
        className="w-full h-full flex flex-col overflow-hidden bg-[#0f0f1a]"
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
          battleBackground={gs.battleBackground}
        />

        {/* MIDDLE — Battle Queue Row */}
        <BattleQueue
          characters={gs.characters}
          phase={gs.phase}
        />

        {/* BOTTOM — Player Zone */}
        <div className="flex-shrink-0 flex flex-col overflow-hidden">

          {/* Center row: Buff Column | Character Column | Slot Column */}
          <div className="flex-1 flex items-end justify-center overflow-hidden pt-2 pb-4 max-h-[26rem]" style={{ position: 'relative' }}>

            {/* Battle Log — absolutely positioned in left column space, does not affect flex layout */}
            <BattleLog logs={gs.logs} turn={gs.turn} />

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
            baseSpeed={player.base_speed}
          />

        </div>

      </div>
    </>
  );
}
