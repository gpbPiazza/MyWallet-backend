/* eslint-disable no-undef */
const axios = require('axios')

describe('POST /sign-up', () => {
  it('should respond with http status 422 when body password has less than 6 characters and dont have any numbers or especial caracters', async () => {
    const body = {
      username: 'zapTest',
      email: 'zapTest@gmail.com',
      password: 'zapTest',
      passwordConfirmation: 'zapTest'
    }

    try {
      await axios.post('http://localhost:3000/api/users/sign-up', body)
    } catch (error) {
      expect(error.response.status).toBe(422)
    }
  })

  it('should respond with  http status 201 when body are valid', async () => {
    const body = {
      username: 'zapTest',
      email: 'zapTest@gmail.com',
      password: 'zapTest@123',
      passwordConfirmation: 'zapTest@123'
    }
    const request = await axios.post('http://localhost:3000/api/users/sign-up', body)

    expect(request.status).toBe(201)
  })

  it('should respond with  http status 409 when body usarname and password are alredy used', async () => {
    try {
      const body = {
        username: 'ZAPE',
        email: 'ZAPE@gmail.com',
        password: 'ZAPE@123',
        passwordConfirmation: 'ZAPE@123'
      }

      await axios.post('http://localhost:3000/api/users/sign-up', body)
      fail('Log in was sucessful with exsitent user')
    } catch (error) {
      expect(error.response.status).toBe(409)
    };
  })
})

describe('POST /sign-in', () => {
  it('should respond with http status 422 when body password has less than 6 characters and dont have any numbers or especial caracters', async () => {
    const body = {
      email: 'zapTest@gmail.com',
      password: 'zapTest'
    }

    try {
      await axios.post('http://localhost:3000/api/users/sign-in', body)
    } catch (error) {
      expect(error.response.status).toBe(422)
    }
  })

  it('should respond with  http status 202 when body are valid', async () => {
    const body = {
      email: 'joao@gmail.com',
      password: 'joao@123'
    }
    const request = await axios.post('http://localhost:3000/api/users/sign-in', body)

    expect(request.status).toBe(202)
  })

  it('should respond with  http status 401 when body usarname and email are invalid', async () => {
    try {
      const body = {
        email: 'chuao@gmail.com',
        password: 'joao@123'
      }

      await axios.post('http://localhost:3000/api/users/sign-in', body)
      fail('Log in was sucessful with invalid email')
    } catch (error) {
      expect(error.response.status).toBe(401)
    };
  })
})
