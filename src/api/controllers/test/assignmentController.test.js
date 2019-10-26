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

describe('POST /api/players', () => {
  test('should return 401 without valid authorization', async () => {
    const response = await request(server).post('/api/assignment')
    expect(response.status).toEqual(401)
  })
})
