// ============================================================
//  SPEED HANDLERS
//  Phase: SPEED_CALC
//  Applied during SpeedCheckAllAvailableActions
//  Modifies calc_speed on the action before sorting
// ============================================================

export function SpeedBoostHandler(action, character, tag) {
  action.calc_speed += tag.amount;
}

export function SpeedBoostImbueHandler(payload, character, tag) {
  // Turn-based — let TICK_TURN handle expiry
  if (tag.mode === 'turns') return { payload, consumed: false };

  // Action-based — decrement and consume when exhausted
  tag.actions_remaining -= 1;
  return { payload, consumed: tag.actions_remaining <= 0 };
}

export function SpeedBoostOnApply(pool, tag) {
  const existing = pool.find(t => t.tag_name === 'SPEED_BOOST');

  if (tag.turns) {
    // Turn-based mode
    if (existing && existing.mode === 'turns') {
      existing.duration = Math.max(existing.duration, tag.turns);
    } else {
      pool.push({ ...tag, mode: 'turns', duration: tag.turns, reset: 'TICK_TURN' });
    }
  } else {
    // Action-based mode (default: 1 action)
    const actions = tag.actions ?? 1;
    if (existing && existing.mode === 'actions') {
      existing.actions_remaining += actions;
    } else {
      pool.push({ ...tag, mode: 'actions', actions_remaining: actions });
    }
  }
}
