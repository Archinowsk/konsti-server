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

export type UserGroup = 'user' | 'admin' | 'help';

export interface User {
  username: string;
  password: string;
  userGroup: UserGroup;
  serial: string;
  groupCode: string;
  favoritedGames: readonly FavoritedGame[];
  signedGames: readonly SignedGame[];
  enteredGames: readonly EnteredGame[];
  createdAt: string | null;
}

export type UserArray = readonly User[];

export interface NewUserData {
  username: string;
  serial: string;
  passwordHash: string | Promise<void>;
  userGroup?: string;
  groupCode?: string;
  favoritedGames?: readonly FavoritedGame[];
  signedGames?: readonly SignedGame[];
  enteredGames?: readonly EnteredGame[];
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
