const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3003', 
    'http://localhost:3000',
    'http://cliente2.localhost:3003'
  ]
}));
app.use(express.json());

// Mock Database - Propriedades Terras Paraguay Expandida
const mockProperties = [
  {
    id: 1,
    title: 'Fazenda Produtiva em Coronel Oviedo',
    price: 350000,
    pricePerHectare: 3500,
    currency: 'USD',
    location: 'Coronel Oviedo, Caaguazú - Paraguay',
    coordinates: { lat: -25.447, lng: -56.442 },
    area: 100,
    areaUnit: 'hectares',
    type: 'farm',
    purpose: 'sale',
    features: [
      'Solo fértil classe I',
      'Água abundante',
      'Título de propriedade limpo',
      'Acesso por estrada pavimentada',
      'Energia elétrica disponível',
      'Cercamento completo',
      'Casa sede',
      'Galpões para maquinário'
    ],
    description: 'Excelente fazenda para agronegócio no coração do Paraguay. Solo de primeira qualidade ideal para soja, milho e pecuária. Localização estratégica próxima a Coronel Oviedo.',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1586436746790-a74dbb5a3bb4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1574708667725-2df80b7fe1a4?w=800&h=600&fit=crop'
    ],
    tags: ['Investimento', 'Agronegócio', 'Título Limpo', 'Soja', 'Milho'],
    realtor: {
      name: 'Carlos Mendoza',
      phone: '+595971123456',
      email: 'carlos@terrasparaguay.com',
      whatsapp: '+595971123456'
    },
    createdAt: '2024-01-15',
    views: 245,
    rating: 4.8,
    reviews: 12
  },
  {
    id: 2,
    title: 'Terra para Agronegócio em Pedro Juan Caballero',
    price: 280000,
    pricePerHectare: 2800,
    currency: 'USD',
    location: 'Pedro Juan Caballero, Amambay - Paraguay',
    coordinates: { lat: -22.548, lng: -55.727 },
    area: 100,
    areaUnit: 'hectares',
    type: 'land',
    purpose: 'sale',
    features: [
      'Fronteira com Brasil',
      'Solo apto para soja',
      'Documentação em dia',
      'Próximo a silos',
      'Acesso facilitado',
      'Potencial de valorização',
      'Região em crescimento'
    ],
    description: 'Terra produtiva na fronteira com o Brasil, ideal para investidores brasileiros. Região estratégica para agronegócio com fácil escoamento da produção.',
    images: [
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1566403777403-50bbfd3138b9?w=800&h=600&fit=crop'
    ],
    tags: ['Fronteira', 'Brasil', 'Soja', 'Investimento'],
    realtor: {
      name: 'Maria Rodriguez',
      phone: '+595981234567',
      email: 'maria@terrasparaguay.com',
      whatsapp: '+595981234567'
    },
    createdAt: '2024-01-20',
    views: 189,
    rating: 4.7,
    reviews: 8
  },
  {
    id: 3,
    title: 'Estância Pecuária em Concepción',
    price: 450000,
    pricePerHectare: 2250,
    currency: 'USD',
    location: 'Concepción, Concepción - Paraguay',
    coordinates: { lat: -23.407, lng: -57.435 },
    area: 200,
    areaUnit: 'hectares',
    type: 'ranch',
    purpose: 'sale',
    features: [
      'Pastagens formadas',
      'Açude para gado',
      'Curral completo',
      'Casa de campo',
      'Poços artesianos',
      'Cerca elétrica',
      'Balança para gado',
      'Tronco de contenção'
    ],
    description: 'Estância completamente estruturada para pecuária. Pastagens de qualidade, infraestrutura completa e localização privilegiada para criação de gado.',
    images: [
      'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop'
    ],
    tags: ['Pecuária', 'Estruturada', 'Pastagens', 'Gado'],
    realtor: {
      name: 'José Silva',
      phone: '+595975678901',
      email: 'jose@terrasparaguay.com',
      whatsapp: '+595975678901'
    },
    createdAt: '2024-01-10',
    views: 156,
    rating: 4.9,
    reviews: 15
  },
  {
    id: 4,
    title: 'Casa Moderna em Fernando de la Mora',
    price: 120000,
    pricePerM2: 1000,
    currency: 'USD',
    location: 'Fernando de la Mora, Central - Paraguay',
    coordinates: { lat: -25.318, lng: -57.523 },
    area: 120,
    areaUnit: 'm²',
    rooms: 3,
    bathrooms: 2,
    parking: 2,
    type: 'house',
    purpose: 'sale',
    features: [
      'Casa nova',
      'Quintal amplo',
      'Garagem para 2 carros',
      'Churrasqueira',
      'Portão eletrônico',
      'Segurança 24h',
      'Próximo a shoppings',
      'Fácil acesso'
    ],
    description: 'Casa moderna em excelente localização. Construção recente com acabamentos de qualidade, quintal amplo e segurança.',
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1448630360428-65456885c650?w=800&h=600&fit=crop'
    ],
    tags: ['Casa Nova', 'Segurança', 'Quintal', 'Moderna'],
    realtor: {
      name: 'Ana Gutierrez',
      phone: '+595984567890',
      email: 'ana@terrasparaguay.com',
      whatsapp: '+595984567890'
    },
    createdAt: '2024-01-25',
    views: 98,
    rating: 4.6,
    reviews: 6
  },
  {
    id: 5,
    title: 'Apartamento Centro de Asunción',
    price: 85000,
    pricePerM2: 1417,
    currency: 'USD',
    location: 'Centro, Asunción - Paraguay',
    coordinates: { lat: -25.263, lng: -57.575 },
    area: 60,
    areaUnit: 'm²',
    rooms: 2,
    bathrooms: 1,
    parking: 1,
    type: 'apartment',
    purpose: 'sale',
    features: [
      'Vista para a cidade',
      'Prédio moderno',
      'Portaria 24h',
      'Elevador',
      'Próximo ao centro',
      'Fácil acesso',
      'Comércio próximo',
      'Transporte público'
    ],
    description: 'Apartamento moderno no centro de Asunción. Localização privilegiada com fácil acesso a comércios, bancos e transporte público.',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop'
    ],
    tags: ['Centro', 'Moderno', 'Vista', 'Investimento'],
    realtor: {
      name: 'Pedro Martinez',
      phone: '+595976543210',
      email: 'pedro@terrasparaguay.com',
      whatsapp: '+595976543210'
    },
    createdAt: '2024-02-01',
    views: 134,
    rating: 4.5,
    reviews: 9
  }
];

