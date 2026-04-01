// ============================================================
//  BATTLE ENGINE
//  Pure functions — take state in, return new state out.
//  No direct mutation. Safe for React useReducer pattern.
// ============================================================

import { battle_registry } from '../registry/battle_registry';
import '../handlers'; // triggers all self-registering tag handlers


// ── HELPERS ──

export function calcSpeed(base_speed, slot_index) {
  return base_speed - slot_index * 20;
}

// Returns the resource level available when the card at `mySlotIndex` executes.
// Player cards always execute in slot order, so only slots before mySlotIndex count.
// Pass skipIndex to exclude a specific slot (e.g. during cascade validation).
export function effectiveResourceAtExecution(resourceType, mySlotIndex, queue, resources, skipIndex = -1) {
  let effect = resources?.[resourceType]?.current ?? 0;
  for (let i = 0; i < mySlotIndex; i++) {
    if (i === skipIndex) continue;
    const slot = queue[i];
    if (!slot) continue;
    effect -= slot.cost?.[resourceType] ?? 0;
    for (const tag of slot.tags?.self ?? []) {
      const entry = battle_registry[tag.tag_name];
      const delta = entry?.resource_delta?.(tag);
      if (delta?.type === resourceType) effect += delta.amount ?? 0;
    }
  }
  return effect;
}

