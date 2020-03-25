import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { startServer, closeServer } from 'server/server';

let server;
let mongoServer;
let mongoUri;

beforeEach(async () => {
  mongoServer = new MongoMemoryServer();
  mongoUri = await mongoServer.getConnectionString();
  server = await startServer(mongoUri);
});

afterEach(async () => {
  await closeServer(server, mongoUri);
  await mongoServer.stop();
});

describe('server', () => {
  test('should return 400 if request is not valid json', async () => {
    const response = await request(server).post('/foobar').send('notJSON');
    expect(response.status).toEqual(400);
  });
});
