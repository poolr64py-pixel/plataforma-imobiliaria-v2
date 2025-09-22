
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
  },
  {
    id: 6,
    title: 'Mega Fazenda em Itapúa - 500 Hectares',
    price: 1250000,
    pricePerHectare: 2500,
    currency: 'USD',
    location: 'Encarnación, Itapúa - Paraguay',
    coordinates: { lat: -27.330, lng: -55.865 },
    area: 500,
    areaUnit: 'hectares',
    type: 'farm',
    purpose: 'sale',
    features: [
      'Solo classe I e II',
      'Rio com 2km de margem',
      'Infraestrutura completa',
      'Casa sede luxuosa',
      'Funcionários fixos',
      'Maquinário incluso',
      'Silos próprios',
      'Energia trifásica',
      'Escritório administrativo'
    ],
    description: 'Mega empreendimento rural com 500 hectares de terra de primeira qualidade. Fazenda estruturada e em plena produção, ideal para grandes investidores do agronegócio.',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1586436746790-a74dbb5a3bb4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1574708667725-2df80b7fe1a4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&h=600&fit=crop'
    ],
    tags: ['Mega Fazenda', 'Rio', 'Luxo', 'Produção', 'Silos'],
    realtor: {
      name: 'Roberto Salinas',
      phone: '+595971555000',
      email: 'roberto@terrasparaguay.com',
      whatsapp: '+595971555000'
    },
    createdAt: '2024-02-05',
    views: 456,
    rating: 5.0,
    reviews: 23
  },
  {
    id: 7,
    title: 'Chácara de Lazer em Caacupé',
    price: 75000,
    pricePerHectare: 15000,
    currency: 'USD',
    location: 'Caacupé, Cordillera - Paraguay',
    coordinates: { lat: -25.388, lng: -57.140 },
    area: 5,
    areaUnit: 'hectares',
    type: 'farm',
    purpose: 'sale',
    features: [
      'Casa de campo rústica',
      'Piscina natural',
      'Área de churrasco',
      'Pomar com frutas nativas',
      'Trilhas ecológicas',
      'Vista para montanhas',
      'Energia solar',
      'Poço artesiano'
    ],
    description: 'Chácara perfeita para lazer e descanso na bela região de Caacupé. Ambiente natural preservado com infraestrutura para momentos em família.',
    images: [
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
    ],
    tags: ['Lazer', 'Chácara', 'Piscina', 'Natureza', 'Família'],
    realtor: {
      name: 'Lucia Ramirez',
      phone: '+595983456789',
      email: 'lucia@terrasparaguay.com',
      whatsapp: '+595983456789'
    },
    createdAt: '2024-02-10',
    views: 89,
    rating: 4.4,
    reviews: 7
  },
  {
    id: 8,
    title: 'Duplex Luxo em Ciudad del Este',
    price: 180000,
    pricePerM2: 1500,
    currency: 'USD',
    location: 'Ciudad del Este, Alto Paraná - Paraguay',
    coordinates: { lat: -25.507, lng: -54.616 },
    area: 120,
    areaUnit: 'm²',
    rooms: 4,
    bathrooms: 3,
    parking: 2,
    type: 'house',
    purpose: 'sale',
    features: [
      'Duplex de luxo',
      'Acabamentos importados',
      'Condomínio fechado',
      'Piscina comunitária',
      'Academia',
      'Salão de festas',
      'Segurança 24h',
      'Próximo ao centro comercial'
    ],
    description: 'Duplex de alto padrão em Ciudad del Este, fronteira com Brasil e Argentina. Perfeito para quem busca conforto e proximidade com centros comerciais.',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
    ],
    tags: ['Duplex', 'Luxo', 'Fronteira', 'Condomínio', 'Shopping'],
    realtor: {
      name: 'Fernando Lopez',
      phone: '+595985123456',
      email: 'fernando@terrasparaguay.com',
      whatsapp: '+595985123456'
    },
    createdAt: '2024-02-12',
    views: 167,
    rating: 4.7,
    reviews: 11
  },
  {
    id: 9,
    title: 'Lote Urbano em Lambaré',
    price: 45000,
    pricePerM2: 450,
    currency: 'USD',
    location: 'Lambaré, Central - Paraguay',
    coordinates: { lat: -25.342, lng: -57.628 },
    area: 100,
    areaUnit: 'm²',
    type: 'land',
    purpose: 'sale',
    features: [
      'Lote plano',
      'Frente para rua principal',
      'Documentação em dia',
      'Água e luz disponível',
      'Próximo a escolas',
      'Transporte público',
      'Área em valorização',
      'Pronto para construir'
    ],
    description: 'Excelente lote urbano em Lambaré para construção de casa própria ou investimento. Localização estratégica com boa infraestrutura.',
    images: [
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1566403777403-50bbfd3138b9?w=800&h=600&fit=crop'
    ],
    tags: ['Lote', 'Urbano', 'Investimento', 'Construção'],
    realtor: {
      name: 'Carmen Benitez',
      phone: '+595987654321',
      email: 'carmen@terrasparaguay.com',
      whatsapp: '+595987654321'
    },
    createdAt: '2024-02-15',
    views: 78,
    rating: 4.3,
    reviews: 5
  },
  {
    id: 10,
    title: 'Casa para Aluguel em Villa Elisa',
    price: 1200,
    pricePerM2: 10,
    currency: 'USD',
    location: 'Villa Elisa, Central - Paraguay',
    coordinates: { lat: -25.372, lng: -57.590 },
    area: 120,
    areaUnit: 'm²',
    rooms: 3,
    bathrooms: 2,
    parking: 1,
    type: 'house',
    purpose: 'rent',
    features: [
      'Casa completa mobilada',
      'Jardim amplo',
      'Área gourmet',
      'Internet fibra óptica',
      'Ar condicionado',
      'Próximo a universidades',
      'Bairro residencial',
      'Fácil acesso'
    ],
    description: 'Casa completa para aluguel em Villa Elisa. Ideal para famílias ou executivos que buscam conforto em bairro tranquilo e bem localizado.',
    images: [
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'
    ],
    tags: ['Aluguel', 'Mobilada', 'Família', 'Jardim'],
    realtor: {
      name: 'Miguel Santos',
      phone: '+595989876543',
      email: 'miguel@terrasparaguay.com',
      whatsapp: '+595989876543'
    },
    createdAt: '2024-02-18',
    views: 45,
    rating: 4.2,
    reviews: 3
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

// Rotas da API

// Rota principal - Interface Web do Backend
app.get('/', (req, res) => {
  const stats = {
    totalProperties: mockProperties.length,
    propertiesByType: {
      farm: mockProperties.filter(p => p.type === 'farm').length,
      ranch: mockProperties.filter(p => p.type === 'ranch').length,
      land: mockProperties.filter(p => p.type === 'land').length,
      house: mockProperties.filter(p => p.type === 'house').length,
      apartment: mockProperties.filter(p => p.type === 'apartment').length
    },
    totalViews: mockProperties.reduce((sum, p) => sum + p.views, 0),
    averagePrice: Math.round(mockProperties.reduce((sum, p) => sum + p.price, 0) / mockProperties.length)
  };

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Terras Paraguay API - Painel Administrativo</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                min-height: 100vh;
                padding: 20px;
            }
            .container {
                max-width: 1200px;
                margin: 0 auto;
            }
            .header {
                background: linear-gradient(135deg, #059669 0%, #047857 100%);
                color: white;
                padding: 30px;
                border-radius: 15px;
                text-align: center;
                margin-bottom: 30px;
                box-shadow: 0 8px 25px rgba(5, 150, 105, 0.3);
            }
            .header h1 {
                font-size: 2.5em;
                margin-bottom: 10px;
            }
            .header p {
                font-size: 1.2em;
                opacity: 0.9;
            }
            .status-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }
            .status-card {
                background: white;
                padding: 25px;
                border-radius: 12px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                text-align: center;
                transition: transform 0.3s ease;
            }
            .status-card:hover {
                transform: translateY(-5px);
            }
            .status-card .icon {
                font-size: 3em;
                margin-bottom: 15px;
            }
            .status-card .number {
                font-size: 2.5em;
                font-weight: bold;
                color: #059669;
                margin-bottom: 10px;
            }
            .status-card .label {
                color: #666;
                font-size: 1.1em;
            }
            .endpoints-section {
                background: white;
                padding: 30px;
                border-radius: 12px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                margin-bottom: 30px;
            }
            .endpoints-section h2 {
                color: #059669;
                margin-bottom: 20px;
                font-size: 1.8em;
            }
            .endpoint {
                display: flex;
                align-items: center;
                padding: 15px;
                margin-bottom: 10px;
                background: #f8f9fa;
                border-radius: 8px;
                border-left: 4px solid #059669;
            }
            .endpoint .method {
                background: #059669;
                color: white;
                padding: 5px 12px;
                border-radius: 20px;
                font-weight: bold;
                margin-right: 15px;
                font-size: 0.9em;
            }
            .endpoint .url {
                font-family: 'Courier New', monospace;
                font-weight: bold;
                flex: 1;
            }
            .endpoint .description {
                color: #666;
                font-style: italic;
            }
            .properties-preview {
                background: white;
                padding: 30px;
                border-radius: 12px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            }
            .properties-preview h2 {
                color: #059669;
                margin-bottom: 20px;
                font-size: 1.8em;
            }
            .property-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px;
                margin-bottom: 10px;
                background: #f8f9fa;
                border-radius: 8px;
                border-left: 4px solid #fbbf24;
            }
            .property-title {
                font-weight: bold;
                color: #2c3e50;
            }
            .property-price {
                color: #059669;
                font-weight: bold;
                font-size: 1.1em;
            }
            .footer {
                text-align: center;
                margin-top: 40px;
                padding: 20px;
                color: #666;
            }
            .test-buttons {
                display: flex;
                gap: 10px;
                justify-content: center;
                margin-top: 20px;
                flex-wrap: wrap;
            }
            .test-btn {
                background: #059669;
                color: white;
                padding: 10px 20px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                text-decoration: none;
                font-weight: bold;
                transition: background 0.3s;
            }
            .test-btn:hover {
                background: #047857;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <header class="header">
                <h1>🌱 Terras Paraguay API</h1>
                <p>Painel Administrativo - Backend API</p>
                <div style="background: rgba(255,255,255,0.2); padding: 10px; border-radius: 8px; margin-top: 15px;">
                    <strong>Status:</strong> ✅ Online | <strong>Porta:</strong> ${PORT} | <strong>Versão:</strong> 1.0.0
                </div>
            </header>

            <div class="status-grid">
                <div class="status-card">
                    <div class="icon">🏡</div>
                    <div class="number">${stats.totalProperties}</div>
                    <div class="label">Total de Propriedades</div>
                </div>
                <div class="status-card">
                    <div class="icon">👀</div>
                    <div class="number">${stats.totalViews.toLocaleString()}</div>
                    <div class="label">Total de Visualizações</div>
                </div>
                <div class="status-card">
                    <div class="icon">💰</div>
                    <div class="number">$${stats.averagePrice.toLocaleString()}</div>
                    <div class="label">Preço Médio (USD)</div>
                </div>
                <div class="status-card">
                    <div class="icon">📊</div>
                    <div class="number">${Object.values(stats.propertiesByType).reduce((a,b) => a+b, 0)}</div>
                    <div class="label">Tipos Diferentes</div>
                </div>
            </div>

            <section class="endpoints-section">
                <h2>📡 Endpoints da API</h2>
                <div class="endpoint">
                    <span class="method">GET</span>
                    <span class="url">/api/health</span>
                    <span class="description">Verificação de saúde da API</span>
                </div>
                <div class="endpoint">
                    <span class="method">GET</span>
                    <span class="url">/api/properties</span>
                    <span class="description">Lista todas as propriedades (com filtros)</span>
                </div>
                <div class="endpoint">
                    <span class="method">GET</span>
                    <span class="url">/api/properties/:id</span>
                    <span class="description">Detalhes de uma propriedade específica</span>
                </div>
                <div class="endpoint">
                    <span class="method">GET</span>
                    <span class="url">/api/search?q=termo</span>
                    <span class="description">Busca propriedades por termo</span>
                </div>
                <div class="endpoint">
                    <span class="method">GET</span>
                    <span class="url">/api/stats</span>
                    <span class="description">Estatísticas gerais do sistema</span>
                </div>
                <div class="endpoint">
                    <span class="method">GET</span>
                    <span class="url">/api/tenants</span>
                    <span class="description">Configurações dos tenants</span>
                </div>

                <div class="test-buttons">
                    <a href="/api/properties" class="test-btn" target="_blank">Ver Propriedades JSON</a>
                    <a href="/api/stats" class="test-btn" target="_blank">Ver Estatísticas</a>
                    <a href="/api/search?q=fazenda" class="test-btn" target="_blank">Buscar "fazenda"</a>
                    <a href="http://localhost:3003" class="test-btn" target="_blank">🌐 Ver Frontend</a>
                </div>
            </section>

            <section class="properties-preview">
                <h2>🏡 Propriedades Cadastradas</h2>
                ${mockProperties.map(property => `
                    <div class="property-item">
                        <div>
                            <div class="property-title">${property.title}</div>
                            <div style="color: #666; font-size: 0.9em;">📍 ${property.location}</div>
                        </div>
                        <div class="property-price">${property.currency} ${property.price.toLocaleString()}</div>
                    </div>
                `).join('')}
            </section>

            <footer class="footer">
                <p>© 2025 Terras Paraguay - API Backend</p>
                <p>🔧 Desenvolvido para gestão de propriedades imobiliárias</p>
            </footer>
        </div>

        <script>
            console.log('🌱 Terras Paraguay API Dashboard carregado!');
            console.log('📊 Estatísticas:', ${JSON.stringify(stats)});
        </script>
    </body>
    </html>
  `;

  res.send(html);
});

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

// Sitemap Routes
const sitemapRoutes = require('./routes/sitemap');
app.use('/api', sitemapRoutes);

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