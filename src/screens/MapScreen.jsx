import { useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { usePlayer } from '../context/PlayerContext';
import EMBER_KEEP from '../data/scenarios/ember_keep.json';

export default function MapScreen() {
  const { gs, goToBattle } = useGame();
  const { playerDispatch } = usePlayer();

  // Process battle result when arriving from a fight
  useEffect(() => {
    if (!gs.battleResult) return;
    playerDispatch({
      type: 'APPLY_BATTLE_RESULT',
      currentHP: gs.battleResult.currentHP,
    });
  }, [gs.battleResult]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white gap-6">
      <h1 className="text-3xl font-bold">Map Screen</h1>
      {gs.battleResult && (
        <p className="text-lg text-yellow-400">
          Last battle: {gs.battleResult.victory ? 'VICTORY' : 'DEFEAT'} — HP remaining: {gs.battleResult.currentHP}
        </p>
      )}
      <button
        onClick={() => goToBattle(EMBER_KEEP)}
        className="px-6 py-3 bg-red-700 hover:bg-red-600 rounded text-white font-bold"
      >
        [DEBUG] Go To Battle
      </button>
    </div>
  );
}
