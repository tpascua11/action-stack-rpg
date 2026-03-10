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
    id: 'flame_strike',
    name: 'Flame Strike',
    speed: 100,
    tag_type: ['WIZARD_PREP', 'SPELL', 'MAGIC'],
    cost: { WIZARD_MANA: 100 },
    icon: '🔥',
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
