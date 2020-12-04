import * as express from 'express'
import { createAccount, findAccountByUserId } from '../repositories/accountRepository'
// import User from '../interfaces/usersInterfaces'
// import Session from '../interfaces/sessionInterfaces'

// declare namespace Express {
//   export interface Request {
//      user: User,
//      session: Session
//   }
// }

export async function postAccount (req: any, res: express.Response): Promise<express.Response> {
  const user = req.user
  try {
    const account = await createAccount(user.id)
    return res.status(201).send(account)
  } catch (e) {
    console.log(e, 'aaaaaaaaaaaaaaaaaaaa')
    return res.sendStatus(500)
  }
}

export async function getAccount (req: any, res: express.Response): Promise<express.Response> {
  const user = req.user
  try {
    const account = await findAccountByUserId(user.id)
    return res.status(200).send(account)
  } catch (e) {
    console.log(e, 'zapeeeeeeeeeeeeeeeeeeeeeeee')
    return res.sendStatus(500)
  }
}
