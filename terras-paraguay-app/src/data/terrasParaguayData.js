// src/data/terrasParaguayData.js
export const paraguayProperties = [
  {
    id: 1,
    title: 'Casa Moderna em Asunción',
    price: 180000, // USD
    priceLocal: 1350000000, // Guaranis
    pricePerM2: 1200,
    marketComparison: 8,
    location: 'Villa Morra, Asunción - Paraguay',
    area: 150,
    rooms: 3,
    bathrooms: 2,
    parking: 2,
    type: 'house',
    purpose: 'sale',
    rating: 4.7,
    reviews: 15,
    views: 89,
    tags: ['Novo', 'Financiamento', 'Villa Morra'],
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop'
    ],
    description: 'Casa moderna em uma das áreas mais valorizadas de Asunción. Acabamento de primeira qualidade, próxima a shopping centers e escolas internacionais. Documentação regularizada e financiamento disponível.',
    features: [
      'Área gourmet completa',
      'Piscina com deck',
      'Sistema de segurança',
      'Ar condicionado central',
      'Garagem coberta para 2 carros',
      'Quintal paisagístico',
      'Próximo ao Shopping del Sol',
      'Documentação regular'
    ],
    neighborhood: {
      schools: ['Colégio Internacional', 'American School'],
      hospitals: ['Hospital Italiano', 'Sanatorio Migone'],
      shopping: ['Shopping del Sol', 'Paseo La Galería'],
      restaurants: ['Paulista Grill', 'Bolsi', 'Talleyrand']
    },
    financing: {
      available: true,
      downPayment: '30%',
      maxYears: 20,
      bank: 'Banco Continental'
    },
    realtor: {
      name: 'Carlos Rodriguez',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      phone: '+595 21 123456',
      whatsapp: '+595 981 123456',
      email: 'carlos@terrasnoparaguay.com',
      languages: ['Português', 'Español', 'English']
    }
  },
  {
    id: 2,
    title: 'Apartamento Luxo Torre Centenario',
    price: 320000, // USD
    priceLocal: 2400000000, // Guaranis
    pricePerM2: 2500,
    marketComparison: 5,
    location: 'Centro, Asunción - Paraguay',
    area: 128,
    rooms: 2,
    bathrooms: 2,
    parking: 1,
    floor: 18,
    type: 'apartment',
    purpose: 'sale',
    rating: 4.9,
    reviews: 23,
    views: 156,
    tags: ['Luxo', 'Vista Río', 'Torre Centenario'],
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop'
    ],
    description: 'Apartamento de alto padrão na icônica Torre Centenario. Vista panorâmica do Rio Paraguay e da cidade. Localização privilegiada no coração de Asunción com acesso fácil a tudo.',
    features: [
      'Vista panorâmica Rio Paraguay',
      'Varanda gourmet',
      'Acabamentos importados',
      'Piso porcelanato',
      'Cozinha planejada',
      'Portaria 24h',
      'Academia no prédio',
      'Piscina infinity'
    ],
    financing: {
      available: true,
      downPayment: '40%',
      maxYears: 15,
      bank: 'Itaú Paraguay'
    },
    realtor: {
      name: 'Maria Gonzalez',
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      phone: '+595 21 654321',
      whatsapp: '+595 982 654321',
      email: 'maria@terrasnoparaguay.com',
      languages: ['Português', 'Español']
    }
  },
  {
    id: 3,
    title: 'Fazenda Produtiva - Soja/Milho',
    price: 850000, // USD
    priceLocal: 6375000000, // Guaranis
    pricePerHectare: 4250,
    marketComparison: -5,
    location: 'Capitán Bado, Amambay - Paraguay',
    area: 200, // hectares
    type: 'farm',
    purpose: 'sale',
    rating: 4.8,
    reviews: 8,
    views: 67,
    tags: ['Produtiva', 'Soja', 'Financiamento Rural'],
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop'
    ],
    description: 'Fazenda altamente produtiva com 200 hectares de terra de primeira qualidade. Histórico de produção de soja e milho. Infraestrutura completa e localização estratégica próxima à fronteira com Brasil.',
    features: [
      'Solo de primeira qualidade',
      'Topografia plana',
      'Acesso principal asfaltado',
      'Energia elétrica trifásica',
      'Poço artesiano',
      'Casa de administrador',
      'Galpões para maquinário',
      'Histórico produtivo comprovado'
    ],
    production: {
      crops: ['Soja', 'Milho', 'Trigo'],
      productivity: '3.2 ton/hectare (soja)',
      lastHarvest: 'R$ 320.000 bruto',
      waterSource: 'Poço artesiano + chuva'
    },
    financing: {
      available: true,
      downPayment: '50%',
      maxYears: 10,
      bank: 'Banco Nacional de Fomento'
    },
    realtor: {
      name: 'João Silva',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      phone: '+595 21 789123',
      whatsapp: '+595 983 789123',
      email: 'joao@terrasnoparaguay.com',
      speciality: 'Propriedades Rurais',
      languages: ['Português', 'Español']
    }
  },
  {
    id: 4,
    title: 'Duplex Moderno Ciudad del Este',
    price: 145000, // USD
    priceLocal: 1087500000, // Guaranis
    pricePerM2: 1150,
    marketComparison: 12,
    location: 'Centro, Ciudad del Este - Paraguay',
    area: 126,
    rooms: 3,
    bathrooms: 3,
    parking: 2,
    type: 'duplex',
    purpose: 'sale',
    rating: 4.6,
    reviews: 19,
    views: 203,
    tags: ['Duplex', 'Centro CDE', 'Oportunidade'],
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=600&fit=crop'
    ],
    description: 'Duplex moderno no centro de Ciudad del Este. Projeto arquitetônico inovador com 2 pavimentos e excelente localização comercial. Ideal para moradia ou investimento.',
    features: [
      '2 pavimentos independentes',
      'Entrada individual por andar',
      'Terraço no último piso',
      'Área de churrasqueira',
      '2 vagas cobertas',
      'Próximo ao centro comercial',
      'Documentação regular',
      'Aceita financiamento'
    ],
    investment: {
      rentalYield: '8.5% ao ano',
      rentalPrice: 1200, // USD/mês
      occupancyRate: '95%',
      paybackYears: 12
    },
    realtor: {
      name: 'Ana Pereira',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      phone: '+595 61 456789',
      whatsapp: '+595 984 456789',
      email: 'ana@terrasnoparaguay.com',
      languages: ['Português', 'Español', 'English']
    }
  },
  {
    id: 5,
    title: 'Lote Residencial Premium - Luque',
    price: 75000, // USD
    priceLocal: 562500000, // Guaranis
    pricePerM2: 125,
    marketComparison: 15,
    location: 'Luque, Central - Paraguay',
    area: 600, // m²
    type: 'land',
    purpose: 'sale',
    rating: 4.4,
    reviews: 12,
    views: 134,
    tags: ['Lote', 'Condomínio', 'Luque'],
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop'
    ],
    description: 'Lote de 600m² em condomínio fechado em Luque. Infraestrutura completa, segurança 24h e área verde preservada. Excelente para construção de casa dos sonhos.',
    features: [
      '600m² de área total',
      'Condomínio fechado',
      'Segurança 24 horas',
      'Todas as utilidades',
      'Área verde preservada',
      'Próximo ao aeroporto',
      'Fácil acesso a Asunción',
      'Documentação limpa'
    ],
    infrastructure: {
      water: 'Rede pública',
      electricity: 'ANDE disponível',
      sewage: 'Sistema tratamento',
      internet: 'Fibra ótica',
      security: '24h + câmeras'
    },
    financing: {
      available: true,
      downPayment: '30%',
      maxYears: 8,
      bank: 'Vision Banco'
    },
    realtor: {
      name: 'Roberto Medina',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      phone: '+595 21 234567',
      whatsapp: '+595 985 234567',
      email: 'roberto@terrasnoparaguay.com',
      languages: ['Português', 'Español']
    }
  },
  {
    id: 6,
    title: 'Estância para Gado - San Pedro',
    price: 1200000, // USD
    priceLocal: 9000000000, // Guaranis
    pricePerHectare: 2000,
    marketComparison: -8,
    location: 'San Pedro de Ycuamandiyú - Paraguay',
    area: 600, // hectares
    type: 'ranch',
    purpose: 'sale',
    rating: 4.9,
    reviews: 6,
    views: 45,
    tags: ['Pecuária', 'San Pedro', 'Grande Porte'],
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800&h=600&fit=crop'
    ],
    description: 'Estância de 600 hectares para pecuária em San Pedro. Terra de excelente qualidade com pastagens nativas e cultivadas. Infraestrutura completa para gado e gestão da propriedade.',
    features: [
      '600 hectares total',
      'Pastagens cultivadas',
      'Aguadas naturais',
      'Casa sede renovada',
      'Currais modernos',
      'Manga de apartação',
      'Balança para gado',
      'Energia solar'
    ],
    cattle: {
      capacity: '1200 cabeças',
      currentStock: '800 cabeças (opcional)',
      breed: 'Nelore e cruzamentos',
      pastures: '80% cultivado'
    },
    financing: {
      available: true,
      downPayment: '60%',
      maxYears: 12,
      bank: 'Banco Regional'
    },
    realtor: {
      name: 'Fernando Ayala',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      phone: '+595 342 123456',
      whatsapp: '+595 986 123456',
      email: 'fernando@terrasnoparaguay.com',
      speciality: 'Propriedades Rurais',
      languages: ['Português', 'Español', 'Guaraní']
    }
  }
];

