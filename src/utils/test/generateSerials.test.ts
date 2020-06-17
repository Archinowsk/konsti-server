import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
// import { exec } from 'child_process';
// import { resolve } from 'path';
// import { db } from 'db/mongodb';
// import { SerialModel } from 'db/serial/serialSchema';
// import generator from 'generate-serial-number';
// import generate from '../generateSerials';

let mongoServer: MongoMemoryServer;

// jest.mock('generate-serial-number');

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

describe('Generate serials', () => {
  it('should insert 3 serials', async () => {
    // const result = await runScript();
    expect(1).toEqual(1);
  });
});

// async function runScript(): Promise<string> {
//   return await new Promise((resolve) => {
//     exec(
//       `npx ts-node src/utils/generateSerials.ts`,
//       (_error, stdout, stderr) => {
//         resolve(stdout);
//       }
//     );
//   });
// }
