// ============================================================
//  SAMURAI CARDS
//  Pure data. No logic.
// ============================================================

import { FIGHTER_CARDS } from './fighter_cards';

export const SAMURAI_CARDS = [
  ...FIGHTER_CARDS,
  {
    id: 'focus_spirit',
    name: 'Focus Spirit',
    speed: 70,
    tag_type: ['SPIRITUAL'],
    cost: {},
    icon: '☀️',
    image: require('../../asssets/FOX_SUMMURAI/fox_summurai_18.png'),
    color: '#f59e0b',
    desc: 'Center yourself. Gain 1 Battle Spirit.',
    tags: {
      self: [
        { tag_name: 'GAIN_RESOURCE', resource_type: 'BATTLE_SPIRIT', power: 1 },
      ],
      target: [],
    },
  },
];
