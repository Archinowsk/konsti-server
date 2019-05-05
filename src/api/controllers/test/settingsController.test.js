import request from 'supertest'
import app from 'app'

describe('/api/settings tests', () => {
  test('GET /api/settings', async () => {
    const response = await request(app).get('/api/settings')
    expect(response.status).toEqual(200)
  })
})
