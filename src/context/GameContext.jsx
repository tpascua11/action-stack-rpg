// ============================================================
//  GameContext — provides gs and dispatch to the entire app
// ============================================================

import { createContext, useContext, useReducer } from 'react';
import { battleReducer } from '../battle/reducer';
import { buildInitialState } from '../battle/initialState';

const GameContext = createContext(null);

function initGameState() {
  try {
    const raw = localStorage.getItem('daq_player');
    const playerData = raw ? JSON.parse(raw) : null;
    return buildInitialState(undefined, playerData);
  } catch {
    return buildInitialState();
  }
}

export function GameProvider({ children }) {
  const [gs, dispatch] = useReducer(battleReducer, undefined, initGameState);
  return (
    <GameContext.Provider value={{ gs, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
