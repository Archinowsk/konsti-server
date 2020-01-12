// @flow
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { startServer, closeServer } from 'server/server';

let server;
let mongoServer;
beforeEach(async () => {
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getConnectionString();
  server = await startServer(mongoUri);
});

afterEach(async () => {
  await closeServer(server);
  await mongoServer.stop();
});

describe('GET /api/settings', () => {
  test('should return 200', async () => {
    const response = await request(server).get('/api/settings');
    expect(response.status).toEqual(200);
  });
});
