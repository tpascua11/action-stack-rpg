// ============================================================
//  initialState — builds the starting game state and enemy queues
// ============================================================

import { EMBER_WITCH, FLAME_WITCH, FLAME_QUEEN } from '../data/characters/enemies';
import { SAMURAI } from '../data/classes/samurai';
import { CLASS_REGISTRY } from '../data/classes/class_registry';
import { buildPlayer } from '../data/player';
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

  let vrax;
  if (playerData) {
    // Player already built and persisted — reconstruct battle instance from their data
    vrax = {
      id: 'vrax',
      name: playerData.name,
      portrait: playerData.portrait ?? null,
      icon: CLASS_REGISTRY[playerData.class_id]?.icon ?? '⚔️',
      faction: 'player',
      class_id: playerData.class_id,
      health: playerData.max_health,
      max_health: playerData.max_health,
      resources: Object.fromEntries(
        (CLASS_REGISTRY[playerData.class_id]?.resources ?? []).map(r => [r.type, { current: r.starting, max: r.max }])
      ),
      total_action_slots: playerData.total_action_slots,
      active_tag_pool: [...playerData.permanent_tags],
      combat_start_tags: [...(CLASS_REGISTRY[playerData.class_id]?.combat_start_tags ?? [])],
      permanent_tags: [...playerData.permanent_tags],
      cards: playerData.cards,
      queue: [],
    };
  } else {
    // Fallback: no player data yet (debug mode or pre-class-select)
    vrax = buildPlayer(SAMURAI, { id: 'vrax', name: 'VRAX', portrait: null });
  }

  const characters = [vrax, ...builtEnemies];
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
