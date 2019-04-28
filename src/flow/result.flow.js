// @flow
import type { Game } from 'flow/game.flow'

export type Result = {
  username: string,
  enteredGame: Game,
  signedGames: Array<Game>,
}
