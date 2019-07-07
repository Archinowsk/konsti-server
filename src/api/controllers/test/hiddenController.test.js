/* @flow */
import request from 'supertest'
import { app } from 'app'

describe('POST /api/hidden', () => {
  test('should return 401 without valid authorization', async () => {
    const response = await request(app).post('/api/hidden')
    expect(response.status).toEqual(401)
  })
})
