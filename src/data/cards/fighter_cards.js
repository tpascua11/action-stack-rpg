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
];
