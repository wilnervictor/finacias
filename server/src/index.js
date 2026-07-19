import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import 'dotenv/config'
import authRoutes from './routes/auth.js'
import transactionsRoutes from './routes/transactions.js'
import clientesRoutes from './routes/clientes.js'

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET não definido. Configure a variável de ambiente antes de iniciar a API.')
  process.exit(1)
}

// Rede de segurança: por padrão o Node encerra o processo (derrubando a API
// pra todo mundo) diante de uma promise rejeitada sem catch. As rotas já
// usam asyncHandler pra nunca deixar isso acontecer, mas isso aqui evita que
// um caminho esquecido no futuro tire o servidor do ar.
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection (servidor seguiu rodando):', err)
})

const app = express()

// A Render fica atrás de um proxy reverso — sem isso, express-rate-limit
// enxergaria todo mundo vindo do mesmo IP (o do proxy) e limitaria todos os
// usuários juntos em vez de por pessoa.
app.set('trust proxy', 1)

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Origem não permitida pelo CORS.'))
      }
    },
  })
)
app.use(express.json())

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Muitas tentativas. Aguarde alguns minutos e tente de novo.' },
})

app.get('/api/health', (req, res) => res.json({ ok: true }))
app.use('/api/auth/login', authLimiter)
app.use('/api/auth/register', authLimiter)
app.use('/api/auth', authRoutes)
app.use('/api/transactions', transactionsRoutes)
app.use('/api/clientes', clientesRoutes)

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Erro interno no servidor.' })
})

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`API rodando na porta ${port}`))
