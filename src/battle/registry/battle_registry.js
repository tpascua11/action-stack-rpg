// ============================================================
//  BATTLE REGISTRY
//  Maps tag_name → { phases, reset?, onApply?, handlers }
//
//  This file is a pure container — it has no imports.
//  Tags self-register by calling registerTag() in their handler file.
//  To add a new tag: create a handler file, call registerTag(), and
//  add one import line to src/battle/handlers/index.js.
// ============================================================

export const battle_registry = {};

export function registerTag(tag_name, entry) {
  battle_registry[tag_name] = entry;
}
