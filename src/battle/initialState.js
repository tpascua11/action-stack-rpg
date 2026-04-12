// ============================================================
//  initialState — builds the starting game state and enemy queues
// ============================================================

import { CLASS_REGISTRY } from '../data/classes/class_registry';
import EMBER_KEEP from '../data/scenarios/ember_keep.json';
import EMBER_WITCH_TEST from '../data/scenarios/ember_witch_test.json';
import { ENEMY_REGISTRY } from '../data/characters/enemy_registry';
import { buildPlayer } from '../data/player';
import { derivePlayerSnapshot } from '../context/PlayerContext';
import { calcSpeed } from './engine/battle_engine';

const MAX_ENEMIES = 5;

// ── BUILD ENEMY QUEUE ──
export function buildEnemyQueue(enemy) {
  return enemy.base_actions.map((act, i) => ({
    ...act,
    owner_id: enemy.id,
    owner_name: enemy.name,
    target_id: 'vrax',
    payload_type: act.payload_type || 'PHYSICAL',
    calc_speed: calcSpeed(enemy.base_speed + (act.speed_mod ?? 0), i),
    priority_flag: null,
  }));
}

// ── BUILD INITIAL STATE ──
// scenario: a scenario JSON from src/data/scenarios/ — defaults to EMBER_KEEP for debug.
// playerData: persistent player from PlayerContext — falls back to SAMURAI if null.
export function buildInitialState(scenario = EMBER_WITCH_TEST, playerData = null) {
  // Resolve enemy ID strings → full enemy objects via ENEMY_REGISTRY.
  // Pull from first stage only for now — multi-stage + bench handled later.
  const enemyIds = scenario?.stages?.[0]?.enemies ?? [];
  const builtEnemies = enemyIds.slice(0, MAX_ENEMIES)
    .map(id => ENEMY_REGISTRY[id])
    .filter(Boolean)
    .map((def, i) => ({
      ...JSON.parse(JSON.stringify(def)),
      id: `${def.id}_${i + 1}`,
    }));

  // Derive full runtime player from stored minimal data, or fall back to SAMURAI for debug
  const player = playerData
    ? derivePlayerSnapshot(playerData)
    : buildPlayer(CLASS_REGISTRY.samurai, { id: 'vrax', name: 'VRAX' });

  const characters = [player, ...builtEnemies];
  return {
    phase: new URLSearchParams(window.location.search).has('debug') ? 'QUEUE_SETUP' : 'TITLE',
    music: scenario?.music ?? null,
    battleBackground: scenario?.battle_background ?? null,
    turn: 1,
    result: null,          // WIN | LOSS
    characters,
    logs: [{ msg: '⚔️  System Ready. Queue your actions and execute.', type: 'info' }],
    stepCount: 0,
    pendingAnimation: [],
    activeEnemyId: null,
    lastTargetId: characters.find(c => c.faction === 'enemy' && c.health > 0)?.id ?? null,
  };
}
