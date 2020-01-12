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

describe('server', () => {
  test('should return 400 if request is not valid json', async () => {
    const response = await request(server)
      .post('/foobar')
      .send('notJSON');
    expect(response.status).toEqual(400);
  });
});
