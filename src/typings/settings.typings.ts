import { Game } from 'typings/game.typings';

export interface Settings {
  hiddenGames: ReadonlyArray<Game>;
  signupTime: string;
  appOpen: boolean;
}
