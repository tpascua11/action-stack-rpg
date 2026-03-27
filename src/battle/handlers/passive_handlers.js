// ============================================================
//  PASSIVE HANDLERS
//  Permanent tags — never consumed, class-specific passives.
// ============================================================

import { registerTag } from '../registry/battle_registry';

export function UndyingSpiritHandler(payload, character, tag) {
  const totalDamage = payload.damages.reduce((sum, d) => sum + d.power, 0);
  if (totalDamage >= character.max_health * 0.10) {
    const res = character.resources?.BATTLE_SPIRIT;
    if (res) res.current = Math.min(res.current + 1, res.max);
  }
  return { consumed: false };
}

registerTag('UNDYING_SPIRIT', {
  phases: ['ON_RECEIVE'],
  handlers: { ON_RECEIVE: UndyingSpiritHandler },
});
