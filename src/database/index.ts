import * as dotenv from 'dotenv'
import { Pool } from 'pg'
dotenv.config()

const connection = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  port: 5432,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD
})

export default connection
