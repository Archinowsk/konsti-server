/* @flow */
import request from 'supertest'
import { app } from 'app'

describe('/api/results tests', () => {
  test('GET /api/results', async () => {
    const response = await request(app).get('/api/results')
    expect(response.status).toEqual(422)
  })
})
