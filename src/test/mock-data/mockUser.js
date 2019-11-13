// @flow
import { mockGame, mockGame2 } from 'test/mock-data/mockGame';

export const mockUser = {
  favoritedGames: [],
  username: 'Test User',
  passwordHash: 'testpass',
  userGroup: 'user',
  serial: '1234ABCD',
  groupCode: '0',
  signedGames: [],
  enteredGames: [],
};

export const mockSignup = {
  username: 'Test User',
  signedGames: [
    {
      gameDetails: mockGame,
      priority: 1,
      time: '2019-07-26T14:00:00.000Z',
    },
    {
      gameDetails: mockGame2,
      priority: 1,
      time: '2019-07-26T15:00:00.000Z',
    },
  ],
};
