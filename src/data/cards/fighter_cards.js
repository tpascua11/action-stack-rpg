// ============================================================
//  FIGHTER CARDS
//  Pure data. No logic.
// ============================================================

export const FIGHTER_CARDS = [
  {
    id: 'heavy_slice',
    name: 'Heavy Slice',
    speed: 90,
    tag_type: ['PHYSICAL', 'SLASH'],
    cost: {},
    icon: '⚔️',
    image: require('../../asssets/FOX_SUMMURAI/fox_summurai_4.png'),
    color: '#e94560',
    desc: 'A powerful slash attack.',
    tags: {
      self: [
        { tag_name: 'MOMENTUM', multiplier: 0.2 },
      ],
      target: [
        { tag_name: 'DAMAGE', type: 'PHYSICAL', power: 50 },
      ],
    },
  },
  {
    id: 'quick_slice',
    name: 'Quick Slice',
    speed: 110,
    tag_type: ['PHYSICAL', 'SLASH'],
    cost: {},
    icon: '🔪',
    image: require('../../asssets/FOX_SUMMURAI/fox_summurai_21.png'),
    color: '#ff6b35',
    desc: 'A fast light slash.',
    tags: {
      self: [],
      target: [
        { tag_name: 'DAMAGE', type: 'PHYSICAL', power: 25 },
      ],
    },
  },
  {
    id: 'mend',
    name: 'Mend',
    speed: 50,
    tag_type: ['MAGIC'],
    cost: {},
    icon: '💖',
    image: require('../../asssets/FOX_SUMMURAI/fox_summurai_40.png'),
    color: '#4caf50',
    desc: 'Restore 100 HP.',
    tags: {
      self: [
        { tag_name: 'HEAL', power: 100 },
      ],
      target: [],
    },
  },
  {
    id: 'magic_charge',
    name: 'Magic Charge',
    speed: 100,
    tag_type: ['WIZARD_PREP', 'SPELL', 'MAGIC', 'CHARGING'],
    cost: {},
    icon: '✨',
    image: require('../../asssets/FOX_SUMMURAI/fox_summurai_3.png'),
    color: '#7c3aed',
    desc: 'Charge next MAGIC attack by 20%. Restore 25 mana.',
    tags: {
      self: [
        { tag_name: 'MAGIC_CHARGE', multiplier: 0.2, consume: true },
        { tag_name: 'RESTORE_MANA', power: 25 },
      ],
      target: [],
    },
  },
  {
    id: 'fuel_to_the_flames',
    name: 'Fuel to the Flames',
    speed: 100,
    tag_type: ['WIZARD_PREP', 'SPELL', 'MAGIC', 'CHARGING'],
    cost: {},
    icon: '🔥',
    image: require('../../asssets/FOX_SUMMURAI/fox_summurai_41.png'),
    color: '#f97316',
    desc: 'Add +50 flat damage to next FIRE attack.',
    tags: {
      self: [
        { tag_name: 'FUEL_TO_THE_FLAMES', flat: 50 },
      ],
      target: [],
    },
  },
  {
    id: 'speed_up',
    name: 'Speed Up',
    speed: 200,
    tag_type: ['PHYSICAL'],
    cost: {},
    icon: '💨',
    image: require('../../asssets/FOX_SUMMURAI/fox_summurai_9.png'),
    color: '#38bdf8',
    desc: 'Boost the speed of your next action by 50.',
    tags: {
      self: [
        { tag_name: 'SPEED_BOOST', amount: 150 },
      ],
      target: [],
    },
  },
  {
    id: 'flame_strike',
    name: 'Flame Strike',
    speed: 100,
    tag_type: ['WIZARD_PREP', 'SPELL', 'MAGIC'],
    cost: { WIZARD_MANA: 100 },
    icon: '🔥',
    image: require('../../asssets/FOX_SUMMURAI/fox_summurai_1.png'),
    color: '#ef4444',
    desc: 'Strike target with fire for 150 damage.',
    tags: {
      self: [],
      target: [
        { tag_name: 'DAMAGE', type: 'FIRE', power: 150 },
      ],
    },
  },
];
