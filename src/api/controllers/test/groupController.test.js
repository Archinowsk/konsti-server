/* @flow */
import request from 'supertest'
import { app } from 'app'

describe('GET /api/group', () => {
  test('should return 401 without valid authorization', async () => {
    const response = await request(app).get('/api/group')
    expect(response.status).toEqual(401)
  })
})

describe('POST /api/group', () => {
  test('should return 401 without valid authorization', async () => {
    const response = await request(app).post('/api/group')
    expect(response.status).toEqual(401)
  })
})
