// @flow
import request from 'supertest'
import { server } from '../server'

describe('server', () => {
  test('should return 400 if request is not valid json', async () => {
    const response = await request(server)
      .post('/foobar')
      .send('notJSON')
    expect(response.status).toEqual(400)
  })
})