export const paraguayConfig = {
  company: {
    name: 'Terras no Paraguay',
    slogan: 'Seu Imóvel dos Sonhos no Coração da América do Sul',
    description: 'Especialistas em imóveis no Paraguay há mais de 15 anos. Casas, apartamentos, fazendas e lotes com documentação regularizada e financiamento disponível.',
    founded: 2008,
    properties: '500+',
    clients: '2000+',
    languages: ['Português', 'Español', 'English', 'Guaraní']
  },

  contact: {
    headquarters: {
      address: 'Av. Brasília 1234, Asunción - Paraguay',
      phone: '+595 21 123456',
      whatsapp: '+595 981 123456',
      email: 'contato@terrasnoparaguay.com'
    },
    branches: [
      {
        city: 'Ciudad del Este',
        address: 'Av. Pioneros del Este 567',
        phone: '+595 61 234567',
        whatsapp: '+595 982 234567'
      },
      {
        city: 'Encarnación',
        address: 'Calle Mariscal López 890',
        phone: '+595 71 345678',
        whatsapp: '+595 983 345678'
      }
    ]
  },

  currency: {
    primary: 'USD',
    local: 'PYG',
    exchangeRate: 7500, // Aprox. 1 USD = 7500 PYG
    symbol: '$',
    localSymbol: '₲'
  },

  regions: [
    {
      name: 'Asunción',
      type: 'Capital',
      description: 'Centro político e econômico',
      averagePrice: 1800, // USD/m²
      growth: '+12% ao ano'
    },
    {
      name: 'Central',
      type: 'Departamento',
      description: 'Região metropolitana',
      averagePrice: 1200,
      growth: '+8% ao ano'
    },
    {
      name: 'Ciudad del Este',
      type: 'Cidade',
      description: 'Centro comercial da fronteira',
      averagePrice: 950,
      growth: '+15% ao ano'
    },
    {
      name: 'Itapúa',
      type: 'Departamento',
      description: 'Região agrícola próspera',
      averagePrice: 800,
      growth: '+10% ao ano'
    }
  ],

  advantages: [
    {
      icon: '💰',
      title: 'Preços Atrativos',
      description: 'Imóveis com excelente custo-benefício comparado ao Brasil'
    },
    {
      icon: '📋',
      title: 'Documentação Legal',
      description: 'Todos os imóveis com documentação regularizada'
    },
    {
      icon: '🏦',
      title: 'Financiamento',
      description: 'Parcerias com principais bancos do Paraguay'
    },
    {
      icon: '🇧🇷',
      title: 'Atendimento em Português',
      description: 'Equipe especializada para clientes brasileiros'
    },
    {
      icon: '🛡️',
      title: 'Segurança Jurídica',
      description: 'Assessoria legal completa para estrangeiros'
    },
    {
      icon: '🌱',
      title: 'Potencial de Valorização',
      description: 'Mercado em crescimento com alto potencial'
    }
  ],

  services: [
    'Venda de Imóveis Residenciais',
    'Propriedades Rurais e Fazendas', 
    'Lotes e Terrenos',
    'Consultoria em Investimentos',
    'Assessoria Jurídica',
    'Financiamento Imobiliário',
    'Gestão de Propriedades',
    'Due Diligence'
  ],

  seo: {
    keywords: [
      'imóveis paraguay',
      'casas asunción',
      'apartamentos paraguay',
      'fazendas paraguay',
      'investir paraguay',
      'terras paraguay',
      'propriedades rurais',
      'imóveis ciudad del este'
    ],
    locations: [
      'Asunción',
      'Ciudad del Este', 
      'Encarnación',
      'Luque',
      'San Lorenzo',
      'Lambaré',
      'Fernando de la Mora'
    ]
  }
};