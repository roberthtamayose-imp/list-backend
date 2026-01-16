# Shopping List API

API REST para sistema de lista de compras desenvolvida com NestJS, Prisma e PostgreSQL.

## 🚀 Funcionalidades

- ✅ Autenticação JWT (registro, login, validação)
- ✅ Gerenciamento de usuários
- ✅ CRUD de listas de compras
- ✅ CRUD de itens de compras
- ✅ Compartilhamento de listas por código
- ✅ Compartilhamento de listas por email
- ✅ Controle de permissões (visualização/edição)

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório e entre na pasta:
```bash
cd shopping-list-backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Edite o arquivo `.env` com suas configurações:
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/shopping_list"
JWT_SECRET="sua-chave-secreta-super-segura"
JWT_EXPIRES_IN="7d"
PORT=3001
```

5. Execute as migrations do Prisma:
```bash
npm run prisma:migrate
```

6. Gere o cliente Prisma:
```bash
npm run prisma:generate
```

## 🏃 Executando

### Desenvolvimento
```bash
npm run start:dev
```

### Produção
```bash
npm run build
npm run start:prod
```

## 📚 Endpoints da API

### Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/register` | Registrar novo usuário |
| POST | `/api/auth/login` | Fazer login |
| GET | `/api/auth/me` | Obter perfil do usuário logado |

### Usuários

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/users` | Listar todos os usuários |
| GET | `/api/users/:id` | Obter usuário por ID |
| PATCH | `/api/users/:id` | Atualizar usuário |
| DELETE | `/api/users/:id` | Deletar usuário |

### Listas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/lists` | Criar nova lista |
| GET | `/api/lists` | Listar todas as listas do usuário |
| GET | `/api/lists/:id` | Obter lista por ID |
| PATCH | `/api/lists/:id` | Atualizar lista |
| DELETE | `/api/lists/:id` | Deletar lista |
| POST | `/api/lists/:id/share-code` | Gerar código de compartilhamento |
| POST | `/api/lists/join` | Entrar em lista por código |
| POST | `/api/lists/:id/share` | Compartilhar lista por email |
| DELETE | `/api/lists/:id/share/:userId` | Remover compartilhamento |
| PATCH | `/api/lists/:id/share/:userId` | Atualizar permissões |

### Itens

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/lists/:listId/items` | Adicionar item à lista |
| GET | `/api/lists/:listId/items` | Listar itens da lista |
| GET | `/api/lists/:listId/items/:id` | Obter item por ID |
| PATCH | `/api/lists/:listId/items/:id` | Atualizar item |
| PATCH | `/api/lists/:listId/items/:id/toggle` | Marcar/desmarcar item |
| DELETE | `/api/lists/:listId/items/:id` | Remover item |
| DELETE | `/api/lists/:listId/items` | Limpar itens concluídos |

## 📝 Exemplos de Requisições

### Registro
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "usuario@email.com", "password": "senha123", "name": "Meu Nome"}'
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "usuario@email.com", "password": "senha123"}'
```

### Criar Lista
```bash
curl -X POST http://localhost:3001/api/lists \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"name": "Compras da Semana", "description": "Lista semanal"}'
```

### Adicionar Item
```bash
curl -X POST http://localhost:3001/api/lists/LISTA_ID/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"name": "Leite", "quantity": 2, "unit": "L", "category": "laticinios"}'
```

## 🗂️ Estrutura do Projeto

```
src/
├── auth/                 # Módulo de autenticação
│   ├── dto/             # Data Transfer Objects
│   ├── guards/          # Guards de autenticação
│   └── strategies/      # Estratégias Passport
├── items/               # Módulo de itens
│   └── dto/
├── lists/               # Módulo de listas
│   └── dto/
├── prisma/              # Módulo Prisma
├── users/               # Módulo de usuários
│   └── dto/
├── app.module.ts        # Módulo principal
└── main.ts              # Ponto de entrada
```

## 🛡️ Categorias Disponíveis

- `frutas` - Frutas 🍎
- `vegetais` - Vegetais 🥬
- `carnes` - Carnes 🥩
- `laticinios` - Laticínios 🧀
- `padaria` - Padaria 🥖
- `bebidas` - Bebidas 🥤
- `limpeza` - Limpeza 🧹
- `higiene` - Higiene 🧴
- `outros` - Outros 📦

## 📏 Unidades Disponíveis

- `un` - Unidade
- `kg` - Quilograma
- `g` - Grama
- `L` - Litro
- `ml` - Mililitro
- `dz` - Dúzia
- `pct` - Pacote
- `cx` - Caixa

## 🔐 Autenticação

Todas as rotas (exceto `/auth/register` e `/auth/login`) requerem autenticação via Bearer Token no header:

```
Authorization: Bearer seu_token_jwt
```

## 📄 Licença

MIT

