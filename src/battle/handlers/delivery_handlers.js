// ============================================================
//  DELIVERY HANDLERS
//  Phase: DELIVERY
//  Build damage entries and immediate effects
// ============================================================

import { registerTag } from '../registry/battle_registry';

export function DamageHandler(payload, character, tag) {
  payload.damages.push({ element: tag.type, power: tag.power });
  return { payload, consumed: true };
}

export function HealHandler(payload, character, tag) {
  character.health = Math.min(character.health + tag.power, character.max_health);
  return { payload, consumed: true };
}

export function GainResourceHandler(payload, character, tag) {
  const res = character.resources?.[tag.resource_type];
  if (!res) return { payload, consumed: true };
  res.current = Math.min(res.current + tag.power, res.max);
  return { payload, consumed: true };
}

registerTag('DAMAGE', {
  phases: ['DELIVERY'],
  handlers: { DELIVERY: DamageHandler },
});

registerTag('HEAL', {
  phases: ['DELIVERY'],
  handlers: { DELIVERY: HealHandler },
});

registerTag('GAIN_RESOURCE', {
  resource_delta: (tag) => ({ type: tag.resource_type, amount: tag.power }),
  phases: ['DELIVERY'],
  handlers: { DELIVERY: GainResourceHandler },
});
