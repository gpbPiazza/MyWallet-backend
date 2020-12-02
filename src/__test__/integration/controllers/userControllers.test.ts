/* eslint-disable no-undef */
import supertest from 'supertest'
import { app } from '../../../app'
import connection from '../../../database/index'

async function cleanDataBase () {
  await connection.query('DELETE FROM users')
  await connection.query('DELETE FROM sessions')
}

beforeAll(async () => {
  await cleanDataBase()
})

afterAll(async () => {
  await cleanDataBase()
  connection.end()
})

describe('POST /sign-up', () => {
  it('should respond with http status 422 when body password has less than 6 characters and dont have any numbers or especial caracters', async () => {
    const body = {
      username: 'zapTest',
      email: 'zapTest@gmail.com',
      password: 'zapTest',
      passwordConfirmation: 'zapTest'
    }

    const request = await supertest(app).post('/api/users/sign-up').send(body)
    expect(request.status).toBe(422)
  })

  it('should respond with  http status 201 when body are valid', async () => {
    const body = {
      username: 'zapTest',
      email: 'zapTest@gmail.com',
      password: 'zapTest@123',
      passwordConfirmation: 'zapTest@123'
    }

    const request = await supertest(app).post('/api/users/sign-up').send(body)
    expect(request.status).toBe(201)
  })

  it('should respond with  http status 409 when body usarname and password are alredy used', async () => {
    const body = {
      username: 'zapTest',
      email: 'zapTest@gmail.com',
      password: 'zapTest@123',
      passwordConfirmation: 'zapTest@123'
    }

    const request = await supertest(app).post('/api/users/sign-up').send(body)
    expect(request.status).toBe(409)
  })
})

describe('POST /sign-in', () => {
  it('should respond with http status 422 when body password has less than 6 characters and dont have any numbers or especial caracters', async () => {
    const body = {
      email: 'zapTest@gmail.com',
      password: 'zapTest'
    }

    const request = await supertest(app).post('/api/users/sign-in').send(body)
    expect(request.status).toBe(422)
  })

  it('should respond with  http status 202 when body are valid', async () => {
    const body = {
      email: 'zapTest@gmail.com',
      password: 'zapTest@123'
    }

    const request = await supertest(app).post('/api/users/sign-in').send(body)
    expect(request.status).toBe(202)
  })

  it('should respond with  http status 401 when body usarname and email are invalid', async () => {
    const body = {
      email: 'chuao@gmail.com',
      password: 'joao@123'
    }

    const request = await supertest(app).post('/api/users/sign-in').send(body)
    expect(request.status).toBe(401)
  })
})
