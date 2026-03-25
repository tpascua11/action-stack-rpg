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
  FuelToTheFlamesHandler, FuelToTheFlamesOnApply,
  MomentumHandler, MomentumOnApply,
} from '../handlers/injector_handlers';
import { DamageHandler, HealHandler, RestoreManaHandler } from '../handlers/delivery_handlers';
import { ComboStackHandler } from '../handlers/post_attack_handlers';
import { SpeedBoostHandler, SpeedBoostImbueHandler, SpeedBoostOnApply } from '../handlers/speed_handlers';

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

  // ── INJECT_MULT ──
  MAGIC_CHARGE: {
    phases: ['INJECT_MULT'],
    onApply: MagicChargeOnApply,
    handlers: {
      INJECT_MULT: MagicChargeHandler,
    },
  },
  FIRE_CHARGE: {
    phases: ['INJECT_MULT'],
    handlers: {
      INJECT_MULT: FireChargeHandler,
    },
  },
  MOMENTUM: {
    phases: ['INJECT_MULT'],
    reset: 'END_OF_TURN',
    onApply: MomentumOnApply,
    handlers: {
      INJECT_MULT: MomentumHandler,
    },
  },

  // ── INJECT_FLAT ──
  FUEL_TO_THE_FLAMES: {
    phases: ['INJECT_FLAT'],
    onApply: FuelToTheFlamesOnApply,
    handlers: {
      INJECT_FLAT: FuelToTheFlamesHandler,
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
    phases: ['SPEED_CALC', 'IMBUE'],
    onApply: SpeedBoostOnApply,
    handlers: {
      SPEED_CALC: SpeedBoostHandler,
      IMBUE: SpeedBoostImbueHandler,
    },
  },
};
