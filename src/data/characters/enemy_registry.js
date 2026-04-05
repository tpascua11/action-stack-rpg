// ============================================================
//  Enemy Registry — maps enemy ID strings to enemy definitions
//  Used to resolve scenario JSON (which stores IDs) into
//  full enemy objects at runtime.
//
//  To add a new enemy:
//    1. Define it in enemies.js (or its own file)
//    2. Import it here and add it to ENEMY_REGISTRY
// ============================================================

import { EMBER_WITCH, FLAME_WITCH, FLAME_QUEEN } from './enemies';

export const ENEMY_REGISTRY = {
  ember_witch: EMBER_WITCH,
  flame_witch: FLAME_WITCH,
  flame_queen: FLAME_QUEEN,
};
