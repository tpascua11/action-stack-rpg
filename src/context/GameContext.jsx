// ============================================================
//  GameContext — provides gs and dispatch to the entire app
// ============================================================

import { createContext, useContext, useReducer } from 'react';
import { battleReducer } from '../battle/reducer';
import { buildInitialState } from '../battle/initialState';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [gs, dispatch] = useReducer(battleReducer, undefined, buildInitialState);
  return (
    <GameContext.Provider value={{ gs, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
