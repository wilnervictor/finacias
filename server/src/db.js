import pg from 'pg'
import 'dotenv/config'

const { Pool } = pg

// Render Postgres exige SSL; localhost (dev) não. A Render define a variável
// RENDER=true automaticamente em todo serviço, o que usamos aqui pra decidir.
const useSSL = process.env.RENDER === 'true' || process.env.PGSSL === 'true'

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSSL ? { rejectUnauthorized: false } : false,
})

export function query(text, params) {
  return pool.query(text, params)
}
