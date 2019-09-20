// @flow
import request from 'supertest'
import { server } from 'server/server'

describe('POST /api/signup', () => {
  test('should return 401 without valid authorization', async () => {
    const response = await request(server).post('/api/signup')
    expect(response.status).toEqual(401)
  })
})
