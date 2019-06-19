/* @flow */
import request from 'supertest'
import { app } from 'app'

describe('/api/players tests', () => {
  test('POST /api/players', async () => {
    const response = await request(app).post('/api/players')
    expect(response.status).toEqual(401)
  })
})
