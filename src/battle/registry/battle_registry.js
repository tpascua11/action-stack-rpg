// ============================================================
//  BATTLE REGISTRY
//  Maps tag_name → { phases, reset?, onApply?, handlers }
//  phases   — array of pipeline phases this tag hooks into
//  handlers — map of phase → handler function
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
    phases: ['IMBUE'],
    handlers: {
      IMBUE: FireImbueHandler,
    },
  },
  ICE_IMBUE: {
    phases: ['IMBUE'],
    handlers: {
      IMBUE: IceImbueHandler,
    },
  },

  // ── INJECT ──
  MAGIC_CHARGE: {
    phases: ['INJECT'],
    onApply: MagicChargeOnApply,
    handlers: {
      INJECT: MagicChargeHandler,
    },
  },
  FIRE_CHARGE: {
    phases: ['INJECT'],
    handlers: {
      INJECT: FireChargeHandler,
    },
  },
  MOMENTUM: {
    phases: ['INJECT'],
    reset: 'END_OF_TURN',
    onApply: MomentumOnApply,
    handlers: {
      INJECT: MomentumHandler,
    },
  },

  // ── DELIVERY ──
  DAMAGE: {
    phases: ['DELIVERY'],
    handlers: {
      DELIVERY: DamageHandler,
    },
  },
  HEAL: {
    phases: ['DELIVERY'],
    handlers: {
      DELIVERY: HealHandler,
    },
  },
  RESTORE_MANA: {
    phases: ['DELIVERY'],
    handlers: {
      DELIVERY: RestoreManaHandler,
    },
  },

  // ── POST_ATTACK ──
  COMBO_STACK: {
    phases: ['POST_ATTACK'],
    handlers: {
      POST_ATTACK: ComboStackHandler,
    },
  },

  // ── SPEED_CALC ──
  SPEED_BOOST: {
    phases: ['SPEED_CALC'],
    reset: 'TICK_TURN',
    onApply: SpeedBoostOnApply,
    handlers: {
      SPEED_CALC: SpeedBoostHandler,
    },
  },
};
