import connection from '../database'
import uuid from 'uuid'
import Session from '../interfaces/sessionInterfaces'

export async function createSession(userId: number): Promise<Session> {
    const newSession = {
        userId,
        token: uuid.v4(),
    };
    await connection.query(
        'INSERT INTO sessions ("userId", token) VALUES ($1, $2)',[
          newSession.userId, 
          newSession.token
        ]);
    return newSession; 
}