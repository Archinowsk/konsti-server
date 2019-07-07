/* @flow */
import request from 'supertest'
import { app } from 'app'

describe('POST /api/toggle-app-open', () => {
  test('should return 401 without valid authorization', async () => {
    const response = await request(app).post('/api/toggle-app-open')
    expect(response.status).toEqual(401)
  })
})
