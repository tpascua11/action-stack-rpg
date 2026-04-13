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

import { SFX_ATTACK_1, SFX_LASER_1, SFX_ICE, SFX_FLAMES } from '../assets';

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
  heavy_slice: {
    cssClass: 'animate-heavy_shake',
    duration: 500,
    sfx: [
      { src: SFX_ATTACK_1, delay: 0,   volume: 0.7 },
      { src: SFX_ATTACK_1, delay: 180, volume: 0.5 },
    ],
    floatingNumber: [
      { color: '#ff4444', delay: 0,   split: 0.5 },
      { color: '#ff4444', delay: 280, split: 0.5 },
    ],
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
  ice_slash: {
    cssClass: 'animate-ice_shake',
    duration: 500,
    sfx: [
      { src: SFX_ICE, delay: 0,   volume: 0.7 },
      { src: SFX_ICE, delay: 200, volume: 0.5 },
    ],
    floatingNumber: { color: '#7dd3fc' },
  },
  flame_strike: {
    cssClass: 'animate-burn',
    duration: 750,
    sfx: [
      { src: SFX_FLAMES, delay: 0, volume: 0.8 },
    ],
    floatingNumber: { color: '#f97316' },
  },
  // ── Coming soon ──────────────────────────────────────────
  // slam:   { cssClass: 'animate-slam',   duration: 500, sfx: null },
};
