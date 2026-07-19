import pg from 'pg'
import 'dotenv/config'

const { Pool, types } = pg

// Por padrão o driver converte a coluna DATE (OID 1082) num objeto JS Date à
// meia-noite local, e depois de volta pra string com toISOString() isso só
// bate com o dia certo se o servidor rodar num fuso UTC ou "atrás" dele — num
// fuso à frente de UTC (ex: Europa, Ásia) o dia voltaria errado (um a menos).
// Mantendo a string "YYYY-MM-DD" como veio do banco, sem passar por Date.
types.setTypeParser(1082, (value) => value)

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
