# 🏠 Plataforma White-Label Imobiliária

Sistema multi-tenant completo para criação de sites imobiliários personalizados. Cada cliente (imobiliária) tem sua própria instância isolada com branding e configurações únicas.

## 🏗️ Arquitetura do Projeto

```
imobiliario-whitelabel/
├── 🏢 backend/                 # API Backend Multi-tenant
│   ├── src/
│   │   ├── controllers/        # Controladores da API
│   │   ├── models/             # Modelos Sequelize (Tenant, User, Property)
│   │   ├── routes/             # Rotas da API
│   │   ├── middleware/         # Middlewares (auth, tenant isolation)
│   │   ├── seeders/            # Seeds do banco de dados
│   │   ├── config/             # Configurações (DB, etc.)
│   │   └── utils/              # Utilitários
│   ├── scripts/                # Scripts de inicialização
│   └── package.json
│
├── 🏘️ tenants/                 # Instâncias dos clientes
│   ├── terras-paraguay-app/    # Cliente: Terras Paraguay
│   └── [outros-clientes]/      # Futuros clientes
│
├── 🎛️ dashboard-admin/         # Dashboard administrativo
├── 📚 shared/                  # Componentes compartilhados
└── 📋 docs/                    # Documentação do projeto
```

## 🎯 Primeiro Cliente: Terras Paraguay

**Negócio:** Venda de terrenos e propriedades rurais no Paraguay
**Target:** Investidores brasileiros
**Idiomas:** Português e Espanhol
**Moedas:** USD (principal), PYG, BRL
**Especialidades:** Fazendas, estâncias, terrenos rurais

### Configurações Específicas:
- ✅ Multi-moeda (USD/PYG/BRL)
- ✅ Multi-idioma (PT/ES)
- ✅ Tipos de propriedade: fazendas, estâncias, terrenos
- ✅ Medidas em hectares para propriedades rurais
- ✅ Integração WhatsApp Business
- ✅ SEO otimizado para mercado Paraguay-Brasil

## 🚀 Quick Start

### 1. Setup do Backend

```bash
cd backend
npm install
cp .env.example .env
# Configure suas variáveis no .env

# Inicializar banco de dados
node scripts/init-database.js

# Iniciar servidor
npm run dev
```

### 2. Testar API

```bash
# Health check
curl http://localhost:3001/health

# Configuração do tenant
curl "http://localhost:3001/api/tenants/config?tenant=terras-paraguay"

# Propriedades do tenant
curl "http://localhost:3001/api/properties?tenant=terras-paraguay"
```

### 3. Credenciais de Teste

**Admin Terras Paraguay:**
- Email: `admin@terrasnoparaguay.com`
- Senha: `admin123`
- Tenant: `terras-paraguay`

## 🛠️ Tecnologias

### Backend
- **Node.js + Express**: API REST
- **PostgreSQL**: Banco principal
- **Sequelize**: ORM
- **Redis**: Cache e sessões
- **JWT**: Autenticação
- **Multer + Cloudinary**: Upload de imagens

### Frontend (por tenant)
- **React 18**: Interface
- **Tailwind CSS**: Styling
- **React Router**: Navegação
- **React Query**: Estado do servidor

## 🔐 Sistema Multi-Tenant

### Resolução de Tenant

O sistema identifica o tenant através de:

1. **Header HTTP**: `X-Tenant-Slug: terras-paraguay`
2. **Query Parameter**: `?tenant=terras-paraguay`
3. **Subdomínio**: `terras-paraguay.plataforma.com`
4. **Domínio Customizado**: `terrasparaguay.com`

### Isolamento de Dados

- ✅ **Banco de Dados**: Cada query filtra por `tenant_id`
- ✅ **APIs**: Middleware garante isolamento
- ✅ **Uploads**: Organizados por tenant
- ✅ **Cache**: Separado por tenant

## 💼 Modelos de Negócio

### Planos Disponíveis

| Plano | Preço/mês | Propriedades | Usuários | Features |
|-------|-----------|--------------|----------|----------|
| **Básico** | R$ 297 | 100 | 5 | Site + WhatsApp |
| **Profissional** | R$ 597 | 500 | 15 | + Tours 360° + CRM |
| **Enterprise** | R$ 1.297 | Ilimitado | 50 | + IA + Integrações |

