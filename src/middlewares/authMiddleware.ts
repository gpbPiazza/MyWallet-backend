import * as express from 'express'

import { findByToken } from '../repositories/sessionsRepository'
import { findUserById } from '../repositories/usersRepository'

// import User from '../interfaces/usersInterfaces'
// import Session from '../interfaces/sessionInterfaces'

// declare namespace Express {
//   export interface Request {
//      header: any,
//      user: User,
//      session: Session
//   }
// }

async function authMiddleware (req: any, res: express.Response, next: express.NextFunction): Promise<express.Response | undefined> {
  const authHeader = req.header('Authorization')
  if (!authHeader) {
    return res.status(401).send({ error: 'Auth header not found' })
  }

  const token = authHeader.replace('Bearer ', '')
  const session = await findByToken(token)
  if (!session) {
    return res.status(401).send({ error: 'Invalid token' })
  }

  const user = await findUserById(session.userId)
  if (!user) {
    return res.status(401).json({ error: 'Invalid token' })
  }

  req.user = user
  req.session = session

  next()
}

export default authMiddleware
