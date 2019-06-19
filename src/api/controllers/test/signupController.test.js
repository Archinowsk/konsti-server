/* @flow */
import request from 'supertest'
import { app } from 'app'

describe('/api/signup tests', () => {
  test('POST /api/signup', async () => {
    const response = await request(app).post('/api/signup')
    expect(response.status).toEqual(401)
  })
})
