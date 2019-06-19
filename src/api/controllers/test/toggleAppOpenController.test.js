/* @flow */
import request from 'supertest'
import { app } from 'app'

describe('/api/toggle-app-open tests', () => {
  test('POST /api/toggle-app-open', async () => {
    const response = await request(app).post('/api/toggle-app-open')
    expect(response.status).toEqual(401)
  })
})
