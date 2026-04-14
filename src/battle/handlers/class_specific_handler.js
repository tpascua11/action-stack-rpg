// ============================================================
//  CLASS-SPECIFIC HANDLERS
//  Buff/stance tags tied to specific class mechanics.
// ============================================================

import { registerTag } from '../registry/battle_registry';

// ── STILL WIND ──
// Applied by the Still Wind card.
// PRE_ACTION: grants 1 Battle Spirit each time the owner acts.
// ON_RECEIVE: consumed (removed) when the owner takes damage.

function StillWindPreActionHandler(action, owner, tag) {
  const res = owner.resources?.BATTLE_SPIRIT;
  if (res) {
    res.current = Math.min(res.current + 1, res.max);
  }
  return {
    cancelled: false,
    consumed: false,
    logs: [{ msg: `🌬️ ${owner.name} gains 1 Battle Spirit from Still Wind`, type: 'resource' }],
  };
}

function StillWindOnReceiveHandler(payload, character, tag, hit_result) {
  if (hit_result === 'HIT') {
    return { consumed: true };
  }
  return { consumed: false };
}

registerTag('STILL_WIND', {
  phases: ['PRE_ACTION', 'ON_RECEIVE'],
  status_type: 'buff',
  handlers: {
    PRE_ACTION: StillWindPreActionHandler,
    ON_RECEIVE: StillWindOnReceiveHandler,
  },
});
