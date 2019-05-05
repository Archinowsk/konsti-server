import request from 'supertest'
import app from 'app'

describe('/api/favorite tests', () => {
  test('POST /api/favorite', async () => {
    const response = await request(app).post('/api/favorite')
    expect(response.status).toEqual(401)
  })
})
