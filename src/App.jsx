import { useReducer, useEffect, useRef, useState } from 'react';
import { EMBER_WITCH } from './data/characters/enemies';
import { SAMURAI } from './data/classes/samurai';
import { buildPlayer } from './data/player';
import { CLASS_REGISTRY } from './data/classes/class_registry';
import {
  calcSpeed,
  effectiveResourceAtExecution,
  addTagToPool,
  SpeedCheckAllAvailableActions,
  InteractionCheck,
  ExecuteAction,
  ActionCleanup,
  TurnResultCleanup,
} from './battle/engine/battle_engine';

import EnemyZone from './components/EnemyZone';
import BattleLog from './components/BattleLog';
import BattleQueue from './components/BattleQueue';
import TagPool from './components/TagPool';
import VraxPortrait from './components/VraxPortrait';
import ActionQueue from './components/ActionQueue';
import Hand from './components/Hand';

// ── CURRENT ENCOUNTER ──
const CURRENT_ENCOUNTER = [EMBER_WITCH, EMBER_WITCH];

// ── BUILD INITIAL STATE ──
function buildInitialState(enemies = CURRENT_ENCOUNTER) {
  const builtEnemies = enemies.map((def, i) => ({
    ...JSON.parse(JSON.stringify(def)),
    id: `${def.id}_${i + 1}`,
  }));
  const vrax = buildPlayer(SAMURAI, { id: 'vrax', name: 'VRAX', portrait: null });
  const characters = [vrax, ...builtEnemies];
  return {
    phase: 'QUEUE_SETUP',  // QUEUE_SETUP | BATTLE | RESULT
    turn: 1,
    result: null,          // WIN | LOSS
    characters,
    logs: [{ msg: '⚔️  System Ready. Queue your actions and execute.', type: 'info' }],
    stepCount: 0,
    shakingEnemyId: null,
    lastTargetId: characters.find(c => !c.is_player && c.health > 0)?.id ?? null,
  };
}

// ── BUILD ENEMY QUEUE ──
function buildEnemyQueue(enemy) {
  return enemy.base_actions.map((act, i) => ({
    ...act,
    owner_id: enemy.id,
    owner_name: enemy.name,
    target_id: 'vrax',
    payload_type: act.payload_type || 'PHYSICAL',
    calc_speed: calcSpeed(act.speed, i),
    priority_flag: null,
  }));
}

