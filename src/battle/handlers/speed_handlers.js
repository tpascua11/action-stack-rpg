// ============================================================
//  SPEED HANDLERS
//  Phase: SPEED_CALC
//  Applied during SpeedCheckAllAvailableActions
//  Modifies calc_speed on the action before sorting
// ============================================================

export function SpeedBoostHandler(action, character, tag) {
  action.calc_speed += tag.amount;
}

export function SpeedBoostOnApply(pool, tag) {
  const existing = pool.find(t => t.tag_name === 'SPEED_BOOST');
  if (existing) {
    existing.amount += tag.amount;
  } else {
    pool.push({ ...tag, reset: 'TICK_TURN' });
  }
}
