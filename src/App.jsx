// ============================================================
//  App — phase router
// ============================================================

import { GameProvider, useGame } from './context/GameContext';
import { PlayerProvider } from './context/PlayerContext';
import GameCanvas from './components/shared/GameCanvas';
import TitleScreen from './screens/TitleScreen';
import CharacterSelectScreen from './screens/CharacterSelectScreen';
import BattleScreen from './screens/BattleScreen';
import MapScreen from './screens/MapScreen';

function PhaseRouter() {
  const { gs } = useGame();

  switch (gs.phase) {
    case 'TITLE':
      return <TitleScreen />;
    case 'CHARACTER_SELECT':
      return <CharacterSelectScreen />;
    case 'MAP':
      return <MapScreen />;
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
    <GameCanvas>
      <PlayerProvider>
        <GameProvider>
          <PhaseRouter />
        </GameProvider>
      </PlayerProvider>
    </GameCanvas>
  );
}
