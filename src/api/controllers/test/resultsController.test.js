// @flow
import request from 'supertest'
import { server } from 'server/server'

describe('GET /api/results', () => {
  test('should return 422 without any parameters', async () => {
    const response = await request(server).get('/api/results')
    expect(response.status).toEqual(422)
  })
})
