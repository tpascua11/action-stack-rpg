// ============================================================
//  MUSIC REGISTRY
//  Maps music track IDs (used in scenario JSON) to audio files.
// ============================================================

import battleTheme from './Battle Theme.mp3';
import menuMapTheme from './Menu Map Theme.mp3';
import menuMapTheme3 from './Menu Map Theme 3.mp3';
import wayOfTheSumurai from './WAY_OF_THE_SUMURAI_BATTLE_1.mp3';
import samuraiVictory from './Samurai Victory.mp3';

export const MUSIC_REGISTRY = {
  battle_theme: battleTheme,
  menu_map_theme: menuMapTheme,
  menu_map_theme_3: menuMapTheme3,
  WAY_OF_THE_SUMURAI_BATTLE_1: wayOfTheSumurai,
  samurai_victory: samuraiVictory,
};

export const VICTORY_MUSIC = {
  SUMURAI: 'samurai_victory',
  default: 'samurai_victory',
};
