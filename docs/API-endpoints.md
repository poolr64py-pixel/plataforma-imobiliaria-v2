\# API Documentation - Plataforma Imobiliária Multi-tenant



\*\*Base URL:\*\* `http://localhost:3001` (dev) | `https://api.terrasnoparaguay.com` (prod)



\*\*Versão:\*\* 1.0.0



---



\## Autenticação



Todas as rotas de admin requerem token JWT no header:



```http

Authorization: Bearer {token}

```



---



\## PROPERTIES (Propriedades)



\### GET /api/properties

Lista propriedades com filtros e paginação.



\*\*Query Parameters:\*\*

```

type          : string  (apartment, house, farm, ranch, land, studio)

purpose       : string  (sale, rent)

minPrice      : number

maxPrice      : number

location      : string

page          : number  (default: 1)

limit         : number  (default: 10)

sortBy        : string  (default: createdAt)

sortOrder     : string  (asc, desc - default: desc)

```



\*\*Response 200:\*\*

```json

{

&nbsp; "success": true,

&nbsp; "data": \[

&nbsp;   {

&nbsp;     "id": 1,

&nbsp;     "title": "Fazenda Produtiva em Coronel Oviedo",

&nbsp;     "price": 350000,

&nbsp;     "location": "Coronel Oviedo, Paraguay",

&nbsp;     "coordinates": { "lat": -25.447, "lng": -56.442 },

&nbsp;     "area": 100,

&nbsp;     "type": "farm",

&nbsp;     "purpose": "sale",

&nbsp;     "status": "disponivel",

&nbsp;     "images": \["url1", "url2"],

&nbsp;     "features": \["Solo fértil", "Água abundante"],

&nbsp;     "views": 245,

&nbsp;     "createdAt": "2024-01-15"

&nbsp;   }

&nbsp; ],

&nbsp; "pagination": {

&nbsp;   "page": 1,

&nbsp;   "limit": 10,

&nbsp;   "total": 50,

&nbsp;   "pages": 5

&nbsp; }

}

```



---



\### GET /api/properties/:id

Busca propriedade específica por ID.



\*\*Response 200:\*\*

```json

{

&nbsp; "success": true,

&nbsp; "data": {

&nbsp;   "id": 1,

&nbsp;   "title": "Fazenda Produtiva",

&nbsp;   "description": "Descrição completa...",

&nbsp;   "price": 350000,

&nbsp;   "pricePerHectare": 3500,

&nbsp;   "location": "Coronel Oviedo, Paraguay",

&nbsp;   "area": 100,

&nbsp;   "bedrooms": 3,

&nbsp;   "bathrooms": 2,

&nbsp;   "parking": 2,

&nbsp;   "type": "farm",

&nbsp;   "purpose": "sale",

&nbsp;   "status": "disponivel",

&nbsp;   "images": \["url1", "url2", "url3"],

&nbsp;   "features": \["feature1", "feature2"],

&nbsp;   "realtor": {

&nbsp;     "name": "Carlos Mendoza",

&nbsp;     "phone": "+595971123456",

&nbsp;     "email": "carlos@example.com"

&nbsp;   },

&nbsp;   "views": 245,

&nbsp;   "rating": 4.8,

&nbsp;   "reviews": 12

&nbsp; }

}

```



\*\*Response 404:\*\*

```json

{

&nbsp; "success": false,

&nbsp; "message": "Propriedade não encontrada"

}

```



---



\### POST /api/properties

Cria nova propriedade (requer autenticação).



\*\*Headers:\*\*

```

Authorization: Bearer {token}

Content-Type: application/json

```



\*\*Body:\*\*

```json

{

&nbsp; "title": "Nova Fazenda",

&nbsp; "description": "Descrição...",

&nbsp; "price": 450000,

&nbsp; "location": "Local, Paraguay",

&nbsp; "coordinates": { "lat": -25.123, "lng": -57.456 },

&nbsp; "area": 150,

&nbsp; "areaUnit": "hectares",

&nbsp; "bedrooms": 4,

&nbsp; "bathrooms": 3,

&nbsp; "parking": 2,

&nbsp; "type": "farm",

&nbsp; "purpose": "sale",

&nbsp; "status": "disponivel",

&nbsp; "images": \["url1", "url2"],

&nbsp; "features": \["feature1", "feature2"],

&nbsp; "tags": \["tag1", "tag2"]

}

```



\*\*Response 201:\*\*

```json

{

&nbsp; "success": true,

&nbsp; "data": { /\* propriedade criada \*/ },

&nbsp; "message": "Propriedade criada com sucesso"

}

```