export function addTagToPool(pool, tag) {
  const entry = battle_registry[tag.tag_name];
  const tagWithMeta = {
    tier: 'condition',
    ...(entry?.status_type ? { status_type: entry.status_type } : {}),
    ...tag,
  };
  if (entry?.onApply) {
    const newPool = [...pool];
    entry.onApply(newPool, tagWithMeta);
    return newPool;
  }
  return [...pool, { ...tagWithMeta }];
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// ── SPEED CHECK ──

export function SpeedCheckAllAvailableActions(characters) {
  let actions = [];

  for (const character of characters) {
    if (character.health <= 0) continue;
    if (!character.queue || character.queue.length === 0) continue;
    const action = deepClone(character.queue[0]);
    if (!action) continue;
    if (action.priority_flag === 'SKIP') continue;

    // Apply SPEED_CALC tags
    for (const tag of character.active_tag_pool) {
      const entry = battle_registry[tag.tag_name];
      if (entry?.phases?.includes('SPEED_CALC')) {
        entry.handlers['SPEED_CALC'](action, character, tag);
      }
    }
    actions.push({ ...action, owner_id: character.id, owner_name: character.name });
  }

  const next_actions = actions.filter(a => a.priority_flag === 'NEXT');
  const normal_actions = actions.filter(a => a.priority_flag !== 'NEXT');
  normal_actions.sort((a, b) => b.calc_speed - a.calc_speed);

  return [...next_actions, ...normal_actions];
}

// ── INTERACTION CHECK ──

export function InteractionCheck(actionA, actionB) {
  if (!actionA || !actionB) {
    return { resultA: 'EXECUTE', resultB: 'UNAFFECTED', log: null };
  }

  const opposing = actionA.owner_id !== actionB.owner_id;
  const speedDiff = Math.abs(actionA.calc_speed - actionB.calc_speed);

  // CLASH
  const aHasClash = actionA.tag_type?.includes('CLASH');
  const bHasClash = actionB.tag_type?.includes('CLASH');
  if (opposing && aHasClash && bHasClash && speedDiff <= 2) {
    return {
      resultA: 'NULLIFY',
      resultB: 'NULLIFY',
      log: { msg: `⚡ CLASH! "${actionA.name}" vs "${actionB.name}" — both cancelled!`, type: 'clash' },
    };
  }

  // INTERRUPT
  const aHasInterrupt = actionA.properties?.includes('INTERRUPT');
  if (opposing && aHasInterrupt && actionA.calc_speed > actionB.calc_speed) {
    return {
      resultA: 'EXECUTE',
      resultB: 'SKIP',
      log: { msg: `⚡ INTERRUPT! "${actionA.name}" suppresses "${actionB.name}"`, type: 'clash' },
    };
  }

  return { resultA: 'EXECUTE', resultB: 'UNAFFECTED', log: null };
}

// ── PHASE RUNNERS ──

function runPhaseImbue(tag_pool, payload) {
  const remaining = [];
  for (const tag of tag_pool) {
    const entry = battle_registry[tag.tag_name];
    if (entry?.phases?.includes('IMBUE')) {
      const result = entry.handlers['IMBUE'](payload, null, tag);
      payload = result.payload;
      if (!result.consumed) remaining.push(tag);
    } else {
      remaining.push(tag);
    }
  }
  return { tag_pool: remaining, payload };
}

function runPhaseInjectMult(tag_pool, payload, character) {
  const remaining = [];
  for (const tag of tag_pool) {
    const entry = battle_registry[tag.tag_name];
    if (entry?.phases?.includes('INJECT_MULT')) {
      const result = entry.handlers['INJECT_MULT'](payload, character, tag);
      payload = result.payload;
      if (!result.consumed) remaining.push(tag);
    } else {
      remaining.push(tag);
    }
  }
  return { tag_pool: remaining, payload };
}

function runPhaseInjectFlat(tag_pool, payload, character) {
  const remaining = [];
  for (const tag of tag_pool) {
    const entry = battle_registry[tag.tag_name];
    if (entry?.phases?.includes('INJECT_FLAT')) {
      const result = entry.handlers['INJECT_FLAT'](payload, character, tag);
      payload = result.payload;
      if (!result.consumed) remaining.push(tag);
    } else {
      remaining.push(tag);
    }
  }
  return { tag_pool: remaining, payload };
}

function runPhaseOnReceive(tag_pool, payload, character, hit_result) {
  const remaining = [];
  for (const tag of tag_pool) {
    const entry = battle_registry[tag.tag_name];
    if (entry?.phases?.includes('ON_RECEIVE')) {
      const result = entry.handlers['ON_RECEIVE'](payload, character, tag, hit_result);
      if (!result.consumed) remaining.push(tag);
    } else {
      remaining.push(tag);
    }
  }
  return remaining;
}

function runPhasePostAttack(tag_pool, payload, character, hit_result) {
  for (const tag of tag_pool) {
    const entry = battle_registry[tag.tag_name];
    if (entry?.phases?.includes('POST_ATTACK')) {
      entry.handlers['POST_ATTACK'](payload, character, tag, hit_result);
    }
  }
  return tag_pool;
}

function runPhasePreAction(tag_pool, action, owner) {
  const logs = [];
  const remaining = [];

  for (let i = 0; i < tag_pool.length; i++) {
    const tag = tag_pool[i];
    const entry = battle_registry[tag.tag_name];
    if (entry?.phases?.includes('PRE_ACTION')) {
      const result = entry.handlers['PRE_ACTION'](action, owner, tag);
      logs.push(...(result.logs ?? []));
      if (result.cancelled) return { cancelled: true, logs, tag_pool: [...remaining, ...tag_pool.slice(i + 1)] };
      if (!result.consumed) remaining.push(tag);
    } else {
      remaining.push(tag);
    }
  }

  // Engine-level resource gate — not a tag, just a rule
  for (const [resourceType, amount] of Object.entries(action.cost ?? {})) {
    const res = owner.resources?.[resourceType];
    if (!res || res.current < amount) {
      logs.push({ msg: `💨 "${action.name}" fizzled — not enough ${resourceType}`, type: 'fizzle' });
      return { cancelled: true, logs, tag_pool: remaining };
    }
  }

  return { cancelled: false, logs, tag_pool: remaining };
}

// ── EXECUTE ACTION ──

export function ExecuteAction(action, interaction_result, state) {
  const logs = [];
  let newState = deepClone(state);

  if (interaction_result === 'NULLIFY') {
    logs.push({ msg: `💨 "${action.name}" was nullified`, type: 'clash' });
    return { newState, logs };
  }

  const owner = newState.characters.find(c => c.id === action.owner_id);
  const target = newState.characters.find(c => c.id === action.target_id);

  if (!owner || !target) return { newState, logs };
  if (owner.health <= 0) return { newState, logs };

  // PRE_ACTION phase — tag-based gates, then engine resource check
  const preAction = runPhasePreAction(owner.active_tag_pool, action, owner);
  logs.push(...preAction.logs);
  owner.active_tag_pool = preAction.tag_pool;
  if (preAction.cancelled) return { newState, logs, fizzled: true };

  // Deduct resource costs at execution time
  for (const [resourceType, amount] of Object.entries(action.cost ?? {})) {
    owner.resources[resourceType].current -= amount;
  }

  // Retarget if original target is already dead
  const resolvedTarget = target.health > 0
    ? target
    : newState.characters.find(c => c.id !== action.owner_id && c.health > 0) ?? null;
  const retargeted = resolvedTarget && resolvedTarget.id !== target.id;

  // ── BUILD ──
  let payload = {
    type: action.payload_type,
    tag_types: [...(action.tag_type || [])],
    damages: [],
    properties: [...(action.properties || [])],
    status_effects: [],
  };

  // ── IMBUE ──
  const imbueResult = runPhaseImbue(owner.active_tag_pool, payload);
  owner.active_tag_pool = imbueResult.tag_pool;
  payload = imbueResult.payload;

  // ── BUILD DAMAGES from card target tags ──
  for (const tag of (action.tags?.target || [])) {
    const entry = battle_registry[tag.tag_name];
    if (entry?.phases?.includes('DELIVERY')) {
      const result = entry.handlers['DELIVERY'](payload, owner, tag);
      payload = result.payload;
    }
  }

  // ── INJECT_MULT ──
  const injectMultResult = runPhaseInjectMult(owner.active_tag_pool, payload, owner);
  owner.active_tag_pool = injectMultResult.tag_pool;
  payload = injectMultResult.payload;

  // ── INJECT_FLAT ──
  const injectFlatResult = runPhaseInjectFlat(owner.active_tag_pool, payload, owner);
  owner.active_tag_pool = injectFlatResult.tag_pool;
  payload = injectFlatResult.payload;

  // ── DELIVERY ──
  if (retargeted) logs.push({ msg: `🔀 ${action.name} retargeted to ${resolvedTarget.name}`, type: 'info' });
  let total_damage = 0;
  if (resolvedTarget) {
    for (const dmg of payload.damages) {
      resolvedTarget.health = Math.max(0, resolvedTarget.health - dmg.power);
      total_damage += dmg.power;
      logs.push({ msg: `⚔️ ${owner.name} uses ${action.name} → ${resolvedTarget.name} takes ${dmg.power} ${dmg.element} dmg`, type: 'dmg' });
    }
  } else {
    logs.push({ msg: `💨 ${owner.name} uses ${action.name} — no targets remaining`, type: 'info' });
  }

  // ── SELF TAGS ──
  for (const tag of (action.tags?.self || [])) {
    const entry = battle_registry[tag.tag_name];
    if (entry?.phases?.includes('DELIVERY')) {
      const result = entry.handlers['DELIVERY'](payload, owner, tag);
      payload = result.payload || payload;
      if (tag.tag_name === 'HEAL') {
        logs.push({ msg: `💖 ${owner.name} heals for ${tag.power} HP`, type: 'heal' });
      }
    } else {
      owner.active_tag_pool = addTagToPool(owner.active_tag_pool, tag);
      logs.push({ msg: `✨ ${owner.name} gains ${tag.tag_name}`, type: 'buff' });
    }
  }

  const hit_result = total_damage > 0 ? 'HIT' : 'MISS';

  // ── APPLY STATUS TARGET TAGS ──
  if (resolvedTarget) {
    for (const tag of (action.tags?.target || [])) {
      const entry = battle_registry[tag.tag_name];
      if (!entry?.phases?.includes('DELIVERY')) {
        resolvedTarget.active_tag_pool = addTagToPool(resolvedTarget.active_tag_pool, tag);
        logs.push({ msg: `🔻 ${resolvedTarget.name} gains ${tag.tag_name}`, type: 'debuff' });
      }
    }
  }

  // ── ON_RECEIVE ──
  if (resolvedTarget) {
    resolvedTarget.active_tag_pool = runPhaseOnReceive(resolvedTarget.active_tag_pool, payload, resolvedTarget, hit_result);
  }

  // ── POST_ATTACK ──
  owner.active_tag_pool = runPhasePostAttack(owner.active_tag_pool, payload, owner, hit_result);

  return { newState, logs, actualTargetId: resolvedTarget?.id ?? null };
}

// ── ACTION CLEANUP ──

export function ActionCleanup(action, state) {
  const newState = deepClone(state);
  const owner = newState.characters.find(c => c.id === action.owner_id);
  if (!owner) return newState;
  owner.queue = owner.queue.slice(1);
  // Clear priority flags on remaining queue
  if (owner.queue[0]) owner.queue[0].priority_flag = null;
  return newState;
}

// ── ON_TURN_START / END_OF_TURN PHASE RUNNERS ──

export function runPhaseOnTurnStart(characters, field) {
  const newCharacters = deepClone(characters);
  const logs = [];

  for (const character of newCharacters) {
    if (character.health <= 0) continue;
    const remaining = [];
    for (const tag of character.active_tag_pool) {
      const entry = battle_registry[tag.tag_name];
      if (entry?.phases?.includes('ON_TURN_START')) {
        const context = { owner: character, field, state: { characters: newCharacters } };
        const result = entry.handlers['ON_TURN_START'](context, tag);
        logs.push(...(result.logs ?? []));
        if (!result.consumed) remaining.push(tag);
      } else {
        remaining.push(tag);
      }
    }
    character.active_tag_pool = remaining;
  }

  return { newCharacters, logs };
}

export function runPhaseEndOfTurn(characters, field) {
  const newCharacters = deepClone(characters);
  const logs = [];

  for (const character of newCharacters) {
    if (character.health <= 0) continue;
    const remaining = [];
    for (const tag of character.active_tag_pool) {
      const entry = battle_registry[tag.tag_name];
      if (entry?.phases?.includes('END_OF_TURN')) {
        const context = { owner: character, field, state: { characters: newCharacters } };
        const result = entry.handlers['END_OF_TURN'](context, tag);
        logs.push(...(result.logs ?? []));
        if (!result.consumed) remaining.push(tag);
      } else {
        remaining.push(tag);
      }
    }
    character.active_tag_pool = remaining;
  }

  return { newCharacters, logs };
}

// ── TURN RESULT CLEANUP ──

export function TurnResultCleanup(state, field = null) {
  let newState = deepClone(state);
  const logs = [];

  // END_OF_TURN tag phase — runs before expiry sweep
  const endOfTurnResult = runPhaseEndOfTurn(newState.characters, field);
  newState.characters = endOfTurnResult.newCharacters;
  logs.push(...endOfTurnResult.logs);

  for (const character of newState.characters) {
    character.active_tag_pool = character.active_tag_pool.filter(tag => {
      if (tag.reset === 'END_OF_TURN') {
        logs.push({ msg: `🔄 ${character.name}: ${tag.tag_name} expired`, type: 'info' });
        return false;
      }
      if (tag.reset === 'TICK_TURN') {
        tag.duration -= 1;
        if (tag.duration <= 0) {
          logs.push({ msg: `🔄 ${character.name}: ${tag.tag_name} expired`, type: 'info' });
          return false;
        }
        logs.push({ msg: `🔄 ${character.name}: ${tag.tag_name} — ${tag.duration} turn(s) remaining`, type: 'info' });
        return true;
      }
      return true;
    });
  }

  return { newState, logs };
}
