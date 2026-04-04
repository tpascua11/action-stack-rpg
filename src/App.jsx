// ============================================================
//  App — phase router
// ============================================================

import { useReducer } from 'react';
import { battleReducer } from './battle/reducer';
import { buildInitialState } from './battle/initialState';
import BattleScreen from './screens/BattleScreen';

export default function App() {
  const [gs, dispatch] = useReducer(battleReducer, undefined, buildInitialState);

  switch (gs.phase) {
    case 'QUEUE_SETUP':
    case 'BATTLE':
    case 'RESULT':
      return <BattleScreen gs={gs} dispatch={dispatch} />;
    default:
      return null;
  }
}