---



\### PUT /api/properties/:id

Atualiza propriedade existente (requer autenticação).



\*\*Body:\*\* (mesma estrutura do POST, campos opcionais)



\*\*Response 200:\*\*

```json

{

&nbsp; "success": true,

&nbsp; "data": { /\* propriedade atualizada \*/ },

&nbsp; "message": "Propriedade atualizada com sucesso"

}

```



---



\### DELETE /api/properties/:id

Deleta propriedade (requer autenticação).



\*\*Response 200:\*\*

```json

{

&nbsp; "success": true,

&nbsp; "data": { /\* propriedade deletada \*/ },

&nbsp; "message": "Propriedade deletada com sucesso"

}

```



---



\## ADMIN (Autenticação)



\### POST /api/admin/login

Login de usuário admin.



\*\*Body:\*\*

```json

{

&nbsp; "email": "admin@terrasparaguay.com",

&nbsp; "password": "admin123"

}

```



\*\*Response 200:\*\*

```json

{

&nbsp; "success": true,

&nbsp; "token": "jwt\_token\_here",

&nbsp; "user": {

&nbsp;   "id": 1,

&nbsp;   "email": "admin@terrasparaguay.com",

&nbsp;   "name": "Admin",

&nbsp;   "tenant": "terras-paraguay"

&nbsp; }

}

```



\*\*Response 401:\*\*

```json

{

&nbsp; "success": false,

&nbsp; "message": "Email ou senha incorretos"

}

```



---



\## SEARCH (Busca)



\### GET /api/search

Busca geral por texto.



\*\*Query Parameters:\*\*

```

q : string (required) - termo de busca

```



\*\*Response 200:\*\*

```json

{

&nbsp; "success": true,

&nbsp; "data": \[ /\* array de propriedades \*/ ],

&nbsp; "query": "termo buscado",

&nbsp; "total": 15

}

```



---



\## TENANTS (Multi-tenant)



\### GET /api/tenants

Lista todos os tenants configurados.



\*\*Response 200:\*\*

```json

{

&nbsp; "success": true,

&nbsp; "data": {

&nbsp;   "terras-py": {

&nbsp;     "id": "terras-py",

&nbsp;     "name": "Terras no Paraguay",

&nbsp;     "domain": "terrasnoparaguay.com",

&nbsp;     "primaryColor": "#059669",

&nbsp;     "secondaryColor": "#047857",

&nbsp;     "phone": "+595 21 123456",

&nbsp;     "email": "contato@terrasnoparaguay.com"

&nbsp;   }

&nbsp; }

}

```



---



\### GET /api/tenants/:id

Busca configuração específica de um tenant.



\*\*Response 200:\*\*

```json

{

&nbsp; "success": true,

&nbsp; "data": {

&nbsp;   "id": "terras-py",

&nbsp;   "name": "Terras no Paraguay",

&nbsp;   "logo": "/logos/terras-py.png",

&nbsp;   "colors": {

&nbsp;     "primary": "#059669",

&nbsp;     "secondary": "#047857"

&nbsp;   },

&nbsp;   "contact": {

&nbsp;     "phone": "+595 21 123456",

&nbsp;     "whatsapp": "+595 971 123456",

&nbsp;     "email": "contato@terrasnoparaguay.com"

&nbsp;   }

&nbsp; }

}

```



---



\## STATS (Estatísticas)



\### GET /api/stats

Estatísticas gerais da plataforma.



\*\*Response 200:\*\*

```json

{

&nbsp; "success": true,

&nbsp; "data": {

&nbsp;   "totalProperties": 50,

&nbsp;   "propertiesByType": {

&nbsp;     "farm": 20,

&nbsp;     "ranch": 10,

&nbsp;     "land": 8,

&nbsp;     "house": 7,

&nbsp;     "apartment": 5

&nbsp;   },

&nbsp;   "propertiesByPurpose": {

&nbsp;     "sale": 45,

&nbsp;     "rent": 5

&nbsp;   },

&nbsp;   "averagePrice": 425000,

&nbsp;   "totalViews": 12450

&nbsp; }

}

```



---



\## LEADS (Contatos)



\### POST /api/leads

Cria novo lead/contato.



\*\*Body:\*\*

```json

{

&nbsp; "tenant\_id": "terras-paraguay",

&nbsp; "property\_id": 5,

&nbsp; "name": "João Silva",

&nbsp; "email": "joao@example.com",

&nbsp; "phone": "+5511999999999",

&nbsp; "message": "Tenho interesse neste imóvel",

&nbsp; "source": "website"

}

```



