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
  await db.serial.removeSerials();
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
  it('should not insert same serial into collection', async () => {
    const oneSerial = 'testserial123';
    const serials = [
      'testserial1',
      'testserial12',
      'testserial123',
      'testserial6',
    ];
    await db.serial.saveSerials([oneSerial]);

    const savedSerials = await db.serial.saveSerials(serials);

    const results = savedSerials.map((serial) => serial.serial);
    expect(results).toEqual(
      serials.filter((serial) => serial !== 'testserial123')
    );
  });
});
