// @flow
import request from 'supertest'
import { server } from 'server/server'

describe('GET /api/settings', () => {
  test('should return 200', async () => {
    const response = await request(server).get('/api/settings')
    expect(response.status).toEqual(200)
  })
})
