import { Game } from 'typings/game.typings';

export interface FavoritedGame {
  gameId: string;
}

export interface SignedGame {
  gameDetails: Game;
  priority: number;
  time: string;
}

export interface EnteredGame {
  gameDetails: Game;
  priority: number;
  time: string;
}

export enum UserGroup {
  user = 'user',
  admin = 'admin',
  help = 'help',
}

export interface User {
  username: string;
  password: string;
  userGroup: UserGroup;
  serial: string;
  groupCode: string;
  favoritedGames: ReadonlyArray<FavoritedGame>;
  signedGames: ReadonlyArray<SignedGame>;
  enteredGames: ReadonlyArray<EnteredGame>;
  createdAt: string | null;
}

export type UserArray = ReadonlyArray<User>;

export interface NewUserData {
  username: string;
  serial: string;
  passwordHash: string | Promise<void>;
  userGroup?: string;
  groupCode?: string;
  favoritedGames?: ReadonlyArray<FavoritedGame>;
  signedGames?: ReadonlyArray<SignedGame>;
  enteredGames?: ReadonlyArray<EnteredGame>;
}

export interface SignupWish {
  username: string;
  gameId: string;
  priority: number;
}

export interface PlayerIdWithPriority {
  playerId: number;
  priorityValue: number;
}
