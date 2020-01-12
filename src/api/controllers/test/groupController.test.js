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

describe('GET /api/group', () => {
  test('should return 401 without valid authorization', async () => {
    const response = await request(server).get('/api/group');
    expect(response.status).toEqual(401);
  });
});

describe('POST /api/group', () => {
  test('should return 401 without valid authorization', async () => {
    const response = await request(server).post('/api/group');
    expect(response.status).toEqual(401);
  });
});
