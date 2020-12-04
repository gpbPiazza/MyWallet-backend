import connection from '../database/index'
import Account, { TransactionParams, Transaction } from '../interfaces/accountInterface'
import dayjs = require('dayjs')

export async function createAccount (userId: number): Promise<Account> {
  const balance = 0
  const account = await connection.query(
    'INSERT INTO account ("userId", balance) VALUES ($1, $2) RETURNING *', [
      userId,
      balance
    ])

  return account.rows[0]
}

export async function findAccountByUserId (userId: number): Promise<Account> {
  const account = await connection.query(
    'SELECT * FROM account WHERE "userId"=$1', [
      userId
    ])

  return account.rows[0]
}

export async function hasBalance (transactionParams: TransactionParams, userId: number): Promise<boolean> {
  const { typeTransaction, value } = transactionParams

  const account = await findAccountByUserId(userId)

  if (typeTransaction === 'deposit') {
    return true
  } else if (typeTransaction === 'withdrawal') {
    if (parseFloat(account.balance) - parseFloat(value) < 0) {
      return false
    } else {
      return true
    }
  } else {
    throw new Error('typeTransaction must be equal "deposit" or "withdrawal"')
  }
}

export async function registerAtt (transactionParams: TransactionParams, userId: number): Promise<Transaction> {
  const { typeTransaction, value, description } = transactionParams

  const dateTransaction = dayjs().format('YYYY-MM-DD HH:mm:ss')

  const newTransaction = await connection.query('INSERT INTO "transactionHistory" ("userId", "typeTransaction", value, description, "dateTransaction") VALUES ($1, $2, $3, $4, $5) RETURNING *', [
    userId,
    typeTransaction,
    value,
    description,
    dateTransaction
  ])

  return newTransaction.rows[0]
}

export async function upDateBalance (transactionParams: Transaction, userId: number): Promise<Account> {
  const { typeTransaction, value } = transactionParams
  let newBalance = 0

  const account = await findAccountByUserId(userId)

  if (typeTransaction === 'deposit') {
    newBalance = parseFloat(account.balance) + parseFloat(value)
  } else if (typeTransaction === 'withdrawal') {
    newBalance = parseFloat(account.balance) - parseFloat(value)
  } else {
    throw new Error('typeTransaction must be equal "deposit" or "withdrawal"')
  }

  const updatedAccount = await connection.query('UPDATE account SET balance=$1 WHERE "userId"=$2 RETURNING *', [newBalance, userId])

  return updatedAccount.rows[0]
}

export async function findHistoryTransactions (userId: number): Promise<Transaction[]> {
  const findHistoryTransactions = await connection.query('SELECT * FROM "transactionHistory" WHERE "userId"=$1', [userId])

  return findHistoryTransactions.rows
}
