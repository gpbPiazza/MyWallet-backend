/* eslint-disable no-undef */
import supertest from 'supertest'
import { app } from '../src/app'
import connection from '../src/database/index'

interface UserLoged {
  id: number;
  email: string;
  username: string;
  token: string;
}

let userLogEd: UserLoged

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
    userLogEd = request.body
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

describe('DELETE /api/users/log-out', () => {
  it('should respond with http status 401 when user does not have a session', async () => {
    const header = { Authorization: 'Bearer ' }

    const request = await supertest(app).delete('/api/users/log-out').set(header)
    expect(request.status).toBe(401)
  })

  it('should respond with  http status 401 when user session does not exist', async () => {
    const header = { Authorization: 'Bearer 9d808e7d-9aae-4b88-89dd-cd4c9d1366e7' }

    const request = await supertest(app).delete('/api/users/log-out').set(header)
    expect(request.status).toBe(401)
  })

  it('should respond with  http status 200 when user is deleted with success', async () => {
    const header = { Authorization: `Bearer ${userLogEd.token}` }

    const request = await supertest(app).delete('/api/users/log-out').set(header)
    expect(request.status).toBe(200)
  })
})
