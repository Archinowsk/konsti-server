/* @flow */
import request from 'supertest'
import { app } from 'app'

describe('POST /api/login', () => {
  test('should return 422 without any parameters', async () => {
    const response = await request(app).post('/api/login')
    expect(response.status).toEqual(422)
  })

  test('should return 422 if username is found but password is missing', async () => {
    const response = await request(app).post('/api/login', {
      username: 'testuser',
    })
    expect(response.status).toEqual(422)
  })

  test('should return 422 if password is found but username is missing', async () => {
    const response = await request(app).post('/api/login', {
      password: 'testpass',
    })
    expect(response.status).toEqual(422)
  })

  test('should return 422 if password, username, and jwt are found', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ username: 'testuser', password: 'testpass', jwt: 'testjwt' })
    expect(response.status).toEqual(422)
  })

  test('should return 200 if password and username are found', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ username: 'testuser', password: 'testpass' })
    expect(response.status).toEqual(200)
  })

  test('should return 200 if jwt is found', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ jwt: 'testjwt' })
    expect(response.status).toEqual(200)
  })
})
