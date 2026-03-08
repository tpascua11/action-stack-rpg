// ============================================================
//  VRAX — Player Character
// ============================================================

export const VRAX = {
  id: 'vrax',
  name: 'VRAX',
  icon: '🦊',
  health: 300,
  max_health: 300,
  wizard_mana: 0,
  max_wizard_mana: 300,
  total_action_slots: 3,
  active_tag_pool: [],
  queue: [],
  is_player: true,
};

export const STONE_GOLEM = {
  id: 'golem',
  name: 'STONE GOLEM',
  icon: '🗿',
  health: 200,
  max_health: 200,
  total_action_slots: 2,
  active_tag_pool: [],
  is_player: false,
  queue: [],
  // Base actions the enemy cycles through
  base_actions: [
    {
      name: 'Smash',
      speed: 80,
      payload_type: 'PHYSICAL',
      tag_type: ['PHYSICAL'],
      properties: [],
      tags: {
        self: [],
        target: [{ tag_name: 'DAMAGE', type: 'PHYSICAL', power: 15 }],
      },
    },
    {
      name: 'Crush',
      speed: 70,
      payload_type: 'PHYSICAL',
      tag_type: ['PHYSICAL'],
      properties: [],
      tags: {
        self: [],
        target: [{ tag_name: 'DAMAGE', type: 'PHYSICAL', power: 20 }],
      },
    },
  ],
};