\*\*Response 201:\*\*

```json

{

&nbsp; "success": true,

&nbsp; "data": { /\* lead criado \*/ },

&nbsp; "message": "Lead registrado com sucesso"

}

```



---



\## FAVORITES (Favoritos)



\### POST /api/favorites

Adiciona propriedade aos favoritos.



\*\*Body:\*\*

```json

{

&nbsp; "tenant\_id": "terras-paraguay",

&nbsp; "property\_id": 3,

&nbsp; "user\_session": "session\_id\_123"

}

```



\*\*Response 201:\*\*

```json

{

&nbsp; "success": true,

&nbsp; "message": "Adicionado aos favoritos"

}

```



---



\### GET /api/favorites/:session

Lista favoritos de um usuário.



\*\*Response 200:\*\*

```json

{

&nbsp; "success": true,

&nbsp; "data": \[ /\* array de propriedades favoritadas \*/ ]

}

```



---



\### DELETE /api/favorites/:id

Remove favorito.



\*\*Response 200:\*\*

```json

{

&nbsp; "success": true,

&nbsp; "message": "Removido dos favoritos"

}

```



---



\## ANALYTICS (Tracking)



\### POST /api/analytics/event

Registra evento de analytics.



\*\*Body:\*\*

```json

{

&nbsp; "tenant\_id": "terras-paraguay",

&nbsp; "property\_id": 2,

&nbsp; "event\_type": "property\_view",

&nbsp; "user\_session": "session\_123",

&nbsp; "event\_data": {

&nbsp;   "referrer": "google",

&nbsp;   "time\_on\_page": 45

&nbsp; }

}

```



\*\*Response 201:\*\*

```json

{

&nbsp; "success": true,

&nbsp; "message": "Evento registrado"

}

```



---



\## HEALTH CHECK



\### GET /api/health

Verifica status da API.



\*\*Response 200:\*\*

```json

{

&nbsp; "status": "healthy",

&nbsp; "timestamp": "2025-01-15T10:30:00Z",

&nbsp; "uptime": 86400

}

```



---



\## Códigos de Status HTTP



| Código | Descrição |

|--------|-----------|

| 200 | OK - Requisição bem sucedida |

| 201 | Created - Recurso criado |

| 400 | Bad Request - Dados inválidos |

| 401 | Unauthorized - Não autenticado |

| 403 | Forbidden - Sem permissão |

| 404 | Not Found - Recurso não encontrado |

| 500 | Internal Server Error - Erro no servidor |



---



\## Variáveis de Ambiente



```bash

\# Backend .env

DATABASE\_URL=postgresql://user:pass@localhost:5432/imobiliario

PORT=3001

NODE\_ENV=production

JWT\_SECRET=seu\_secret\_aqui

CORS\_ORIGIN=https://terrasnoparaguay.com

```



---



\## Rate Limiting



\- \*\*Públicas:\*\* 100 requests/minuto por IP

\- \*\*Autenticadas:\*\* 1000 requests/minuto por usuário



---



\## Exemplos de Uso



\### JavaScript/Fetch

```javascript

// Buscar propriedades

const response = await fetch('http://localhost:3001/api/properties?type=farm\&limit=5');

const data = await response.json();



// Login admin

const loginResponse = await fetch('http://localhost:3001/api/admin/login', {

&nbsp; method: 'POST',

&nbsp; headers: { 'Content-Type': 'application/json' },

&nbsp; body: JSON.stringify({ email: 'admin@example.com', password: 'pass123' })

});

const { token } = await loginResponse.json();



// Criar propriedade (autenticado)

const createResponse = await fetch('http://localhost:3001/api/properties', {

&nbsp; method: 'POST',

&nbsp; headers: {

&nbsp;   'Content-Type': 'application/json',

&nbsp;   'Authorization': `Bearer ${token}`

&nbsp; },

&nbsp; body: JSON.stringify({ title: 'Nova Fazenda', price: 500000, /\* ... \*/ })

});

```



---



\## Changelog



\### v1.0.0 (2025-01-15)

\- Release inicial

\- Endpoints básicos de CRUD

\- Sistema de autenticação

\- Multi-tenant configurado



---



\## Suporte



\*\*Email:\*\* dev@terrasnoparaguay.com  

\*\*Docs:\*\* https://docs.terrasnoparaguay.com  

\*\*GitHub:\*\* https://github.com/terrasparaguay/api

