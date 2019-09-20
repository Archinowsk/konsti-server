// @flow
import request from 'supertest'
import { app } from 'app'

describe('GET /api/results', () => {
  test('should return 422 without any parameters', async () => {
    const response = await request(app).get('/api/results')
    expect(response.status).toEqual(422)
  })
})
