// ============================================================
//  ENEMIES
// ============================================================

export const EMBER_WITCH = {
  id: 'ember_witch',
  name: 'EMBER WITCH',
  icon: '🧙‍♀️',
  health: 180,
  max_health: 180,
  total_action_slots: 3,
  active_tag_pool: [],
  is_player: false,
  queue: [],
  base_actions: [
    {
      name: 'Ember Strike',
      speed: 90,
      payload_type: 'MAGIC',
      tag_type: ['MAGIC', 'FIRE'],
      properties: [],
      tags: {
        self: [],
        target: [{ tag_name: 'DAMAGE', type: 'FIRE', power: 40 }],
      },
    },
    {
      name: 'Minor Mend',
      speed: 50,
      payload_type: 'MAGIC',
      tag_type: ['MAGIC'],
      properties: [],
      tags: {
        self: [{ tag_name: 'HEAL', power: 30 }],
        target: [],
      },
    },
    {
      name: 'Weak Charge',
      speed: 100,
      payload_type: 'MAGIC',
      tag_type: ['MAGIC', 'CHARGING'],
      properties: [],
      tags: {
        self: [{ tag_name: 'MAGIC_CHARGE', multiplier: 0.1, consume: true }],
        target: [],
      },
    },
  ],
};
