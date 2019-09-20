// @flow
import request from 'supertest'
import { app } from 'app'

describe('server', () => {
  test('should return 400 if request is not valid json', async () => {
    const response = await request(app)
      .post('/foobar')
      .send('notJSON')
    expect(response.status).toEqual(400)
  })
})
