// @flow
import request from 'supertest'
import { server } from 'server/server'

describe('GET /api/group', () => {
  test('should return 401 without valid authorization', async () => {
    const response = await request(server).get('/api/group')
    expect(response.status).toEqual(401)
  })
})

describe('POST /api/group', () => {
  test('should return 401 without valid authorization', async () => {
    const response = await request(server).post('/api/group')
    expect(response.status).toEqual(401)
  })
})
