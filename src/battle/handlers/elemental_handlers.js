// ============================================================
//  ELEMENTAL HANDLERS
//  Elemental status effects go here (e.g. FREEZE, BURN, etc.)
// ============================================================

import { registerTag } from '../registry/battle_registry';

// ── FREEZE ──
// Slows the host by -5 speed per stack. Max 10 stacks (-50 speed total).
// Decays by 1 stack at end of turn.

function FreezeOnApply(pool, tag) {
  const existing = pool.find(t => t.tag_name === 'FREEZE');
  if (existing) {
    existing.stacks = Math.min(10, existing.stacks + (tag.stacks ?? 1));
  } else {
    pool.push({ ...tag, stacks: Math.min(10, tag.stacks ?? 1) });
  }
}

function FreezeSpeedCalcHandler(action, character, tag) {
  action.calc_speed -= tag.stacks * 5;
}

function FreezeEndOfTurnHandler(context, tag) {
  tag.stacks -= 1;
  if (tag.stacks <= 0) {
    return {
      consumed: true,
      logs: [{ msg: `🧊 ${context.owner.name}: FREEZE wore off`, type: 'info' }],
    };
  }
  return {
    consumed: false,
    logs: [{ msg: `🧊 ${context.owner.name}: FREEZE ${tag.stacks} stack(s) remaining`, type: 'info' }],
  };
}

registerTag('FREEZE', {
  phases: ['SPEED_CALC', 'END_OF_TURN'],
  status_type: 'debuff',
  onApply: FreezeOnApply,
  handlers: {
    SPEED_CALC: FreezeSpeedCalcHandler,
    END_OF_TURN: FreezeEndOfTurnHandler,
  },
});