// Configurações dos tenants
const tenantConfigs = {
  'terras-py': {
    id: 'terras-py',
    name: 'Terras no Paraguay',
    domain: 'terrasnoparaguay.com',
    logo: '/logos/terras-py.png',
    colors: {
      primary: '#059669',
      secondary: '#047857',
      accent: '#fbbf24'
    },
    contact: {
      phone: '+595 21 123456',
      whatsapp: '+595 971 123456',
      email: 'contato@terrasnoparaguay.com',
      address: 'Asunción, Paraguay'
    },
    currency: 'USD',
    language: 'pt'
  }
};

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// Listar todas as propriedades
app.get('/api/properties', (req, res) => {
  const {
    type,
    purpose,
    minPrice,
    maxPrice,
    location,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  let filtered = [...mockProperties];

  // Filtros
  if (type) {
    filtered = filtered.filter(p => p.type === type);
  }
  if (purpose) {
    filtered = filtered.filter(p => p.purpose === purpose);
  }
  if (minPrice) {
    filtered = filtered.filter(p => p.price >= parseInt(minPrice));
  }
  if (maxPrice) {
    filtered = filtered.filter(p => p.price <= parseInt(maxPrice));
  }
  if (location) {
    filtered = filtered.filter(p =>
      p.location.toLowerCase().includes(location.toLowerCase())
    );
  }

  // Ordenação
  filtered.sort((a, b) => {
    if (sortOrder === 'desc') {
      return b[sortBy] > a[sortBy] ? 1 : -1;
    }
    return a[sortBy] > b[sortBy] ? 1 : -1;
  });

  // Paginação
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedResults = filtered.slice(startIndex, endIndex);

  // Convert to Portuguese field names for frontend compatibility
  const propertiesWithPortugueseFields = paginatedResults.map(property => ({
    ...property,
    titulo: property.title,
    preco: property.price,
    imagens: property.images,
    localizacao: property.location,
    descricao: property.description,
    caracteristicas: property.features,
    tipo: property.type,
    finalidade: property.purpose,
    area: property.area,
    unidadeArea: property.areaUnit,
    quartos: property.rooms,
    banheiros: property.bathrooms,
    vagas: property.parking,
    coordenadas: property.coordinates,
    corretor: property.realtor,
    criadoEm: property.createdAt,
    visualizacoes: property.views,
    avaliacao: property.rating,
    avaliacoes: property.reviews,
    tags: property.tags
  }));

  res.json({
    success: true,
    data: propertiesWithPortugueseFields,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: filtered.length,
      pages: Math.ceil(filtered.length / limit)
    },
    filters: { type, purpose, minPrice, maxPrice, location }
  });
});

