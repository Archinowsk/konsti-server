// @flow
import type { Game } from 'flow/game.flow';

export type Settings = {|
  +hiddenGames: $ReadOnlyArray<Game>,
  +signupTime: string,
  +appOpen: boolean,
|};
