import request from 'supertest'
import app from 'app'

describe('/api/games tests', () => {
  test('GET /api/games', async () => {
    const response = await request(app).get('/api/games')
    expect(response.status).toEqual(200)
  })

  test('POST /api/games', async () => {
    const response = await request(app).post('/api/games')
    expect(response.status).toEqual(401)
  })
})
