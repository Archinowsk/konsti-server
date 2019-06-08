// @flow
import type { Game } from 'flow/game.flow'

export type FavoritedGame = {
  +gameId: string,
}

export type SignedGame = {
  +gameDetails: Game,
  +priority: number,
  +time: Date,
}

export type EnteredGame = {
  +gameDetails: Game,
  +priority: number,
  +time: Date,
}

export type User = {
  +username: string,
  +password: string,
  +userGroup: string,
  +serial: string,
  +playerGroup: string,
  +favoritedGames: $ReadOnlyArray<FavoritedGame>,
  +signedGames: $ReadOnlyArray<SignedGame>,
  +enteredGames: $ReadOnlyArray<EnteredGame>,
  +createdAt: Date | null,
}

export type UserArray = $ReadOnlyArray<User>

export type NewUserData = {
  +username: string,
  +registerDescription: boolean,
  +serial: string,
  +passwordHash: string | Promise<any>,
  +userGroup?: string,
  +playerGroup?: string,
  +favoritedGames?: $ReadOnlyArray<Game>,
  +signedGames?: $ReadOnlyArray<Game>,
  +enteredGames?: $ReadOnlyArray<Game>,
}

export type SignupWish = {
  +username: string,
  +gameId: string,
  +priority: number,
}
