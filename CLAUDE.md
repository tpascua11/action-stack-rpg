# daq-game

Turn-based battle card game built with React 18 + Tailwind CSS (Create React App).

## Commands

- `npm start` — start dev server (react-scripts)
- `npm run build` — production build

## Architecture

### Entry Points
- `src/index.js` → `src/App.jsx` (root component)
- `App.jsx` owns all state via `useReducer(battleReducer)`

### Game Phases
`QUEUE_SETUP` → `BATTLE` → `RESULT`

### Key Files
| File | Purpose |
|------|---------|
| `src/App.jsx` | Root component, reducer, battle loop (700ms setTimeout) |
| `src/battle/engine/battle_engine.js` | Core logic: speed calc, interaction check, execute, cleanup |
| `src/data/characters/vrax.js` | VRAX + STONE_GOLEM character definitions |
| `src/data/cards/fighter_cards.js` | FIGHTER_CARDS deck |
| `src/components/EnemyZone.jsx` | Enemy display + shake animation |
| `src/components/BattleLog.jsx` | Scrolling battle log |
| `src/components/TagPool.jsx` | Active tag pool display |
| `src/components/VraxPortrait.jsx` | Player portrait + stats |
| `src/components/ActionQueue.jsx` | Queue slots + execute button |
| `src/components/Hand.jsx` | Card hand |

### Battle Engine (`battle_engine.js`)
- `calcSpeed(speed, slotIndex, totalSlots)` — calculates action speed
- `addTagToPool(char, tag)` — adds tag to character's pool
- `SpeedCheckAllAvailableActions(characters)` — returns sorted action list
- `InteractionCheck(actionA, actionB)` — clash/nullify resolution
- `ExecuteAction(action, result, state)` — applies action effects
- `ActionCleanup(action, state)` — removes action from queue
- `TurnResultCleanup(state)` — end-of-turn effects

### Reducer Actions
- `ADD_TO_QUEUE` — add card to player queue
- `CLEAR_SLOT` — remove card from queue slot
- `START_BATTLE` — build enemy queue, begin battle
- `BATTLE_STEP` — advance one action in battle
- `STOP_SHAKE` — end enemy shake animation
- `RESET` — restart game

## Conventions
- Deep copy state before mutations: `JSON.parse(JSON.stringify(...))`
- Tags stored as arrays on characters (`active_tag_pool`)
- Actions have: `owner_id`, `target_id`, `payload_type`, `calc_speed`, `priority_flag`
- Payload types: `PHYSICAL` | `MAGIC`
- Characters: `vrax` (player), `golem` (enemy)
