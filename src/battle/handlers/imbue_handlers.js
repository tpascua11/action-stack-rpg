// ============================================================
//  IMBUE HANDLERS
//  Phase: IMBUE
//  Modify what the attack IS — convert elements, add properties/status
//  Always consumed on trigger
// ============================================================

import { registerTag } from '../registry/battle_registry';

export function FireImbueHandler(payload, character, tag) {
  payload.damages.forEach(d => (d.element = 'FIRE'));
  payload.status_effects.push('BURN');
  return { payload, consumed: true };
}

export function IceImbueHandler(payload, character, tag) {
  payload.damages.forEach(d => (d.element = 'ICE'));
  payload.status_effects.push('FREEZE_CHANCE');
  return { payload, consumed: true };
}

registerTag('FIRE_IMBUE', {
  phases: ['IMBUE'],
  handlers: { IMBUE: FireImbueHandler },
});

registerTag('ICE_IMBUE', {
  phases: ['IMBUE'],
  handlers: { IMBUE: IceImbueHandler },
});
