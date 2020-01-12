// @flow
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { startServer, closeServer } from 'server/server';

let server;
beforeEach(async () => {
  const mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getConnectionString();
  server = await startServer(mongoUri);
});
afterEach(async () => {
  await closeServer(server);
});

describe('POST /api/toggle-app-open', () => {
  test('should return 401 without valid authorization', async () => {
    const response = await request(server).post('/api/toggle-app-open');
    expect(response.status).toEqual(401);
  });
});
