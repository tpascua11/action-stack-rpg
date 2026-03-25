import { useReducer, useEffect, useRef, useState } from 'react';
import { VRAX } from './data/characters/vrax';
import { EMBER_WITCH } from './data/characters/enemies';
import { FIGHTER_CARDS } from './data/cards/fighter_cards';
import {
  calcSpeed,
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

// ── BUILD INITIAL STATE ──
function buildInitialState() {
  const witch1 = { ...JSON.parse(JSON.stringify(EMBER_WITCH)), id: 'ember_witch_1' };
  const witch2 = { ...JSON.parse(JSON.stringify(EMBER_WITCH)), id: 'ember_witch_2' };
  const vrax = JSON.parse(JSON.stringify(VRAX));
  return {
    phase: 'QUEUE_SETUP',  // QUEUE_SETUP | BATTLE | RESULT
    turn: 1,
    result: null,          // WIN | LOSS
    characters: [vrax, witch1, witch2],
    logs: [{ msg: '⚔️  System Ready. Queue your actions and execute.', type: 'info' }],
    shakingEnemyId: null,
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
    calc_speed: calcSpeed(act.speed, i, enemy.total_action_slots),
    priority_flag: null,
  }));
}

// ── REDUCER ──
function battleReducer(state, action) {
  switch (action.type) {

    case 'ADD_TO_QUEUE': {
      const chars = JSON.parse(JSON.stringify(state.characters));
      const player = chars.find(c => c.id === 'vrax');
      const slotIndex = player.queue.length;
      if (slotIndex >= player.total_action_slots) return state;
      const card = action.card;
      const firstEnemy = chars.find(c => !c.is_player && c.health > 0);
      player.queue.push({
        ...card,
        owner_id: 'vrax',
        owner_name: 'VRAX',
        target_id: firstEnemy.id,
        payload_type: card.tag_type.includes('MAGIC') ? 'MAGIC' : 'PHYSICAL',
        calc_speed: calcSpeed(card.speed, slotIndex, player.total_action_slots),
        priority_flag: null,
      });
      return { ...state, characters: chars };
    }

    case 'CLEAR_SLOT': {
      const chars = JSON.parse(JSON.stringify(state.characters));
      const player = chars.find(c => c.id === 'vrax');
      player.queue.splice(action.index, 1);
      // Recalculate speeds after removal
      player.queue = player.queue.map((a, i) => ({
        ...a,
        calc_speed: calcSpeed(a.speed, i, player.total_action_slots),
      }));
      return { ...state, characters: chars };
    }

    case 'START_BATTLE': {
      const chars = JSON.parse(JSON.stringify(state.characters));
      chars.filter(c => !c.is_player).forEach(e => { e.queue = buildEnemyQueue(e); });
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

      // Check if enemy was hit for shake animation — use actual (possibly retargeted) target
      const targetChar = actualTargetId ? state.characters.find(c => c.id === actualTargetId) : null;
      const enemyWasHit = targetChar && !targetChar.is_player && resultA !== 'NULLIFY';

      return {
        ...newState,
        phase: 'BATTLE',
        logs: [...state.logs, ...newLogs],
        shakingEnemyId: enemyWasHit ? actualTargetId : null,
      };
    }

    case 'STOP_SHAKE':
      return { ...state, shakingEnemyId: null };

    case 'RESET':
      return buildInitialState();

    default:
      return state;
  }
}

// ── APP ──
export default function App() {
  const [gs, dispatch] = useReducer(battleReducer, null, buildInitialState);
  const [logOpen, setLogOpen] = useState(false);
  const battleTimerRef = useRef(null);

  const player = gs.characters.find(c => c.id === 'vrax');
  const enemies = gs.characters.filter(c => !c.is_player);

  // Drive battle loop with timed steps
  useEffect(() => {
    if (gs.phase !== 'BATTLE') return;
    battleTimerRef.current = setTimeout(() => {
      dispatch({ type: 'BATTLE_STEP' });
    }, 700);
    return () => clearTimeout(battleTimerRef.current);
  }, [gs.phase, gs.logs.length]);

  // Stop shake animation
  useEffect(() => {
    if (!gs.shakingEnemyId) return;
    const t = setTimeout(() => dispatch({ type: 'STOP_SHAKE' }), 350);
    return () => clearTimeout(t);
  }, [gs.shakingEnemyId]);

  function handleCardClick(card) {
    if (gs.phase !== 'QUEUE_SETUP') return;
    if (player.queue.length >= player.total_action_slots) return;
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
    <div className="w-screen h-screen flex flex-col overflow-hidden bg-[#0f0f1a]">

      {/* TOP — Enemy Zone */}
      <EnemyZone enemies={enemies} shakingEnemyId={gs.shakingEnemyId} />

      {/* MIDDLE — Battle Queue Row */}
      <BattleQueue
        characters={gs.characters}
        phase={gs.phase}
        onToggleLog={() => setLogOpen(o => !o)}
        logOpen={logOpen}
      />

      {/* BOTTOM — Player Zone */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Center row: Buff Column | Character Column | Slot Column */}
        <div className="flex items-center justify-center py-4 flex-shrink-0">

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
              onClearSlot={handleClearSlot}
              onExecute={handleExecute}
              isBattling={gs.phase === 'BATTLE'}
              isResult={gs.phase === 'RESULT'}
            />
          </div>

        </div>

        {/* BOTTOM — Hand */}
        <Hand
          cards={FIGHTER_CARDS}
          queue={player.queue}
          totalSlots={player.total_action_slots}
          onCardClick={handleCardClick}
          disabled={gs.phase !== 'QUEUE_SETUP'}
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
