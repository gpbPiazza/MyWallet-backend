import { Request, Response } from 'express'
import User from '../interfaces/usersInterfaces'
import { signUpSchema, signInSchema } from '../schemas/userSchemas'
import { isEmailUnique, createUser, findUserByEmailAndPassword } from '../repositories/usersRepository'
import { createSession } from '../repositories/sessionsRepository'

export async function postSignUp (req: Request, res: Response) {
  const userParams = req.body

  const { error } = signUpSchema.validate(userParams)
  if (error) {
    return res.status(422).send({ error: error.details[0].message })
  }

  try {
    const unique = await isEmailUnique(userParams.email)
    if (unique) {
      return res.status(409).json({ error: 'Email is already in use' })
    }

    const user = await createUser(userParams)
    const userData = getUserData(user)
    return res.status(201).send(userData)
  } catch {
    return res.sendStatus(500)
  }
}

export async function postSignIn (req: Request, res: Response) {
  const userParams = req.body

  const { error } = signInSchema.validate(userParams)
  if (error) {
    return res.status(422).send({ error: error.details[0].message })
  }

  try {
    const user = await findUserByEmailAndPassword(userParams.email, userParams.password)
    if (!user) {
      return res.status(401).send({ error: 'Wrong email or password' })
    }

    const { token } = await createSession(user.id)
    const userData = getUserData(user)
    res.status(202).send({ ...userData, token })
  } catch (e) {
    console.log(e)
    return res.status(500).send(e)
  }
}

function getUserData (user: User) {
  const { id, email, username } = user
  return {
    id,
    email,
    username
  }
}
