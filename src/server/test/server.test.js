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

describe('server', () => {
  test('should return 400 if request is not valid json', async () => {
    const response = await request(server)
      .post('/foobar')
      .send('notJSON');
    expect(response.status).toEqual(400);
  });
});
