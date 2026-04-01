// ============================================================
//  UI REGISTRY
//  Maps tag_name → { icon, color, statusIcon, describe(tag) }
//  describe(tag) returns a human-readable string for display.
//  This registry is UI-only — battle logic never touches it.
// ============================================================

import { STATUS_NATURE_1 as NATURE_1, STATUS_FROST_1 as FROST_1, STATUS_FIRE_1 as FIRE_1 } from '../../asssets';

export const ui_registry = {

  MAGIC_CHARGE: {
    icon: '✨',
    color: '#7c3aed',
    describe: (tag) => {
      const pct = Math.round(tag.multiplier * tag.stack_count * 100);
      return `+${pct}% next MAGIC hit`;
    },
  },

  MOMENTUM: {
    icon: '💨',
    color: '#ff6b35',
    describe: (tag) => {
      const pct = Math.round(tag.multiplier * tag.stack_count * 100);
      return `+${pct}% PHYSICAL damage`;
    },
  },

  FIRE_CHARGE: {
    icon: '🔥',
    color: '#ef4444',
    describe: (tag) => {
      const pct = Math.round(tag.multiplier * 100);
      return `+${pct}% next FIRE hit`;
    },
  },

  FUEL_TO_THE_FLAMES: {
    icon: '🌋',
    color: '#f97316',
    describe: (tag) => `+${tag.flat} flat FIRE damage`,
  },

  SPEED_BOOST: {
    icon: '⚡',
    color: '#eab308',
    describe: (tag) => {
      const base = `+${tag.amount} speed`;
      if (tag.mode === 'turns') return `${base} (${tag.duration}T)`;
      if (tag.actions_remaining > 1) return `${base} (${tag.actions_remaining} actions)`;
      return base;
    },
  },

  COMBO_STACK: {
    icon: '⚔️',
    color: '#6b7280',
    describe: (tag) => {
      const n = tag.stack_count || 0;
      return `${n} hit${n !== 1 ? 's' : ''} combo`;
    },
  },

  FORWARD_INITIATIVE: {
    icon: '🎯',
    color: '#22c55e',
    describe: (tag) => {
      const n = tag.stack_count || 0;
      return `+${n} action slot${n !== 1 ? 's' : ''}`;
    },
  },

  FIRE_IMBUE: {
    icon: '🔥',
    color: '#dc2626',
    describe: () => 'Next hit becomes FIRE',
  },

  ICE_IMBUE: {
    icon: '❄️',
    color: '#38bdf8',
    describe: () => 'Next hit becomes ICE',
  },

  REGEN: {
    icon: '💚',
    statusIcon: NATURE_1,
    color: '#22c55e',
    describe: (tag) => `+${tag.power} HP/turn`,
  },

  FREEZE: {
    icon: '🧊',
    statusIcon: FROST_1,
    color: '#38bdf8',
    describe: (tag) => {
      const s = tag.stacks ?? 1;
      return `-${s * 5} speed (${s} stack${s !== 1 ? 's' : ''}, max 10)`;
    },
  },

  BURN: {
    icon: '🔥',
    statusIcon: FIRE_1,
    color: '#f97316',
    describe: (tag) => `-${tag.power} HP/turn`,
  },

};

export const UI_DEFAULT = { icon: '🔮', color: '#4da6ff', describe: () => 'active' };
