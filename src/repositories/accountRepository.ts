import connection from '../database/index'
import Account from '../interfaces/accountInterface'

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