// ── REDUCER ──
function battleReducer(state, action) {
  switch (action.type) {

    case 'ADD_TO_QUEUE': {
      const chars = JSON.parse(JSON.stringify(state.characters));
      const player = chars.find(c => c.id === 'vrax');
      const filledCount = player.queue.filter(Boolean).length;
      if (filledCount >= player.total_action_slots) return state;
      const nullIdx = player.queue.findIndex(s => !s);
      const slotIndex = nullIdx !== -1 ? nullIdx : player.queue.length;
      const card = action.card;
      // Legal if resources available at execution time (slots before this one) cover the cost
      for (const [resourceType, amount] of Object.entries(card.cost ?? {})) {
        if (!player.resources?.[resourceType]) return state;
        const effective = effectiveResourceAtExecution(resourceType, slotIndex, player.queue, player.resources);
        if (effective < amount) return state;
      }
      const lastTarget = chars.find(c => c.id === state.lastTargetId && c.health > 0);
      const target = lastTarget ?? chars.find(c => !c.is_player && c.health > 0);
      player.queue[slotIndex] = {
        ...card,
        owner_id: 'vrax',
        owner_name: player.name,
        target_id: target.id,
        payload_type: card.tag_type.includes('MAGIC') ? 'MAGIC' : 'PHYSICAL',
        calc_speed: calcSpeed(card.speed, slotIndex),
        priority_flag: null,
      };
      return { ...state, characters: chars, lastTargetId: target.id };
    }

    case 'CLEAR_SLOT': {
      const chars = JSON.parse(JSON.stringify(state.characters));
      const player = chars.find(c => c.id === 'vrax');
      player.queue[action.index] = null;
      // Cascade: remove any cards that are now illegal after this removal
      let changed = true;
      while (changed) {
        changed = false;
        for (let i = 0; i < player.queue.length; i++) {
          const slot = player.queue[i];
          if (!slot) continue;
          const illegal = Object.entries(slot.cost ?? {}).some(([resourceType, amount]) => {
            const effective = effectiveResourceAtExecution(resourceType, i, player.queue, player.resources, i);
            return effective < amount;
          });
          if (illegal) { player.queue[i] = null; changed = true; }
        }
      }
      return { ...state, characters: chars };
    }

    case 'START_BATTLE': {
      const chars = JSON.parse(JSON.stringify(state.characters));
      const battlePlayer = chars.find(c => c.id === 'vrax');
      battlePlayer.queue = battlePlayer.queue.filter(Boolean);
      chars.filter(c => !c.is_player && c.health > 0).forEach(e => { e.queue = buildEnemyQueue(e); });
      return {
        ...state,
        characters: chars,
        phase: 'BATTLE',
        logs: [...state.logs, { msg: `━━━ TURN ${state.turn} BEGIN ━━━`, type: 'info' }],
      };
    }

    case 'BATTLE_STEP': {
      const sorted = SpeedCheckAllAvailableActions(state.characters);

      // All queues empty — run cleanup
      if (sorted.length === 0) {
        const { newState: cleanedState, logs: cleanLogs } = TurnResultCleanup({ ...state });
        const player = cleanedState.characters.find(c => c.id === 'vrax');
        const allEnemiesDead = cleanedState.characters.filter(c => !c.is_player).every(e => e.health <= 0);

        if (player.health <= 0) {
          return {
            ...cleanedState,
            phase: 'RESULT',
            result: 'LOSS',
            logs: [...state.logs, ...cleanLogs, { msg: '💀 VRAX HAS FALLEN.', type: 'dmg' }],
          };
        }
        if (allEnemiesDead) {
          return {
            ...cleanedState,
            phase: 'RESULT',
            result: 'WIN',
            logs: [...state.logs, ...cleanLogs, { msg: '🏆 VICTORY! ALL ENEMIES DEFEATED!', type: 'heal' }],
          };
        }

        // Reset for next turn
        const nextChars = cleanedState.characters.map(c => ({ ...c, queue: [] }));
        return {
          ...cleanedState,
          characters: nextChars,
          phase: 'QUEUE_SETUP',
          turn: state.turn + 1,
          logs: [...state.logs, ...cleanLogs, { msg: `━━━ TURN ${state.turn} END ━━━`, type: 'info' }],
        };
      }

      const actionA = sorted[0];
      const actionB = sorted[1] || null;
      const { resultA, resultB, log: interactionLog } = InteractionCheck(actionA, actionB);

      let newState = { ...state };
      const newLogs = [];

      if (interactionLog) newLogs.push(interactionLog);

      // Execute actionA
      const { newState: afterExec, logs: execLogs, actualTargetId } = ExecuteAction(actionA, resultA, newState);
      newState = afterExec;
      newLogs.push(...execLogs);

      // Cleanup actionA
      newState = ActionCleanup(actionA, newState);

      // If actionB was nullified, clean it up too
      if (resultB === 'NULLIFY' && actionB) {
        newState = ActionCleanup(actionB, newState);
        newLogs.push({ msg: `💨 "${actionB.name}" was nullified`, type: 'clash' });
      }

      // Purge queued actions from newly dead enemies (keep GHOST-tagged actions)
      newState = {
        ...newState,
        characters: newState.characters.map(c => {
          if (c.is_player || c.health > 0) return c;
          const remaining = c.queue.filter(a => a?.properties?.includes('GHOST'));
          return { ...c, queue: remaining };
        }),
      };

      // Check if enemy was hit for shake animation — use actual (possibly retargeted) target
      const targetChar = actualTargetId ? state.characters.find(c => c.id === actualTargetId) : null;
      const enemyWasHit = targetChar && !targetChar.is_player && resultA !== 'NULLIFY';

      return {
        ...newState,
        phase: 'BATTLE',
        stepCount: state.stepCount + 1,
        logs: [...state.logs, ...newLogs],
        shakingEnemyId: enemyWasHit ? actualTargetId : null,
      };
    }

    case 'SELECT_TARGET':
      return { ...state, lastTargetId: action.targetId };

    case 'RETARGET_SLOT': {
      const chars = JSON.parse(JSON.stringify(state.characters));
      const player = chars.find(c => c.id === 'vrax');
      const slot = player.queue[action.index];
      if (!slot) return state;
      player.queue[action.index] = { ...slot, target_id: action.targetId };
      return { ...state, characters: chars, lastTargetId: action.targetId };
    }

    case 'STOP_SHAKE':
      return { ...state, shakingEnemyId: null };

    case 'RESET':
      return buildInitialState(CURRENT_ENCOUNTER);

    default:
      return state;
  }
}

