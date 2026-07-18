import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { pool } from './db.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const migrationsDir = path.join(__dirname, '..', 'migrations')

async function main() {
  const files = readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort()
  for (const file of files) {
    const sql = readFileSync(path.join(migrationsDir, file), 'utf8')
    console.log(`Aplicando migration: ${file}`)
    await pool.query(sql)
  }
  console.log('Migrations aplicadas com sucesso.')
  await pool.end()
}

main().catch((err) => {
  console.error('Falha ao aplicar migrations:', err)
  process.exit(1)
})
