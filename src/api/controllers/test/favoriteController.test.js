// @flow
import request from 'supertest';
import { startServer, closeServer } from 'server/server';

let server;
beforeEach(async () => {
  server = await startServer();
});

afterEach(async () => {
  await closeServer(server);
});

describe('POST /api/favorite', () => {
  test('should return 401 without valid authorization', async () => {
    const response = await request(server).post('/api/favorite');
    expect(response.status).toEqual(401);
  });
});
