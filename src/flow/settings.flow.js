// @flow
import type { Game } from 'flow/game.flow'

export type SettingsType = {|
  +hiddenGames: $ReadOnlyArray<Game>,
  +canceledGames: $ReadOnlyArray<Game>,
  +signupTime: string,
  +appOpen: boolean,
|}
