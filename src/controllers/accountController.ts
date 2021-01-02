import { Request, Response } from 'express'

import {
  findAccountByUserId,
  hasBalance,
  registerAtt,
  upDateBalance,
  findHistoryTransactions
} from '../repositories/accountRepository'
import { attBalanceSchema } from '../schemas/accountSchemas'

export async function getAccount (req: Request, res: Response): Promise<Response> {
  const user = req.user
  try {
    const account = await findAccountByUserId(user.id)
    if (!account) {
      return res.status(404).send({ error: 'this user dont have account' })
    }
    return res.status(200).send(account)
  } catch {
    return res.sendStatus(500)
  }
}

export async function attBalance (req: Request, res: Response): Promise<Response> {
  const user = req.user
  const transcritionParams = req.body

  const { error } = attBalanceSchema.validate(transcritionParams)
  if (error) {
    return res.status(400).send({ error: error.details[0].message })
  }

  try {
    const account = await findAccountByUserId(user.id)
    if (!account) {
      return res.status(401).send({ error: "Account doesn't exist" })
    }

    const enoughBalance = await hasBalance(transcritionParams, user.id)
    if (!enoughBalance) {
      return res.status(401).send({ error: "Account doesn't have enought balance" })
    }

    const transaction = await registerAtt(transcritionParams, user.id)

    const updatedAccount = await upDateBalance(transaction, user.id)

    return res.status(200).send(updatedAccount)
  } catch {
    return res.sendStatus(500)
  }
}

export async function historyTransaction (req: Request, res: Response): Promise<Response> {
  const user = req.user

  try {
    const account = await findAccountByUserId(user.id)
    if (!account) {
      return res.status(401).send({ error: "Account doesn't exist" })
    }
    const historyTransactions = await findHistoryTransactions(user.id)

    return res.status(200).send(historyTransactions)
  } catch {
    return res.sendStatus(500)
  }
}
