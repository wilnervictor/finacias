// Script pontual (rodar via Render "One-Off Jobs"): troca e-mail/senha do
// usuário especial (is_special = true) sem precisar mexer no banco na mão.
// Uso: node src/scripts/set-special-user.js <email> <senha>
import bcrypt from 'bcryptjs'
import { pool } from '../db.js'

const [, , email, password] = process.argv

if (!email || !password || password.length < 6) {
  console.error('Uso: node src/scripts/set-special-user.js <email> <senha-com-6+-caracteres>')
  process.exit(1)
}

async function main() {
  const passwordHash = await bcrypt.hash(password, 10)
  const { rows } = await pool.query(
    `update users set email = $1, password_hash = $2
     where is_special = true
     returning id, name, email`,
    [email.trim().toLowerCase(), passwordHash]
  )

  if (rows.length === 0) {
    console.error('Nenhum usuário especial encontrado.')
    process.exit(1)
  }

  console.log('Usuário especial atualizado:', rows[0])
  await pool.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
