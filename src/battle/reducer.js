// ============================================================
//  battleReducer — all battle state transitions
// ============================================================

import { DEBUG_HAND_COST } from '../debug';
import {
  calcSpeed,
  effectiveResourceAtExecution,
  SpeedCheckAllAvailableActions,
  InteractionCheck,
  ExecuteAction,
  ActionCleanup,
  TurnResultCleanup,
  runPhaseOnTurnStart,
} from './engine/battle_engine';
import { buildEnemyQueue, buildInitialState, CURRENT_ENCOUNTER } from './initialState';

export function battleReducer(state, action) {
  switch (action.type) {

    case 'ADD_TO_QUEUE': {
      const chars = JSON.parse(JSON.stringify(state.characters));
      const player = chars.find(c => c.faction === 'player');
      const filledCount = player.queue.filter(Boolean).length;
      if (filledCount >= player.total_action_slots) return state;
      const nullIdx = player.queue.findIndex(s => !s);
      const slotIndex = nullIdx !== -1 ? nullIdx : player.queue.length;
      const card = action.card;
      if (!DEBUG_HAND_COST) {
        for (const [resourceType, amount] of Object.entries(card.cost ?? {})) {
          if (!player.resources?.[resourceType]) return state;
          const effective = effectiveResourceAtExecution(resourceType, slotIndex, player.queue, player.resources);
          if (effective < amount) return state;
        }
      }
      const lastTarget = chars.find(c => c.id === state.lastTargetId && c.health > 0);
      const target = lastTarget ?? chars.find(c => c.faction === 'enemy' && c.health > 0);
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
      const player = chars.find(c => c.faction === 'player');
      player.queue[action.index] = null;
      if (!DEBUG_HAND_COST) {
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
      }
      return { ...state, characters: chars };
    }

    case 'START_BATTLE': {
      const chars = JSON.parse(JSON.stringify(state.characters));
      const battlePlayer = chars.find(c => c.faction === 'player');
      battlePlayer.queue = battlePlayer.queue.filter(Boolean);
      chars.filter(c => c.faction === 'enemy' && c.health > 0).forEach(e => { e.queue = buildEnemyQueue(e); });
      const { newCharacters: startChars, logs: startLogs } = runPhaseOnTurnStart(chars, null);
      const turnStartLogs = [...state.logs, { msg: `━━━ TURN ${state.turn} BEGIN ━━━`, type: 'info' }, ...startLogs];
      const playerAfterStart = startChars.find(c => c.faction === 'player');
      const allEnemiesDeadAfterStart = startChars.filter(c => c.faction === 'enemy').every(e => e.health <= 0);
      if (playerAfterStart.health <= 0) {
        return { ...state, characters: startChars, phase: 'RESULT', result: 'LOSS', logs: [...turnStartLogs, { msg: '💀 VRAX HAS FALLEN.', type: 'dmg' }] };
      }
      if (allEnemiesDeadAfterStart) {
        return { ...state, characters: startChars, phase: 'RESULT', result: 'WIN', logs: [...turnStartLogs, { msg: '🏆 VICTORY! ALL ENEMIES DEFEATED!', type: 'heal' }] };
      }
      return { ...state, characters: startChars, phase: 'BATTLE', logs: turnStartLogs };
    }

    case 'BATTLE_STEP': {
      const sorted = SpeedCheckAllAvailableActions(state.characters);

      if (sorted.length === 0) {
        const { newState: cleanedState, logs: cleanLogs } = TurnResultCleanup({ ...state });
        const player = cleanedState.characters.find(c => c.faction === 'player');
        const allEnemiesDead = cleanedState.characters.filter(c => c.faction === 'enemy').every(e => e.health <= 0);
        if (player.health <= 0) {
          return { ...cleanedState, phase: 'RESULT', result: 'LOSS', logs: [...state.logs, ...cleanLogs, { msg: '💀 VRAX HAS FALLEN.', type: 'dmg' }] };
        }
        if (allEnemiesDead) {
          return { ...cleanedState, phase: 'RESULT', result: 'WIN', logs: [...state.logs, ...cleanLogs, { msg: '🏆 VICTORY! ALL ENEMIES DEFEATED!', type: 'heal' }] };
        }
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

      const { newState: afterExec, logs: execLogs, actualTargetId, fizzled } = ExecuteAction(actionA, resultA, newState);
      newState = afterExec;
      newLogs.push(...execLogs);

      newState = ActionCleanup(actionA, newState);

      if (resultB === 'NULLIFY' && actionB) {
        newState = ActionCleanup(actionB, newState);
        newLogs.push({ msg: `💨 "${actionB.name}" was nullified`, type: 'clash' });
      }

      newState = {
        ...newState,
        characters: newState.characters.map(c => {
          if (c.faction === 'player' || c.health > 0) return c;
          const remaining = c.queue.filter(a => a?.properties?.includes('GHOST'));
          return { ...c, queue: remaining };
        }),
      };

      const targetChar = actualTargetId ? state.characters.find(c => c.id === actualTargetId) : null;
      const enemyWasHit = targetChar && targetChar.faction === 'enemy' && resultA !== 'NULLIFY';

      return {
        ...newState,
        phase: 'BATTLE',
        stepCount: state.stepCount + 1,
        logs: [...state.logs, ...newLogs],
        shakingEnemyId: enemyWasHit ? actualTargetId : null,
        fizzlingCard: fizzled ? actionA : null,
      };
    }

    case 'SELECT_TARGET':
      return { ...state, lastTargetId: action.targetId };

    case 'RETARGET_SLOT': {
      const chars = JSON.parse(JSON.stringify(state.characters));
      const player = chars.find(c => c.faction === 'player');
      const slot = player.queue[action.index];
      if (!slot) return state;
      player.queue[action.index] = { ...slot, target_id: action.targetId };
      return { ...state, characters: chars, lastTargetId: action.targetId };
    }

    // ── UI animation — temporary, moves to BattleScreen local state in task 5 ──
    case 'STOP_SHAKE':
      return { ...state, shakingEnemyId: null };

    case 'STOP_FIZZLE':
      return { ...state, fizzlingCard: null };

    case 'START_NEW_GAME':
      return { ...state, phase: 'CHARACTER_SELECT' };

    case 'GO_TO_BATTLE':
      return { ...state, phase: 'QUEUE_SETUP' };

    // !! IMPORTANT — RESET must NOT rebuild the player from scratch once progression exists.
    // Player data is persistent across fights: unlocked cards, max_health upgrades,
    // total_action_slots, permanent_tags, etc. must survive between battles.
    // Only battle-scoped fields should reset per fight:
    //   - queue            → clear
    //   - active_tag_pool  → restore to permanent_tags only (not combat_start_tags)
    //   - resources.current → back to starting value (not max)
    //   - health           → back to max_health
    // buildInitialState is a temporary placeholder — replace this with a proper
    // between-fight reset that preserves the player's persistent state.
    case 'RESET':
      return buildInitialState(CURRENT_ENCOUNTER);

    default:
      return state;
  }
}
