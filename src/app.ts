import express from 'express'
import cors from 'cors'

import { postSignUp, postSignIn } from './controllers/usersController'
import { postAccount, getAccount } from './controllers/accountController'
import authMiddleware from './middlewares/authMiddleware'
require('dotenv').config()

export const app = express()

app.use(express.json())
app.use(cors())

// User routes
app.post('/api/users/sign-up', postSignUp)
app.post('/api/users/sign-in', postSignIn)

// Account routes
app.post('/api/account/create', authMiddleware, postAccount)
app.get('/api/account', authMiddleware, getAccount)
