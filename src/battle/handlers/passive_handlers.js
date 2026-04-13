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

function UnderTheSunHandler(context, tag) {
  const owner = context.owner;
  const res = owner.resources?.BATTLE_SPIRIT;
  if (res) res.current = Math.min(res.current + 1, res.max);
  return {
    consumed: false,
    logs: [{ msg: `☀️ ${owner.name} regains 1 Battle Spirit`, type: 'resource' }],
  };
}

registerTag('UNDER_THE_SUN', {
  phases: ['END_OF_TURN'],
  handlers: { END_OF_TURN: UnderTheSunHandler },
});

// ── ONE_UNDER_THE_SUN — enemy sumurai passive ──
// Increments the flat `resource` field on the character by 1 each end of turn.

function OneUnderTheSunHandler(context, tag) {
  const owner = context.owner;
  const res = owner.resources?.BATTLE_SPIRIT;
  if (res) res.current = Math.min(res.current + 1, res.max);
  return {
    consumed: false,
    logs: [{ msg: `☀️ ${owner.name} gains 1 Battle Spirit (${res?.current ?? 0} / ${res?.max ?? 0})`, type: 'resource' }],
  };
}

registerTag('ONE_UNDER_THE_SUN', {
  phases: ['END_OF_TURN'],
  handlers: { END_OF_TURN: OneUnderTheSunHandler },
});
