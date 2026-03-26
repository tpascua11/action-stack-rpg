// ============================================================
//  WIZARD CLASS
// ============================================================

import { FIGHTER_CARDS } from '../cards/fighter_cards';

// Placeholder — wizard will get its own card set later
const WIZARD_CARDS = FIGHTER_CARDS;

export const WIZARD = {
  id: 'wizard',
  name: 'Wizard',
  icon: '🧙',
  base_health: 250,
  total_action_slots: 3,
  resource: { type: 'MANA', max: 300, starting: 100 },
  // Always in pool — never removed
  permanent_tags: [],
  // Injected at battle start
  combat_start_tags: [
    { tag_name: 'MANA_REGEN', amount: 40 },
  ],
  cards: WIZARD_CARDS,
};
