# Finacias

Sistema de gestão financeira pessoal — controle de receitas/despesas com gráficos,
e um módulo extra de controle de assinaturas de clientes (só para o usuário que
se cadastrar primeiro no sistema).

- **Frontend**: React + Vite + Tailwind (`/src`)
- **Backend**: Node.js + Express + PostgreSQL (`/server`)

## Rodando localmente

### API (`/server`)

```bash
cd server
npm install
cp .env.example .env   # edite DATABASE_URL e JWT_SECRET
npm run migrate        # cria as tabelas
npm run dev
```

Precisa de um Postgres rodando localmente (`DATABASE_URL` no `.env`).

### Frontend (raiz do projeto)

```bash
npm install
cp .env.example .env.local   # VITE_API_URL apontando pra API acima
npm run dev
```

## Deploy

### API na Render

O `render.yaml` na raiz já descreve o serviço (web service Node) e o banco
Postgres. Na Render: **New > Blueprint**, aponte para este repositório, e ele
cria os dois recursos automaticamente (o `JWT_SECRET` é gerado sozinho).

Depois do deploy, defina a variável de ambiente `CORS_ORIGIN` no serviço
`finacias-api` com a URL do frontend na Vercel (ex:
`https://finacias.vercel.app`) — sem isso a API bloqueia as requisições do
navegador.

### Frontend na Vercel

Importe o repositório na Vercel (framework detectado automaticamente como
Vite). Configure a variável de ambiente:

- `VITE_API_URL` → URL da API na Render + `/api` (ex:
  `https://finacias-api.onrender.com/api`)

O `vercel.json` já cuida do roteamento client-side (React Router).
