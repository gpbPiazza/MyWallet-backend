import * as dotenv from 'dotenv'
import { Pool } from 'pg'
dotenv.config()

const connection: Pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD
})

module.exports = connection
