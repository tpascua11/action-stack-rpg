// ============================================================
//  Animation Registry
//  Maps animation name → config used by BattleScreen.
//  Cards reference these by name via their `animation` field.
//
//  To add a new effect:
//    1. Add a @keyframes + .animate-* class to animations.css
//    2. Add an entry here
//    3. Set `animation: 'your_key'` on the card
// ============================================================

import { SFX_ATTACK_1, SFX_LASER_1 } from '../assets';

export const ANIMATIONS = {
  shake: {
    cssClass: 'animate-shake',
    duration: 350,
    sfx: SFX_ATTACK_1,
    volume: 0.6,
    floatingNumber: { color: '#ff4444' },
    // sprite: null,    // future: { sheet, frames, fps }
    // particles: null, // future: { preset: 'ice_burst' }
  },
  shake_magic: {
    cssClass: 'animate-shake',
    duration: 350,
    sfx: SFX_LASER_1,
    volume: 0.6,
    floatingNumber: { color: '#a78bfa' },
  },
  fizzle: {
    cssClass: 'animate-fizzle',
    duration: 600,
    sfx: null,
    floatingNumber: null,
  },
  wiggle: {
    cssClass: 'animate-wiggle',
    duration: 550,
    sfx: null,
    floatingNumber: null,
  },
  run_circle: {
    cssClass: 'animate-run_circle',
    duration: 700,
    battleDelay: 2000,
    sfx: null,
    floatingNumber: null,
  },
  heal: {
    cssClass: 'animate-heal',
    duration: 700,
    sfx: null,
    floatingNumber: null,
  },
  buff: {
    cssClass: 'animate-buff',
    duration: 650,
    sfx: null,
    floatingNumber: null,
  },
  burn: {
    cssClass: 'animate-burn',
    duration: 750,
    sfx: SFX_LASER_1,
    volume: 0.8,
    floatingNumber: { color: '#f97316' },
  },
  // ── Coming soon ──────────────────────────────────────────
  // freeze: { cssClass: 'animate-freeze', duration: 800, sfx: null },
  // slam:   { cssClass: 'animate-slam',   duration: 500, sfx: null },
};
