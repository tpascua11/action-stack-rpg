// ============================================================
//  App — phase router
// ============================================================

import { GameProvider, useGame } from './context/GameContext';
import { PlayerProvider } from './context/PlayerContext';
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
    <PlayerProvider>
      <GameProvider>
        <PhaseRouter />
      </GameProvider>
    </PlayerProvider>
  );
}
