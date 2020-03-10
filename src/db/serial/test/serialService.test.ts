import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { db } from 'db/mongodb';
import { SerialModel } from 'db/serial/serialSchema';

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

describe('Serial service', () => {
  it('should insert new serial into collection', async () => {
    const mockSerial = '1234ABCD';

    await db.serial.saveSerials([mockSerial]);

    const insertedSerial = await SerialModel.findOne({ serial: mockSerial });
    expect(insertedSerial?.serial).toEqual(mockSerial);
  });
});
