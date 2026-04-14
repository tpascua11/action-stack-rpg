// ============================================================
//  Enemy Registry — resolves enemy_list.json into runtime objects
//  Portraits stored as asset key strings in JSON are resolved
//  to actual image imports here via the assets index.
//
//  To add a new enemy:
//    1. Add its definition to enemy_list.json
//    2. Make sure its portrait key exists in src/assets/index.js
// ============================================================

import ENEMY_LIST from './enemy_list.json';
import * as ASSETS from '../../assets';

function resolveActionIcons(actions) {
  if (!actions) return actions;
  return actions.map(a => ({
    ...a,
    image: a.icon ? (ASSETS[a.icon] ?? null) : null,
  }));
}

function resolveLibraryIcons(library) {
  if (!library) return library;
  return Object.fromEntries(
    Object.entries(library).map(([key, a]) => [
      key,
      { ...a, image: a.icon ? (ASSETS[a.icon] ?? null) : null },
    ])
  );
}

export const ENEMY_REGISTRY = Object.fromEntries(
  ENEMY_LIST.map(def => [
    def.id,
    {
      ...def,
      portrait:       ASSETS[def.portrait] ?? null,
      base_actions:   resolveActionIcons(def.base_actions),
      action_library: resolveLibraryIcons(def.action_library),
    },
  ])
);
