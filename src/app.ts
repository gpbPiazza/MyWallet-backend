import express from 'express'
import cors from 'cors'

import { postSignUp, postSignIn, deleteSession } from './controllers/usersController'
import { getAccount, attBalance, historyTransaction } from './controllers/accountController'
import authMiddleware from './middlewares/authMiddleware'
require('dotenv').config()

export const app = express()

app.use(express.json())
app.use(cors())

// User routes
app.post('/api/users/sign-up', postSignUp)
app.post('/api/users/sign-in', postSignIn)
app.delete('/api/users/log-out', authMiddleware, deleteSession)

// Account routes
app.get('/api/account', authMiddleware, getAccount)
app.put('/api/account/update-balance', authMiddleware, attBalance)
app.get('/api/account/transaction-history/:userId', authMiddleware, historyTransaction)
