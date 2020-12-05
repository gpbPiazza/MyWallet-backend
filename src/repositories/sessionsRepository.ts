import connection from '../database'
import { v4 } from 'uuid'
import Session from '../interfaces/sessionInterfaces'
// import User from '../interfaces/usersInterfaces'

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

export async function findByToken (token: string): Promise<Session> {
  const session = await connection.query('SELECT * FROM sessions WHERE token=$1', [token])
  return session.rows[0]
}

export async function deleteAllSessionsById (userId: number): Promise<Session> {
  const session = await connection.query('DELETE FROM sessions WHERE "userId"=$1', [userId])
  return session.rows[0]
}
