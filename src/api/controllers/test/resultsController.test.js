// @flow
import request from 'supertest'
import { startServer, closeServer } from 'server/server'

let server
beforeEach(async () => {
  server = await startServer()
})

afterEach(async () => {
  await closeServer(server)
})

describe('GET /api/results', () => {
  test('should return 422 without any parameters', async () => {
    const response = await request(server).get('/api/results')
    expect(response.status).toEqual(422)
  })
})
