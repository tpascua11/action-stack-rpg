// ============================================================
//  SAMURAI CLASS
// ============================================================

import { FIGHTER_CARDS } from '../cards/fighter_cards';
import SamuraiResourceBar from '../../components/resources/SamuraiResourceBar';

export const SAMURAI = {
  id: 'samurai',
  name: 'Samurai',
  icon: '⚔️',
  base_health: 350,
  total_action_slots: 3,
  resource: { type: 'BATTLE_SPIRIT', max: 10, starting: 0 },
  permanent_tags: [],
  combat_start_tags: [],
  cards: FIGHTER_CARDS,
  ResourceBar: SamuraiResourceBar,
  extra_fields: { battleSpirit: 0 },
};
