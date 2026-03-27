// ============================================================
//  DELIVERY HANDLERS
//  Phase: DELIVERY
//  Build damage entries and immediate effects
// ============================================================

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
