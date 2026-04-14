// ============================================================
//  SAMURAI CLASS
// ============================================================

import { SAMURAI_CARDS } from '../cards/samurai_cards';
import SamuraiResourceBar from '../../components/resources/SamuraiResourceBar';

export const SAMURAI = {
  id: 'samurai',
  name: 'Samurai',
  icon: '⚔️',
  portrait: 'PORTRAIT_SUMURAI',
  base_health: 350,
  base_speed: 100,
  total_action_slots: 3,
  resources: [
    { type: 'BATTLE_SPIRIT', max: 10, starting: 0 },
  ],
  permanent_tags: [
    { tag_name: 'UNDER_THE_SUN', tier: 'permanent' },
  ],
  combat_start_tags: [],
  starting_cards: ['heavy_slice', 'quick_steps', 'still_wind', 'mend', 'speed_up', 'flame_strike', 'focus_spirit', 'battojutsu', 'freeze_slash'],
  cards: SAMURAI_CARDS,
  ResourceBar: SamuraiResourceBar,
};
