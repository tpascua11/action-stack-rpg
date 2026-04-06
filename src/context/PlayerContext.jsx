// ============================================================
//  PlayerContext — persistent player data across fights + sessions
//  Backed by localStorage under the key 'daq_player'.
//
//  WHAT WE STORE (minimal — IDs and deltas only, never full objects):
//    name            → string, player-chosen character name
//    class_id        → string, e.g. 'samurai'
//    current_hp      → number, persisted between fights
//    card_unlocks    → array of card IDs unlocked beyond the class base deck
//    stat_boosts     → array of { stat, amount } deltas applied on top of class base stats
//    completed_zones → array of zone IDs cleared on the map
//
//  WHAT WE DERIVE AT RUNTIME (never stored):
//    portrait        → CLASS_REGISTRY[class_id].portrait
//    base cards      → CLASS_REGISTRY[class_id].cards
//    full deck       → base cards + card_unlocks resolved via CARD_REGISTRY
//    max_health      → class base_health + sum of stat_boosts
//    icon, resources, permanent_tags, etc. → all from CLASS_REGISTRY
//
//  WHY: image keys are plain strings — localStorage-safe. Storing only IDs means
//  we always resolve fresh asset URLs from the registry at runtime.
// ============================================================

import { createContext, useContext, useReducer, useEffect } from 'react';
import { CLASS_REGISTRY } from '../data/classes/class_registry';
import { CARD_REGISTRY } from '../data/cards/card_registry';

const STORAGE_KEY = 'daq_player';

const PlayerContext = createContext(null);

// ── Load / Save ──────────────────────────────────────────────

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveToStorage(playerData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(playerData));
  } catch {
    // storage full or unavailable — fail silently
  }
}

// ── Helpers ──────────────────────────────────────────────────

// Derives the full runtime player snapshot from stored minimal data.
// Call this whenever you need the full picture (e.g. GO_TO_BATTLE).
export function derivePlayerSnapshot(playerData) {
  const classDef = CLASS_REGISTRY[playerData.class_id];
  if (!classDef) return null;

  // Apply stat boosts on top of class base stats
  const maxHealth = (playerData.stat_boosts ?? [])
    .filter(b => b.stat === 'max_health')
    .reduce((total, b) => total + b.amount, classDef.base_health);

  const totalActionSlots = (playerData.stat_boosts ?? [])
    .filter(b => b.stat === 'total_action_slots')
    .reduce((total, b) => total + b.amount, classDef.total_action_slots);

  const unlockedCards = (playerData.card_unlocks ?? [])
    .map(id => CARD_REGISTRY[id])
    .filter(Boolean);
  const cards = [...classDef.cards, ...unlockedCards];

  const currentHealth = playerData.current_hp ?? maxHealth;

  return {
    id: 'vrax',
    name: playerData.name ?? 'VRAX',
    portrait:           classDef.portrait ?? null,
    icon:               classDef.icon,
    faction:            'player',
    class_id:           classDef.id,
    health:             currentHealth,
    max_health:         maxHealth,
    resources: Object.fromEntries(
      classDef.resources.map(r => [r.type, { current: r.starting, max: r.max }])
    ),
    total_action_slots: totalActionSlots,
    active_tag_pool:    [...classDef.permanent_tags],
    combat_start_tags:  [...classDef.combat_start_tags],
    permanent_tags:     [...classDef.permanent_tags],
    cards,
    queue: [],
  };
}

// ── Reducer ──────────────────────────────────────────────────

function playerReducer(state, action) {
  switch (action.type) {

    // Runs ONCE when the player picks their class at game start.
    // Only stores the minimal data needed — everything else is derived at runtime.
    case 'CONFIRM_CLASS': {
      const classDef = CLASS_REGISTRY[action.classId];
      if (!classDef) return state;
      return {
        name:            action.name ?? 'VRAX',
        class_id:        action.classId,
        current_hp:      classDef.base_health,
        card_unlocks:    [],
        stat_boosts:     [],
        completed_zones: [],
      };
    }

    // Called by MapScreen after a battle ends — updates HP and records result
    case 'APPLY_BATTLE_RESULT': {
      return { ...state, current_hp: action.currentHP };
    }

    // Add an unlocked card ID to the player's deck (post-battle reward, etc.)
    case 'UNLOCK_CARD':
      return { ...state, card_unlocks: [...state.card_unlocks, action.cardId] };

    // Apply a stat upgrade delta — stacks, never replaces
    case 'UPGRADE_STAT':
      return { ...state, stat_boosts: [...state.stat_boosts, { stat: action.stat, amount: action.amount }] };

    // TODO: called by MapScreen to record zone/level completion
    case 'SAVE_MAP_PROGRESS':
      return { ...state, completed_zones: [...(state.completed_zones ?? []), action.zoneId] };

    // Wipe everything — called on true new game
    case 'NEW_GAME':
      return null;

    default:
      return state;
  }
}

// ── Provider ─────────────────────────────────────────────────

export function PlayerProvider({ children }) {
  const [playerData, playerDispatch] = useReducer(playerReducer, undefined, loadFromStorage);

  // Sync to localStorage whenever playerData changes
  useEffect(() => {
    if (playerData) {
      saveToStorage(playerData);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [playerData]);

  return (
    <PlayerContext.Provider value={{ playerData, playerDispatch }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  return useContext(PlayerContext);
}
