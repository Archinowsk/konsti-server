// @flow
import mongoose from 'mongoose';
import { db } from 'db/mongodb';
import { UserModel } from 'db/user/userSchema';

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
  await UserModel.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('User service', () => {
  it('should insert new user into collection', async () => {
    const mockUser = {
      favoritedGames: [],
      username: 'test user',
      passwordHash: 'testpass',
      userGroup: 'user',
      serial: '1234ABCD',
      groupCode: '0',
      signedGames: [],
      enteredGames: [],
    };

    await db.user.saveUser(mockUser);

    const insertedUser = await UserModel.findOne({
      username: mockUser.username,
    });
    expect(insertedUser.username).toEqual(mockUser.username);
  });
});
