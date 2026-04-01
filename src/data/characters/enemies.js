// ============================================================
//  ENEMIES
// ============================================================

import { ENEMY_APPRENTICE_WITCH, ENEMY_FLAME_WITCH, ENEMY_FLAME_QUEEN } from '../../asssets';

export const EMBER_WITCH = {
  id: 'ember_witch',
  name: 'EMBER WITCH',
  portrait: ENEMY_APPRENTICE_WITCH,
  card_size: 'small',
  health: 80,
  max_health: 80,
  total_action_slots: 1,
  active_tag_pool: [],
  faction: 'enemy',
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
        target: [{ tag_name: 'DAMAGE', type: 'FIRE', power: 8 }],
      },
    },
  ],
};

export const FLAME_WITCH = {
  id: 'flame_witch',
  name: 'FLAME WITCH',
  portrait: ENEMY_FLAME_WITCH,
  card_size: 'medium',
  health: 200,
  max_health: 200,
  total_action_slots: 2,
  active_tag_pool: [],
  faction: 'enemy',
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
        target: [{ tag_name: 'DAMAGE', type: 'FIRE', power: 18 }],
      },
    },
    {
      name: 'Magic Charge',
      speed: 100,
      payload_type: 'MAGIC',
      tag_type: ['MAGIC', 'CHARGING'],
      properties: [],
      tags: {
        self: [{ tag_name: 'MAGIC_CHARGE', multiplier: 0.15, consume: true, tier: 'advanced' }],
        target: [],
      },
    },
  ],
};

export const FLAME_QUEEN = {
  id: 'flame_queen',
  name: 'FLAME QUEEN',
  portrait: ENEMY_FLAME_QUEEN,
  card_size: 'large',
  health: 500,
  max_health: 500,
  total_action_slots: 3,
  active_tag_pool: [],
  faction: 'enemy',
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
        target: [
          { tag_name: 'DAMAGE', type: 'FIRE', power: 5 },
          { tag_name: 'BURN', power: 8 },
        ],
      },
    },
    {
      name: 'Magic Charge',
      speed: 100,
      payload_type: 'MAGIC',
      tag_type: ['MAGIC', 'CHARGING'],
      properties: [],
      tags: {
        self: [{ tag_name: 'MAGIC_CHARGE', multiplier: 0.2, consume: true, tier: 'advanced' }],
        target: [],
      },
    },
    {
      name: 'Flame Regen',
      speed: 60,
      payload_type: 'MAGIC',
      tag_type: ['MAGIC'],
      properties: [],
      tags: {
        self: [{ tag_name: 'HEAL', power: 50 }],
        target: [],
      },
    },
  ],
};
