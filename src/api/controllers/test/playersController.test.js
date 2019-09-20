// @flow
import request from 'supertest'
import { app } from 'app'

describe('POST /api/players', () => {
  test('should return 401 without valid authorization', async () => {
    const response = await request(app).post('/api/players')
    expect(response.status).toEqual(401)
  })
})
