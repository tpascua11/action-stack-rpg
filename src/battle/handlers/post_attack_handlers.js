// ============================================================
//  POST ATTACK HANDLERS
//  Phase: POST_ATTACK
//  Fires after delivery. Receives hit_result.
//  Handler signature: (payload, character, tag, hit_result)
// ============================================================

import { registerTag } from '../registry/battle_registry';

export function ComboStackHandler(payload, character, tag, hit_result) {
  if (hit_result !== 'HIT') return { consumed: false };
  tag.stack_count = (tag.stack_count || 0) + 1;
  return { consumed: false };
}

registerTag('COMBO_STACK', {
  phases: ['POST_ATTACK'],
  handlers: { POST_ATTACK: ComboStackHandler },
});
