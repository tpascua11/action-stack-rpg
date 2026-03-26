// ============================================================
//  PLAYER BUILDER
//  Creates a runtime player instance from a class definition.
// ============================================================

export function buildPlayer(classDef, { name, portrait }) {
  return {
    id: 'player',
    name,
    portrait,
    icon: classDef.icon,
    is_player: true,
    class_id: classDef.id,
    health: classDef.base_health,
    max_health: classDef.base_health,
    resource: {
      type: classDef.resource.type,
      current: classDef.resource.starting,
      max: classDef.resource.max,
    },
    total_action_slots: classDef.total_action_slots,
    active_tag_pool: [...classDef.permanent_tags],
    queue: [],
    // Store these so START_BATTLE can inject them
    combat_start_tags: [...classDef.combat_start_tags],
    permanent_tags: [...classDef.permanent_tags],
    cards: classDef.cards,
  };
}
