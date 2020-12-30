/* eslint-disable no-undef */
import supertest from 'supertest'
import { app } from '../app'
import connection from '../database/index'

interface UserLogged {
  id: number;
  email: string;
  username: string;
  token: string;
}

let userLoggEdWithAccount: UserLogged
let userLoggEdWithOutAccount: UserLogged

async function cleanDataBase () {
  await connection.query('DELETE FROM users')
  await connection.query('DELETE FROM sessions')
  await connection.query('DELETE FROM account')
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
    const userWithAccount = {
      username: 'zapTest',
      email: 'zapTest@gmail.com',
      password: 'zapTest@123',
      passwordConfirmation: 'zapTest@123'
    }

    const userWithOutAccount = {
      username: 'bob',
      email: 'bob@gmail.com',
      password: 'bob@123',
      passwordConfirmation: 'bob@123'
    }
    await supertest(app).post('/api/users/sign-up').send(userWithOutAccount)

    const request = await supertest(app).post('/api/users/sign-up').send(userWithAccount)
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

    const userWithOutAccount = {
      email: 'bob@gmail.com',
      password: 'bob@123'
    }
    const requestForSaveUser = await supertest(app).post('/api/users/sign-in').send(userWithOutAccount)
    userLoggEdWithOutAccount = requestForSaveUser.body

    const request = await supertest(app).post('/api/users/sign-in').send(body)
    userLoggEdWithAccount = request.body
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

describe('POST /api/account/create', () => {
  it('should respond with http status 401 when user does not have a session', async () => {
    const header = { Authorization: 'Bearer ' }

    const request = await supertest(app).post('/api/account/create').set(header)
    expect(request.status).toBe(401)
  })

  it('should respond with http status 201 when user is logged so he can create a account with success', async () => {
    const header = { Authorization: `Bearer ${userLoggEdWithAccount.token}` }

    const request = await supertest(app).post('/api/account/create').set(header)
    expect(request.status).toBe(201)
  })
})

describe('GET /api/account', () => {
  it('should respond with http status 401 when user does not have a session', async () => {
    const header = { Authorization: 'Bearer' }

    const request = await supertest(app).get('/api/account').set(header)
    expect(request.status).toBe(401)
  })

  it('should respond with http status 404 when user dont have a account created', async () => {
    const header = { Authorization: `Bearer ${userLoggEdWithOutAccount.token}` }

    const request = await supertest(app).get('/api/account').set(header)
    expect(request.status).toBe(404)
  })

  it('should respond with http status 200 when user logged have a account created', async () => {
    const header = { Authorization: `Bearer ${userLoggEdWithAccount.token}` }

    const request = await supertest(app).get('/api/account').set(header)
    expect(request.status).toBe(200)
  })
})

describe('PUT /api/account/update-balance', () => {
  it('should respond with http status 401 when user dont have a account created', async () => {
    const body = {
      value: '99.00',
      description: 'Troco do pão',
      typeTransaction: 'withdrawal'
    }
    const header = { Authorization: `Bearer ${userLoggEdWithOutAccount.token}` }

    const request = await supertest(app).put('/api/account/update-balance').set(header).send(body)
    expect(request.status).toBe(401)
  })

  it('should respond with http status 400 when the body value its empty', async () => {
    const body = {
      value: '',
      description: 'Troco do pão',
      typeTransaction: 'withdrawal'
    }
    const header = { Authorization: `Bearer ${userLoggEdWithAccount.token}` }

    const request = await supertest(app).put('/api/account/update-balance').set(header).send(body)
    expect(request.status).toBe(400)
  })

  it('should respond with http status 401 when user dont have enough balance', async () => {
    const body = {
      value: '10.00',
      description: 'Comprar pão',
      typeTransaction: 'withdrawal'
    }
    const header = { Authorization: `Bearer ${userLoggEdWithAccount.token}` }

    const request = await supertest(app).put('/api/account/update-balance').set(header).send(body)
    expect(request.status).toBe(401)
  })

  it('should respond with http status 401 when user dont have enough balance', async () => {
    const body = {
      value: '1000.00',
      description: 'Salário',
      typeTransaction: 'deposit'
    }
    const header = { Authorization: `Bearer ${userLoggEdWithAccount.token}` }

    const request = await supertest(app).put('/api/account/update-balance').set(header).send(body)
    expect(request.status).toBe(200)
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
    const header = { Authorization: `Bearer ${userLoggEdWithAccount.token}` }

    const request = await supertest(app).delete('/api/users/log-out').set(header)
    expect(request.status).toBe(200)
  })
})
