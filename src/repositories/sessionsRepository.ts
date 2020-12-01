import connection from '../database'
import { uuid } from 'uuidv4'
import Session from '../interfaces/sessionInterfaces'

export async function createSession (userId: number): Promise<Session> {
  const newSession = {
    userId,
    token: uuid()
  }
  console.log(newSession.token, 'aaaaaa')
  await connection.query(
    'INSERT INTO sessions ("userId", token) VALUES ($1, $2)', [
      newSession.userId,
      newSession.token
    ])
  return newSession
}
