/* @flow */
import request from 'supertest'
import { app } from 'app'

describe('GET /api/games', () => {
  test('should return 200', async () => {
    const response = await request(app).get('/api/games')
    expect(response.status).toEqual(200)
  })
})

describe('POST /api/games', () => {
  test('should return 401 without valid authorization', async () => {
    const response = await request(app).post('/api/games')
    expect(response.status).toEqual(401)
  })
})
