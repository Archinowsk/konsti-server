import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import moment from 'moment';
import { db } from 'db/mongodb';
import { SettingsModel } from 'db/settings/settingsSchema';
import { mockGame } from 'test/mock-data/mockGame';

let mongoServer;

const options = {
  promiseLibrary: global.Promise,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

beforeEach(async () => {
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getConnectionString();
  await mongoose.connect(mongoUri, options);
});

afterEach(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Settings service', () => {
  it('should set defaults if settings not found', async () => {
    await db.settings.findSettings();
    const defaultSettings = {
      hiddenGames: [],
      signupTime: null,
      appOpen: true,
    };
    const insertedSettings = await SettingsModel.findOne({});
    expect(insertedSettings?.hiddenGames.length).toEqual(
      defaultSettings.hiddenGames.length
    );
    expect(insertedSettings?.signupTime).toEqual(defaultSettings.signupTime);
    expect(insertedSettings?.appOpen).toEqual(defaultSettings.appOpen);
  });

  it('should update hidden games', async () => {
    const hiddenGames = [mockGame, mockGame];
    await db.settings.saveHidden(hiddenGames);
    const insertedSettings = await SettingsModel.findOne({});
    expect(insertedSettings?.hiddenGames.length).toEqual(hiddenGames.length);
  });

  it('should update signup time', async () => {
    const signupTime = '2019-07-26T14:00:00.000Z';
    await db.settings.saveSignupTime(signupTime);
    const insertedSettings = await SettingsModel.findOne({});
    expect(moment(insertedSettings?.signupTime).format()).toEqual(
      moment(signupTime).format()
    );
  });

  it('should update appOpen status', async () => {
    const appOpen = false;
    await db.settings.saveToggleAppOpen(appOpen);
    const insertedSettings = await SettingsModel.findOne({});
    expect(insertedSettings?.appOpen).toEqual(appOpen);
  });
});