### Terras Paraguay: Plano Profissional
- ✅ 500 propriedades
- ✅ 15 usuários
- ✅ Tours virtuais 360°
- ✅ CRM integrado
- ✅ Multi-moeda/idioma
- ✅ Analytics avançados

## 🏢 Gestão de Tenants

### Criar Novo Tenant

```bash
curl -X POST http://localhost:3001/api/admin/tenants \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "slug": "imobiliaria-nova",
    "name": "Imobiliária Nova",
    "plan": "basic",
    "admin_user": {
      "email": "admin@imobiliarianova.com",
      "password": "senha123",
      "name": "Admin Nova"
    }
  }'
```

### Configurar Features

```bash
curl -X PUT http://localhost:3001/api/admin/tenants/TENANT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "features": {
      "virtual_tour_360": true,
      "crm": true,
      "multi_currency": false
    }
  }'
```

## 📊 APIs Principais

### Tenant API
```bash
GET /api/tenants/config           # Configuração pública
GET /api/tenants/stats            # Estatísticas
PUT /api/tenants/config           # Atualizar config (admin)
GET /api/tenants/dashboard        # Dashboard do tenant
```

### Properties API
```bash
GET /api/properties               # Listar propriedades
GET /api/properties/:id           # Propriedade específica
POST /api/properties              # Criar propriedade
PUT /api/properties/:id           # Atualizar propriedade
DELETE /api/properties/:id        # Deletar propriedade
```

### Admin API
```bash
GET /api/admin/dashboard          # Dashboard geral
GET /api/admin/tenants            # Listar tenants
POST /api/admin/tenants           # Criar tenant
PUT /api/admin/tenants/:id        # Atualizar tenant
GET /api/admin/tenants/:id/analytics  # Analytics do tenant
```

## 🔧 Configuração de Desenvolvimento

### Variáveis de Ambiente

```bash
# .env
NODE_ENV=development
PORT=3001

# Database
DB_HOST=localhost
DB_NAME=whitelabel_master
DB_USER=postgres
DB_PASSWORD=password

# Security
JWT_SECRET=your-super-secret-key
BCRYPT_ROUNDS=12

# External APIs
GOOGLE_MAPS_API_KEY=your_key
CLOUDINARY_URL=your_cloudinary_url
```

### Scripts NPM

```bash
npm run dev          # Desenvolvimento
npm run start        # Produção
npm run test         # Testes
npm run lint         # ESLint
npm run migrate      # Migrações DB
npm run seed         # Seeders
```

## 🚀 Deploy e Produção

### Docker Setup

```bash
# Build
docker build -t whitelabel-backend ./backend

# Run
docker run -p 3001:3001 \
  -e DB_HOST=postgres \
  -e DB_PASSWORD=password \
  whitelabel-backend
```

### Deploy Multi-Tenant

Cada tenant pode ter:
- **Subdomínio**: `cliente.plataforma.com`
- **Domínio Próprio**: `cliente.com.br`
- **CDN Personalizada**: Assets únicos por tenant

## 📈 Roadmap

### Fase 1 - MVP ✅
- [x] Backend multi-tenant
- [x] Tenant "terras-paraguay"
- [x] APIs básicas
- [x] Sistema de auth

### Fase 2 - Monetização 🔄
- [ ] Dashboard admin completo
- [ ] Sistema de billing
- [ ] Integração Stripe
- [ ] Deploy automatizado

### Fase 3 - Escala 📋
- [ ] Tours virtuais 360°
- [ ] IA para descrições
- [ ] CRM avançado
- [ ] Mobile app

## 🤝 Contribuição

1. Clone o repositório
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Commit: `git commit -m 'Add nova feature'`
4. Push: `git push origin feature/nova-feature`
5. Abra um Pull Request

## 📄 Licença

Este projeto é proprietário. Todos os direitos reservados.

---

**🚀 Plataforma White-Label Imobiliária** - Transformando imobiliárias em líderes digitais.