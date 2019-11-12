// @flow
import mongoose from 'mongoose';
import { db } from 'db/mongodb';
import { GameModel } from 'db/game/gameSchema';
import { mockGame } from 'test/mock-data/mockGame';

beforeAll(async () => {
  const options = {
    promiseLibrary: global.Promise,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  };

  await mongoose.connect(global.process.env.MONGO_URL, options);
});

beforeEach(async () => {
  await GameModel.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Game service', () => {
  it('should insert new game into collection', async () => {
    await db.game.saveGames([mockGame]);

    const insertedGame = await GameModel.findOne({
      gameId: mockGame.gameId,
    });
    expect(insertedGame.gameId).toEqual(mockGame.gameId);
  });
});
