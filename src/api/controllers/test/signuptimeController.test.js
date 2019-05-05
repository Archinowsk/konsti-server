import request from 'supertest'
import app from 'app'

describe('/api/signuptime tests', () => {
  test('POST /api/signuptime', async () => {
    const response = await request(app).post('/api/signuptime')
    expect(response.status).toEqual(401)
  })
})
