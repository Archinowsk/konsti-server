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

describe('GET /api/settings', () => {
  test('should return 200', async () => {
    const response = await request(server).get('/api/settings')
    expect(response.status).toEqual(200)
  })
})
