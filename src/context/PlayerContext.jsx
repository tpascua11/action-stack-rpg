// ============================================================
//  PlayerContext — persistent player data across fights + sessions
//  Backed by localStorage under the key 'daq_player'.
//
//  What lives here (persistent, survives page refresh + between fights):
//    class_id, name, max_health, total_action_slots, cards,
//    permanent_tags, map_progress
//
//  What does NOT live here:
//    Battle-scoped state (queue, active_tag_pool, resources.current,
//    health, logs) — those stay in GameContext and reset each fight.
// ============================================================

import { createContext, useContext, useReducer, useEffect } from 'react';
import { CLASS_REGISTRY } from '../data/classes/class_registry';
import { buildPlayer } from '../data/player';

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

// ── Reducer ──────────────────────────────────────────────────

function playerReducer(state, action) {
  switch (action.type) {

    // Runs ONCE when the player picks their class at game start.
    // Builds the full player from CLASS_REGISTRY and persists it.
    case 'CONFIRM_CLASS': {
      const classDef = CLASS_REGISTRY[action.classId];
      if (!classDef) return state;
      const built = buildPlayer(classDef, { id: 'vrax', name: 'VRAX', portrait: null });
      return {
        class_id:           built.class_id,
        name:               built.name,
        max_health:         built.max_health,
        total_action_slots: built.total_action_slots,
        cards:              built.cards,
        permanent_tags:     built.permanent_tags,
        map_progress:       {},
      };
    }

    // Future: add a card to the player's deck after a reward
    case 'UNLOCK_CARD':
      return { ...state, cards: [...state.cards, action.card] };

    // Future: upgrade a numeric stat (max_health, total_action_slots, etc.)
    case 'UPGRADE_STAT':
      return { ...state, [action.stat]: state[action.stat] + action.amount };

    // Future: record which map nodes have been visited / completed
    case 'SAVE_MAP_PROGRESS':
      return { ...state, map_progress: { ...state.map_progress, ...action.progress } };

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