// Buscar propriedade por ID
app.get('/api/properties/:id', (req, res) => {
  const property = mockProperties.find(p => p.id === parseInt(req.params.id));

  if (!property) {
    return res.status(404).json({
      success: false,
      message: 'Propriedade não encontrada'
    });
  }

  // Incrementar views
  property.views++;

  // Convert to Portuguese field names for frontend compatibility
  const propertyWithPortugueseFields = {
    ...property,
    titulo: property.title,
    preco: property.price,
    imagens: property.images,
    localizacao: property.location,
    descricao: property.description,
    caracteristicas: property.features,
    tipo: property.type,
    finalidade: property.purpose,
    area: property.area,
    unidadeArea: property.areaUnit,
    quartos: property.rooms,
    banheiros: property.bathrooms,
    vagas: property.parking,
    coordenadas: property.coordinates,
    corretor: property.realtor,
    criadoEm: property.createdAt,
    visualizacoes: property.views,
    avaliacao: property.rating,
    avaliacoes: property.reviews,
    tags: property.tags
  };

  res.json({
    success: true,
    data: propertyWithPortugueseFields
  });
});

// Busca geral
app.get('/api/search', (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({
      success: false,
      message: 'Parâmetro de busca (q) é obrigatório'
    });
  }

  const results = mockProperties.filter(property =>
    property.title.toLowerCase().includes(q.toLowerCase()) ||
    property.location.toLowerCase().includes(q.toLowerCase()) ||
    property.description.toLowerCase().includes(q.toLowerCase()) ||
    property.tags.some(tag => tag.toLowerCase().includes(q.toLowerCase()))
  );

  // Convert to Portuguese field names for frontend compatibility
  const resultsWithPortugueseFields = results.map(property => ({
    ...property,
    titulo: property.title,
    preco: property.price,
    imagens: property.images,
    localizacao: property.location,
    descricao: property.description,
    caracteristicas: property.features,
    tipo: property.type,
    finalidade: property.purpose,
    area: property.area,
    unidadeArea: property.areaUnit,
    quartos: property.rooms,
    banheiros: property.bathrooms,
    vagas: property.parking,
    coordenadas: property.coordinates,
    corretor: property.realtor,
    criadoEm: property.createdAt,
    visualizacoes: property.views,
    avaliacao: property.rating,
    avaliacoes: property.reviews,
    tags: property.tags
  }));

  res.json({
    success: true,
    data: resultsWithPortugueseFields,
    query: q,
    total: results.length
  });
});

// Configurações dos tenants
app.get('/api/tenants', (req, res) => {
  res.json({
    success: true,
    data: tenantConfigs
  });
});

// Configuração específica do tenant
app.get('/api/tenants/:id', (req, res) => {
  const tenant = tenantConfigs[req.params.id];

  if (!tenant) {
    return res.status(404).json({
      success: false,
      message: 'Tenant não encontrado'
    });
  }

  res.json({
    success: true,
    data: tenant
  });
});

