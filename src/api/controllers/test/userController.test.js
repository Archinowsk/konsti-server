import request from 'supertest'
import app from 'app'

describe('basic route tests', () => {
  test('GET /api/user', async () => {
    const response = await request(app).get('/api/user')
    expect(response.status).toEqual(401)
  })
})
