// @flow
import type { Game } from 'flow/game.flow';

export type FavoritedGame = {
  +gameId: string,
};

export type SignedGame = {
  +gameDetails: Game,
  +priority: number,
  +time: string,
};

export type EnteredGame = {
  +gameDetails: Game,
  +priority: number,
  +time: string,
};

export type UserGroup = 'user' | 'admin' | 'help';

export type User = {|
  +username: string,
  +password: string,
  +userGroup: UserGroup,
  +serial: string,
  +groupCode: string,
  +favoritedGames: $ReadOnlyArray<FavoritedGame>,
  +signedGames: $ReadOnlyArray<SignedGame>,
  +enteredGames: $ReadOnlyArray<EnteredGame>,
  +createdAt: string | null,
|};

export type UserArray = $ReadOnlyArray<User>;

export type NewUserData = {|
  +username: string,
  +serial: string,
  +passwordHash: string | Promise<void>,
  +userGroup?: string,
  +groupCode?: string,
  +favoritedGames?: $ReadOnlyArray<Game>,
  +signedGames?: $ReadOnlyArray<Game>,
  +enteredGames?: $ReadOnlyArray<Game>,
|};

export type SignupWish = {|
  +username: string,
  +gameId: string,
  +priority: number,
|};

export type PlayeIdWithPriority = {|
  +playerId: number,
  +priorityValue: number,
|};
