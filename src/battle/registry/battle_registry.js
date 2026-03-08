// ============================================================
//  BATTLE REGISTRY
//  Maps tag_name → { phase, onApply?, handler }
//  This is the single source of truth for all battle tag logic.
//  To add a new tag: import its handler and register it here.
// ============================================================

import { FireImbueHandler, IceImbueHandler } from '../handlers/imbue_handlers';
import {
  MagicChargeHandler, MagicChargeOnApply,
  FireChargeHandler,
  MomentumHandler, MomentumOnApply,
} from '../handlers/injector_handlers';
import { DamageHandler, HealHandler, RestoreManaHandler } from '../handlers/delivery_handlers';
import { ComboStackHandler } from '../handlers/post_attack_handlers';
import { SpeedBoostHandler, SpeedBoostOnApply } from '../handlers/speed_handlers';

export const battle_registry = {

  // ── IMBUE ──
  FIRE_IMBUE: {
    phase: 'IMBUE',
    handler: FireImbueHandler,
  },
  ICE_IMBUE: {
    phase: 'IMBUE',
    handler: IceImbueHandler,
  },

  // ── INJECT ──
  MAGIC_CHARGE: {
    phase: 'INJECT',
    onApply: MagicChargeOnApply,
    handler: MagicChargeHandler,
  },
  FIRE_CHARGE: {
    phase: 'INJECT',
    handler: FireChargeHandler,
  },
  MOMENTUM: {
    phase: 'INJECT',
    reset: 'END_OF_TURN',
    onApply: MomentumOnApply,
    handler: MomentumHandler,
  },

  // ── DELIVERY ──
  DAMAGE: {
    phase: 'DELIVERY',
    handler: DamageHandler,
  },
  HEAL: {
    phase: 'DELIVERY',
    handler: HealHandler,
  },
  RESTORE_MANA: {
    phase: 'DELIVERY',
    handler: RestoreManaHandler,
  },

  // ── POST_ATTACK ──
  COMBO_STACK: {
    phase: 'POST_ATTACK',
    handler: ComboStackHandler,
  },

  // ── SPEED_CALC ──
  SPEED_BOOST: {
    phase: 'SPEED_CALC',
    reset: 'TICK_TURN',
    onApply: SpeedBoostOnApply,
    handler: SpeedBoostHandler,
  },
};
