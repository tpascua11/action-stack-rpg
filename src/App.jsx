// ============================================================
//  App — phase router
// ============================================================

import { GameProvider, useGame } from './context/GameContext';
import TitleScreen from './screens/TitleScreen';
import CharacterSelectScreen from './screens/CharacterSelectScreen';
import BattleScreen from './screens/BattleScreen';

function PhaseRouter() {
  const { gs } = useGame();

  switch (gs.phase) {
    case 'TITLE':
      return <TitleScreen />;
    case 'CHARACTER_SELECT':
      return <CharacterSelectScreen />;
    case 'QUEUE_SETUP':
    case 'BATTLE':
    case 'RESULT':
      return <BattleScreen />;
    default:
      return null;
  }
}

export default function App() {
  return (
    <GameProvider>
      <PhaseRouter />
    </GameProvider>
  );
}
