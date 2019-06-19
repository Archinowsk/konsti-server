/* @flow */
import request from 'supertest'
import { app } from 'app'

describe('/api/login tests', () => {
  test('POST /api/login', async () => {
    const response = await request(app).post('/api/login')
    expect(response.status).toEqual(422)
  })
})
