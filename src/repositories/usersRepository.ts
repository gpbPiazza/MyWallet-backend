import connection from '../database/index'
import User from '../interfaces/usersInterfaces'
import bcrypt from 'bcrypt'

export async function isEmailUnique (email: string): Promise<User | undefined> {
  const user = await connection.query('SELECT * FROM users WHERE email=$1', [email])
  return user.rows[0]
};

export async function createUser (userParams: User): Promise<User> {
  const { username, email, password } = userParams
  const passwordEncrypted = bcrypt.hashSync(password, 12)

  const user = await connection.query(
    'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *', [
      username,
      email,
      passwordEncrypted
    ])

  return user.rows[0]
}

export async function findUserByEmailAndPassword (email: string, password: string): Promise<User | null> {
  const user = await isEmailUnique(email)

  if (!user) {
    return null
  } if (bcrypt.compareSync(password, user.password)) {
    return user
  } else {
    return null
  }
}

export async function findUserById (userId: number): Promise<User> {
  const user = await connection.query('SELECT * FROM users where id=$1', [userId])
  return user.rows[0]
}
