// @flow
import type { Game } from 'flow/game.flow'
import type { SignedGame } from 'flow/user.flow'

export type Result = {
  username: string,
  enteredGame: Game,
  signedGames: Array<SignedGame>,
}
