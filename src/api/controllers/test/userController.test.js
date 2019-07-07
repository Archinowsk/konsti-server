/* @flow */
import request from 'supertest'
import { app } from 'app'

describe('GET /api/user', () => {
  test('should return 401 without valid authorization', async () => {
    const response = await request(app).get('/api/user')
    expect(response.status).toEqual(401)
  })
})

describe('POST /api/user', () => {
  test('should return 422 without username', async () => {
    const response = await request(app)
      .post('/api/user')
      .send({
        password: 'testpass',
        serial: 'testserial',
      })
    expect(response.status).toEqual(422)
  })

  test('should return 422 without password', async () => {
    const response = await request(app)
      .post('/api/user')
      .send({
        username: 'testuser',
        serial: 'testserial',
      })
    expect(response.status).toEqual(422)
  })

  test('should return 422 without serial', async () => {
    const response = await request(app)
      .post('/api/user')
      .send({
        username: 'testuser',
        password: 'testpass',
      })
    expect(response.status).toEqual(422)
  })
})
