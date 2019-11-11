// @flow
import mongoose from 'mongoose';
import { db } from 'db/mongodb';
import { SerialModel } from 'db/serial/serialSchema';

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
  await SerialModel.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Serial service', () => {
  it('should insert new serial into collection', async () => {
    const mockSerial = '1234ABCD';

    await db.serial.saveSerials([mockSerial]);

    const insertedSerial = await SerialModel.findOne({ serial: mockSerial });
    expect(insertedSerial.serial).toEqual(mockSerial);
  });
});
