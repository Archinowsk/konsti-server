import request from 'supertest'
import app from 'app'

describe('/api/group tests', () => {
  test('GET /api/group', async () => {
    const response = await request(app).get('/api/group')
    expect(response.status).toEqual(401)
  })

  test('POST /api/group', async () => {
    const response = await request(app).post('/api/group')
    expect(response.status).toEqual(401)
  })
})
