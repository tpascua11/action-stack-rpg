# Session Notes — Player / Class System

## What we discussed

### Problem
`vrax.js` was doing double duty as both the player instance and a hardcoded character.
No class system, no resource enforcement, no player customization.

### Design decisions made

**Class file (`src/data/classes/fighter.js`, `wizard.js`)**
- Defines the blueprint: base health, slots, resource type, cards
- Two tag lists:
  - `permanent_tags` — always in pool, never removed (e.g. RAGE_ON_HIT fires every POST_ATTACK)
  - `combat_start_tags` — injected at START_BATTLE (e.g. MANA_REGEN each turn opening)
- Both are just regular tags — the phase they declare controls when they fire

**Player builder (`src/data/player.js`)**
- `buildPlayer(classDef, { name, portrait })` — takes a class + player choices
- Player will be able to pick name, class, portrait
- Produces the runtime character object with `resource: { type, current, max }`

**Resource on the character object**
- `player.resource.current` / `player.resource.max`
- Only checked during QUEUE_SETUP when adding a card (can you afford it?)
- Engine reads/writes `current` via tag handlers (e.g. RAGE_ON_HIT adds to current)

**Classes planned**
- Fighter: RAGE (starts 0, generates on hit via RAGE_ON_HIT permanent tag)
- Wizard: MANA (starts 100, regenerates via MANA_REGEN combat-start tag)

## What is NOT done yet (next session)
- [ ] Wire `buildPlayer` into `App.jsx` (replace hardcoded VRAX)
- [ ] Add `RAGE_ON_HIT` and `MANA_REGEN` handlers to `battle_registry.js`
- [ ] Enforce card cost in `ADD_TO_QUEUE` reducer case
- [ ] Character select screen (name input, class pick, portrait pick)
- [ ] Move STONE_GOLEM out of `vrax.js` into `enemies.js` (it's in the wrong file)
- [ ] Wizard gets its own card set (currently borrows FIGHTER_CARDS as placeholder)
