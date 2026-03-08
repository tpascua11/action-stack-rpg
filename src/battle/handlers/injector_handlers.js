// ============================================================
//  INJECTOR HANDLERS
//  Phase: INJECT
//  Scale how hard the attack hits — conditionally
//  Only consumed if condition passes
// ============================================================

export function MagicChargeHandler(payload, character, tag) {
  if (payload.type !== 'MAGIC') return { payload, consumed: false };
  if (payload.tag_types?.includes('CHARGING')) return { payload, consumed: false };
  const boost = tag.multiplier * tag.stack_count;
  payload.damages.forEach(d => {
    d.power = Math.floor(d.power * (1 + boost));
  });
  return { payload, consumed: true };
}

export function MagicChargeOnApply(pool, tag) {
  const existing = pool.find(t => t.tag_name === 'MAGIC_CHARGE');
  if (existing) {
    existing.stack_count += 1;
  } else {
    pool.push({ ...tag, stack_count: 1 });
  }
}

export function FireChargeHandler(payload, character, tag) {
  const hasFireDamage = payload.damages.some(d => d.element === 'FIRE');
  if (!hasFireDamage) return { payload, consumed: false };
  payload.damages.forEach(d => {
    if (d.element === 'FIRE') d.power = Math.floor(d.power * (1 + tag.multiplier));
  });
  return { payload, consumed: true };
}

export function MomentumHandler(payload, character, tag) {
  if (payload.type !== 'PHYSICAL') return { payload, consumed: false };
  const boost = tag.multiplier * tag.stack_count;
  payload.damages.forEach(d => {
    d.power = Math.floor(d.power * (1 + boost));
  });
  return { payload, consumed: false }; // State — not consumed, resets END_OF_TURN
}

export function MomentumOnApply(pool, tag) {
  const existing = pool.find(t => t.tag_name === 'MOMENTUM');
  if (existing) {
    existing.stack_count += 1;
  } else {
    pool.push({ ...tag, stack_count: 1, reset: 'END_OF_TURN' });
  }
}
