// ============================================================
//  initialState — builds the starting game state and enemy queues
// ============================================================

import { EMBER_WITCH, FLAME_WITCH, FLAME_QUEEN } from '../data/characters/enemies';
import { SAMURAI } from '../data/classes/samurai';
import { buildPlayer } from '../data/player';
import { derivePlayerSnapshot } from '../context/PlayerContext';
import { calcSpeed } from './engine/battle_engine';

// ── CURRENT ENCOUNTER ──
const MAX_ENEMIES = 5;
export const CURRENT_ENCOUNTER = [EMBER_WITCH, EMBER_WITCH, FLAME_QUEEN, EMBER_WITCH, FLAME_WITCH];

// ── BUILD ENEMY QUEUE ──
export function buildEnemyQueue(enemy) {
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

// ── BUILD INITIAL STATE ──
// playerData: persistent player from PlayerContext (post class-select).
//   If null (debug / first load before class select), falls back to SAMURAI.
export function buildInitialState(enemies = CURRENT_ENCOUNTER, playerData = null) {
  const builtEnemies = enemies.slice(0, MAX_ENEMIES).map((def, i) => ({
    ...JSON.parse(JSON.stringify(def)),
    id: `${def.id}_${i + 1}`,
  }));

  // Derive full runtime player from stored minimal data, or fall back to SAMURAI for debug
  const player = playerData
    ? derivePlayerSnapshot(playerData)
    : buildPlayer(SAMURAI, { id: 'vrax', name: 'VRAX' });

  const characters = [player, ...builtEnemies];
  return {
    phase: new URLSearchParams(window.location.search).has('debug') ? 'QUEUE_SETUP' : 'TITLE',
    turn: 1,
    result: null,          // WIN | LOSS
    characters,
    logs: [{ msg: '⚔️  System Ready. Queue your actions and execute.', type: 'info' }],
    stepCount: 0,
    shakingEnemyId: null,
    lastTargetId: characters.find(c => c.faction === 'enemy' && c.health > 0)?.id ?? null,
  };
}
