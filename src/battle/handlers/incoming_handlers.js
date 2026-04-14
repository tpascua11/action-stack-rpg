// ============================================================
//  INCOMING HANDLERS
//  Tags that fire on the *defender* when an action targets them.
//  Phase: ON_INCOMING
//  Handler signature: (incoming_action, defender, tag, state)
//  Return: { cancelled, consumed, logs }
// ============================================================

import { registerTag } from '../registry/battle_registry';

// ── QUICK_STEPS ──
// Stance buff applied when the player uses the Quick Steps card.
// Stores dodge_anchor (the calc_speed Quick Steps resolved at).
// Dodge window: dodge_anchor - 10  <=  incoming calc_speed  <=  dodge_anchor
// NOT consumed on a successful dodge — can block multiple actions within the window.
// Removed by: owner's next action resolving (ON_OWNER_ACTION) OR end of turn (END_OF_TURN).

function QuickStepsHandler(incoming_action, defender, tag) {
  const { dodge_anchor } = tag;
  const incoming_speed = incoming_action.calc_speed;

  const dodge_range = tag.dodge_range ?? 5;
  if (incoming_speed >= dodge_anchor - dodge_range && incoming_speed <= dodge_anchor) {
    return {
      cancelled: true,
      consumed: false, // stance persists until ActionCleanup or TurnResultCleanup removes it
      logs: [
        { msg: `💨 ${defender.name} sidesteps "${incoming_action.name}" with Quick Steps!`, type: 'buff' },
        // TODO: trigger dodge/sidestep animation on defender
        // TODO: trigger miss/whiff animation on attacker
      ],
    };
  }

  // Outside dodge window — action proceeds normally, tag stays active
  return { cancelled: false, consumed: false };
}

registerTag('QUICK_STEPS', {
  phases: ['ON_INCOMING'],
  status_type: 'buff',
  // Stamps the action's calc_speed onto the tag as dodge_anchor when the card resolves
  enrichFromAction: (tag, action) => ({ ...tag, dodge_anchor: action.calc_speed }),
  handlers: { ON_INCOMING: QuickStepsHandler },
});