// Estatísticas
app.get('/api/stats', (req, res) => {
  const stats = {
    totalProperties: mockProperties.length,
    propertiesByType: {
      farm: mockProperties.filter(p => p.type === 'farm').length,
      ranch: mockProperties.filter(p => p.type === 'ranch').length,
      land: mockProperties.filter(p => p.type === 'land').length,
      house: mockProperties.filter(p => p.type === 'house').length,
      apartment: mockProperties.filter(p => p.type === 'apartment').length
    },
    propertiesByPurpose: {
      sale: mockProperties.filter(p => p.purpose === 'sale').length,
      rent: mockProperties.filter(p => p.purpose === 'rent').length
    },
    averagePrice: Math.round(mockProperties.reduce((sum, p) => sum + p.price, 0) / mockProperties.length),
    totalViews: mockProperties.reduce((sum, p) => sum + p.views, 0)
  };

  res.json({
    success: true,
    data: stats
  });
});

// ROTAS DE ADMIN - Autenticação
app.post('/api/admin/login', (req, res) => {
  console.log('Tentativa de login:', req.body);
  const { email, password } = req.body;
  
  const validCredentials = [
    { email: 'admin@terrasparaguay.com', password: 'admin123', tenant: 'terras-paraguay' },
    { email: 'admin@cliente2.com', password: 'cliente123', tenant: 'cliente2' }
  ];
  
  const user = validCredentials.find(u => u.email === email && u.password === password);
  
  if (user) {
    res.json({
      success: true,
      token: `${user.tenant}-token-${Date.now()}`,
      user: { 
        id: 1, 
        email: user.email, 
        name: `Admin ${user.tenant}`,
        tenant: user.tenant 
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Email ou senha incorretos'
    });
  }
});

// ROTA DE DEBUG
app.get('/api/debug/routes', (req, res) => {
  const routesInfo = {
    availableRoutes: [
      'GET /api/health',
      'GET /api/properties',
      'GET /api/properties/:id',
      'GET /api/search',
      'GET /api/tenants',
      'GET /api/tenants/:id',
      'GET /api/stats',
      'POST /api/admin/login',
      'GET /api/debug/routes'
    ],
    corsConfig: {
      allowedOrigins: [
        'http://localhost:3003',
        'http://localhost:3000',
        'http://cliente2.localhost:3003'
      ]
    }
  };
  
  res.json({
    success: true,
    data: routesInfo
  });
});

// Rota principal com dashboard
app.get('/', (req, res) => {
  const stats = {
    totalProperties: mockProperties.length,
    totalViews: mockProperties.reduce((sum, p) => sum + p.views, 0),
    averagePrice: Math.round(mockProperties.reduce((sum, p) => sum + p.price, 0) / mockProperties.length)
  };

  res.send(`
    <html>
      <head>
        <title>Terras Paraguay API</title>
        <style>
          body { font-family: Arial; padding: 20px; background: #f5f5f5; }
          .header { background: #059669; color: white; padding: 20px; border-radius: 10px; text-align: center; }
          .stats { display: flex; gap: 20px; margin: 20px 0; }
          .stat { background: white; padding: 20px; border-radius: 8px; text-align: center; flex: 1; }
          .links { margin: 20px 0; }
          .link { display: inline-block; background: #059669; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; margin: 5px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Terras Paraguay API</h1>
          <p>Backend funcionando na porta ${PORT}</p>
        </div>
        <div class="stats">
          <div class="stat">
            <h3>${stats.totalProperties}</h3>
            <p>Propriedades</p>
          </div>
          <div class="stat">
            <h3>${stats.totalViews}</h3>
            <p>Total Views</p>
          </div>
          <div class="stat">
            <h3>$${stats.averagePrice.toLocaleString()}</h3>
            <p>Preço Médio</p>
          </div>
        </div>
        <div class="links">
          <a href="/api/properties" class="link">Ver Propriedades JSON</a>
          <a href="/api/stats" class="link">Ver Estatísticas</a>
          <a href="/api/debug/routes" class="link">Debug Rotas</a>
          <a href="http://localhost:3003" class="link">Ver Frontend</a>
        </div>
      </body>
    </html>
  `);
});

// Middleware de erro
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor'
  });
});

// Rota 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend Terras Paraguay rodando na porta ${PORT}`);
  console.log(`📍 Acesse: http://localhost:${PORT}`);
  console.log(`📋 Propriedades disponíveis: ${mockProperties.length}`);
  console.log(`🌐 CORS habilitado para: http://localhost:3003, http://localhost:3000`);
});