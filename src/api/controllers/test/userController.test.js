/* @flow */
import request from 'supertest'
import { app } from 'app'

describe('GET /api/user', () => {
  test('should return 401 without valid authorization', async () => {
    const response = await request(app).get('/api/user')
    expect(response.status).toEqual(401)
  })
})
