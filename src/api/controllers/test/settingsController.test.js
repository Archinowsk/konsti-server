/* @flow */
import request from 'supertest'
import { app } from 'app'

describe('GET /api/settings', () => {
  test('should return 200', async () => {
    const response = await request(app).get('/api/settings')
    expect(response.status).toEqual(200)
  })
})
