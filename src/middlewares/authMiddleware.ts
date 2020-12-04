import { Request, Response, NextFunction } from 'express'

import { findByToken } from '../repositories/sessionsRepository'
import { findUserById } from '../repositories/usersRepository'

async function authMiddleware (req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
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
