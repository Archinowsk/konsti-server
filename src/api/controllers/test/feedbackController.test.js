import request from 'supertest'
import app from 'app'

describe('/api/feedback tests', () => {
  test('POST /api/feedback', async () => {
    const response = await request(app).post('/api/feedback')
    expect(response.status).toEqual(401)
  })
})
