// ============================================================
//  TURN PHASE HANDLERS
//  Tags that fire during ON_TURN_START or END_OF_TURN phases.
// ============================================================

import { registerTag } from '../registry/battle_registry';

function RegenHandler(context, tag) {
  const owner = context.owner;
  const healed = Math.min(tag.power, (owner.max_health ?? owner.maxHp ?? owner.health) - owner.health);
  owner.health += healed;
  return {
    consumed: false,
    logs: [{ msg: `💚 ${owner.name} regenerates ${tag.power} HP`, type: 'heal' }],
  };
}

registerTag('REGEN', {
  phases: ['ON_TURN_START'],
  handlers: { ON_TURN_START: RegenHandler },
});

function BurnHandler(context, tag) {
  const owner = context.owner;
  owner.health = Math.max(0, owner.health - tag.power);
  return {
    consumed: false,
    logs: [{ msg: `🔥 ${owner.name} burns for ${tag.power} damage`, type: 'dmg' }],
  };
}

registerTag('BURN', {
  phases: ['ON_TURN_START'],
  handlers: { ON_TURN_START: BurnHandler },
});
