import connection from '../database'
import { v4 } from 'uuid'
import Session from '../interfaces/sessionInterfaces'

export async function createSession (userId: number): Promise<Session> {
  const newSession = {
    userId,
    token: v4()
  }

  await connection.query(
    'INSERT INTO sessions ("userId", token) VALUES ($1, $2)', [
      newSession.userId,
      newSession.token
    ])
  return newSession
}
