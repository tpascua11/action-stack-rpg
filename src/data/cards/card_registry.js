// ============================================================
//  CARD REGISTRY
//  Central lookup for all cards by ID, with images resolved.
//  Used by derivePlayerSnapshot to resolve card_unlocks from
//  stored ID strings into full card objects.
//
//  To add new cards:
//    1. Define them in their card file with image as a string key
//    2. Import and add the array to ALL_CARDS below
// ============================================================

import * as ASSETS from '../../assets';
import { FIGHTER_CARDS } from './fighter_cards';
import { SAMURAI_CARDS } from './samurai_cards';

const ALL_CARDS = [...FIGHTER_CARDS, ...SAMURAI_CARDS];

function resolveCard(card) {
  return { ...card, image: ASSETS[card.image] ?? null };
}

export const CARD_REGISTRY = Object.fromEntries(
  ALL_CARDS.map(c => [c.id, resolveCard(c)])
);
