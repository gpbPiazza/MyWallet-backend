import express from 'express'
import cors from 'cors'

import { postSignUp, postSignIn } from './controllers/usersController'
require('dotenv').config()

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(cors())

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

// User routes
app.post('/api/users/sign-up', postSignUp)
app.post('/api/users/sign-in', postSignIn)
