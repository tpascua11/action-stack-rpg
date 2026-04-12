// ============================================================
//  SAMURAI CARDS
//  Pure data. No logic. Images stored as asset key strings —
//  resolved to imports via class_registry.js (localStorage-safe).
// ============================================================

export const SAMURAI_CARDS = [
  {
    id: 'heavy_slice',
    name: 'Heavy Slice',
    speed_mod: -10,
    tag_type: ['PHYSICAL', 'SLASH'],
    cost: {},
    icon: '⚔️',
    image: 'FOX_SUMMURAI_4',
    color: '#e94560',
    desc: 'A powerful slash attack.',
    tags: {
      self: [
        { tag_name: 'MOMENTUM', multiplier: 0.2, tier: 'advanced' },
      ],
      target: [
        { tag_name: 'DAMAGE', type: 'PHYSICAL', power: 50 },
      ],
    },
  },
  {
    id: 'quick_slice',
    name: 'Quick Slice',
    speed_mod: 10,
    tag_type: ['PHYSICAL', 'SLASH'],
    cost: {},
    icon: '🔪',
    image: 'FOX_SUMMURAI_21',
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
    speed_mod: -50,
    tag_type: ['MAGIC'],
    cost: { BATTLE_SPIRIT: 3 },
    icon: '💖',
    image: 'FOX_SUMMURAI_40',
    color: '#4caf50',
    desc: 'Restore 100 HP. Costs 3 Battle Spirit.',
    tags: {
      self: [
        { tag_name: 'HEAL', power: 100 },
        { tag_name: 'REGEN', power: 25, duration: 3, reset: 'TICK_TURN' },
        { tag_name: 'REGEN', power: 25, duration: 3, reset: 'TICK_TURN' },
        { tag_name: 'REGEN', power: 25, duration: 3, reset: 'TICK_TURN' },
        { tag_name: 'REGEN', power: 25, duration: 3, reset: 'TICK_TURN' },
        { tag_name: 'REGEN', power: 25, duration: 3, reset: 'TICK_TURN' },
        { tag_name: 'REGEN', power: 25, duration: 3, reset: 'TICK_TURN' },
      ],
      target: [],
    },
  },
  {
    id: 'magic_charge',
    name: 'Magic Charge',
    speed_mod: 0,
    tag_type: ['WIZARD_PREP', 'SPELL', 'MAGIC', 'CHARGING'],
    cost: {},
    icon: '✨',
    image: 'FOX_SUMMURAI_3',
    color: '#7c3aed',
    desc: 'Charge next MAGIC attack by 20%.',
    tags: {
      self: [
        { tag_name: 'MAGIC_CHARGE', multiplier: 0.2, consume: true, tier: 'advanced' },
      ],
      target: [],
    },
  },
  {
    id: 'fuel_to_the_flames',
    name: 'Fuel to the Flames',
    speed_mod: 0,
    tag_type: ['WIZARD_PREP', 'SPELL', 'MAGIC', 'CHARGING'],
    cost: {},
    icon: '🔥',
    image: 'FOX_SUMMURAI_41',
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
    speed_mod: 100,
    tag_type: ['PHYSICAL'],
    cost: {},
    icon: '💨',
    image: 'FOX_SUMMURAI_9',
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
    speed_mod: 0,
    tag_type: ['SPELL', 'MAGIC'],
    cost: { BATTLE_SPIRIT: 3 },
    icon: '🔥',
    image: 'FOX_SUMMURAI_1',
    color: '#ef4444',
    desc: 'Strike target with fire for 150 damage. Costs 3 Battle Spirit.',
    animation: 'burn',
    animation_intensity: 1.2,
    tags: {
      self: [],
      target: [
        { tag_name: 'DAMAGE', type: 'FIRE', power: 150 },
        { tag_name: 'BURN', power: 75, duration: 3, reset: 'TICK_TURN' },
      ],
    },
  },
  {
    id: 'freeze_slash',
    name: 'Freeze Slash',
    speed_mod: -10,
    tag_type: ['PHYSICAL', 'SLASH', 'FROST'],
    cost: {},
    icon: '❄️',
    image: 'FOX_SUMMURAI_20',
    color: '#38bdf8',
    desc: 'A chilling slash. Deal 50 Frost damage and apply 2 stacks of Freeze.',
    tags: {
      self: [],
      target: [
        { tag_name: 'DAMAGE', type: 'FROST', power: 50 },
        { tag_name: 'FREEZE', stacks: 5 },
      ],
    },
  },
  {
    id: 'battojutsu',
    name: 'Battojutsu',
    speed_mod: 0,
    tag_type: ['PHYSICAL', 'SLASH'],
    cost: {},
    icon: '🔦',
    image: 'FOX_SUMMURAI_BATTOJUTSU',
    color: '#c084fc',
    desc: 'Enter a focused draw stance. Your next attack deals 75% more damage.',
    tags: {
      self: [
        { tag_name: 'BATTOJUTSU', multiplier: 0.75, tier: 'advanced' },
      ],
      target: [],
    },
  },
  {
    id: 'focus_spirit',
    name: 'Focus Spirit',
    speed_mod: -30,
    tag_type: ['SPIRITUAL'],
    cost: {},
    icon: '☀️',
    image: 'FOX_SUMMURAI_18',
    color: '#f59e0b',
    desc: 'Center yourself. Gain 1 Battle Spirit.',
    tags: {
      self: [
        { tag_name: 'GAIN_RESOURCE', resource_type: 'BATTLE_SPIRIT', power: 3 },
      ],
      target: [],
    },
  },
];