// ── APP ──
export default function App() {
  const [gs, dispatch] = useReducer(battleReducer, undefined, buildInitialState);
  const [logOpen, setLogOpen] = useState(false);
  const [retargetingSlot, setRetargetingSlot] = useState(null);
  const [lineCoords, setLineCoords] = useState(null);
  const battleTimerRef = useRef(null);

  const player = gs.characters.find(c => c.id === 'vrax');
  const enemies = gs.characters.filter(c => !c.is_player);
  const { ResourceBar } = CLASS_REGISTRY[player.class_id] ?? {};

  // Drive battle loop with timed steps
  useEffect(() => {
    if (gs.phase !== 'BATTLE') return;
    battleTimerRef.current = setTimeout(() => {
      dispatch({ type: 'BATTLE_STEP' });
    }, 700);
    return () => clearTimeout(battleTimerRef.current);
  }, [gs.phase, gs.stepCount]);

  // Stop shake animation
  useEffect(() => {
    if (!gs.shakingEnemyId) return;
    const t = setTimeout(() => dispatch({ type: 'STOP_SHAKE' }), 350);
    return () => clearTimeout(t);
  }, [gs.shakingEnemyId]);

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
      dispatch({ type: 'RESET' });
      return;
    }
    if (gs.phase !== 'QUEUE_SETUP') return;
    if (!player.queue.some(Boolean)) return;
    dispatch({ type: 'START_BATTLE' });
  }

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden bg-[#0f0f1a]" onClick={() => setRetargetingSlot(null)}>

      {/* Retarget line overlay */}
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

      {/* TOP — Enemy Zone */}
      <EnemyZone
        enemies={enemies}
        shakingEnemyId={gs.shakingEnemyId}
        selectedTargetId={gs.lastTargetId}
        phase={gs.phase}
        retargetingSlot={retargetingSlot}
        onSelectTarget={handleEnemyClick}
      />

      {/* MIDDLE — Battle Queue Row */}
      <BattleQueue
        characters={gs.characters}
        phase={gs.phase}
        onToggleLog={() => setLogOpen(o => !o)}
        logOpen={logOpen}
      />

      {/* BOTTOM — Player Zone */}
      <div className="h-[67%] flex flex-col overflow-hidden">

        {/* Center row: Buff Column | Character Column | Slot Column */}
        <div className="flex-1 flex items-end justify-center overflow-hidden pb-4">

          {/* LEFT — Buff column (fixed width, right-aligned so buffs hug the gap) */}
          <div style={{ width: '340px', paddingRight: '60px', display: 'flex', justifyContent: 'flex-end' }}>
            <TagPool tags={player.active_tag_pool} />
          </div>

          {/* CENTER — Character column */}
          <VraxPortrait player={player} />

          {/* RIGHT — Slot column (fixed width, left-aligned so slots hug the gap) */}
          <div style={{ width: '340px', paddingLeft: '60px', display: 'flex', justifyContent: 'flex-start' }}>
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

      {/* FLOATING — Battle Log modal */}
      <BattleLog
        logs={gs.logs}
        turn={gs.turn}
        isOpen={logOpen}
        onClose={() => setLogOpen(false)}
      />
    </div>
  );
}
