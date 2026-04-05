// ============================================================
//  SAMURAI CLASS
// ============================================================

import { SAMURAI_CARDS } from '../cards/samurai_cards';
import SamuraiResourceBar from '../../components/resources/SamuraiResourceBar';
import { PORTRAIT_SUMURAI } from '../../assets';

export const SAMURAI = {
  id: 'samurai',
  name: 'Samurai',
  icon: '⚔️',
  portrait: PORTRAIT_SUMURAI,
  base_health: 350,
  total_action_slots: 3,
  resources: [
    { type: 'BATTLE_SPIRIT', max: 10, starting: 0 },
  ],
  permanent_tags: [
    { tag_name: 'UNDYING_SPIRIT', tier: 'permanent' },
  ],
  combat_start_tags: [],
  cards: SAMURAI_CARDS,
  ResourceBar: SamuraiResourceBar,
};
