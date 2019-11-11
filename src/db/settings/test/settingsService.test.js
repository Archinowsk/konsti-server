// @flow
import mongoose from 'mongoose';
import moment from 'moment';
import { db } from 'db/mongodb';
import { SettingsModel } from 'db/settings/settingsSchema';

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
  await SettingsModel.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Settings service', () => {
  it('should update signup time', async () => {
    const signupTime = '2019-07-26T14:00:00.000Z';

    await db.settings.createSettings();
    await db.settings.saveSignupTime(signupTime);

    const insertedSettings = await SettingsModel.findOne({});

    expect(moment(insertedSettings.signupTime).format()).toEqual(
      moment(signupTime).format()
    );
  });
});
