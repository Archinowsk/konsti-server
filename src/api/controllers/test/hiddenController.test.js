import request from 'supertest'
import app from 'app'

describe('/api/hidden tests', () => {
  test('POST /api/hidden', async () => {
    const response = await request(app).post('/api/hidden')
    expect(response.status).toEqual(401)
  })
})
