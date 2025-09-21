/**
 * Servidor demo para testar APIs sem PostgreSQL
 * Simula o comportamento do sistema multi-tenant
 */

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data - Tenant Terras Paraguay
const terrasParaguayTenant = {
  id: "uuid-terras-paraguay",
  slug: "terras-paraguay",
  name: "Terras no Paraguay",
  domain: "terrasparaguay.com",
  status: "active",
  plan: "professional",
  branding: {
    logo: "/assets/terras-paraguay/logo.png",
    colors: {
      primary: "#22c55e",
      secondary: "#15803d",
      accent: "#fbbf24"
    },
    fonts: ["Inter", "sans-serif"]
  },
  business_config: {
    property_types: ["house", "apartment", "duplex", "farm", "ranch", "land", "commercial", "warehouse", "townhouse"],
    currencies: ["USD", "PYG", "BRL"],
    currencies_config: {
      primary: "USD",
      secondary: "PYG",
      tertiary: "BRL",
      exchange_rates: {
        "USD_PYG": 7500,
        "USD_BRL": 5.2,
        "PYG_BRL": 0.00069
      }
    },
    languages: ["pt", "es"],
    countries: ["PY", "BR"],
    business_focus: "full_service_realty",
    specialties: [
      "imóveis_residenciais",
      "propriedades_comerciais",
      "terrenos_urbanos_rurais",
      "fazendas_estâncias",
      "investimento_internacional",
      "assessoria_completa_brasileiros"
    ]
  },
  contact_info: {
    phone: "+595 21 123456",
    whatsapp: "+595 981 123456",
    email: "contato@terrasnoparaguay.com",
    address: "Av. Brasília 1234, Asunción - Paraguay"
  },
  features: {
    virtual_tour_360: true,
    crm: true,
    marketing_ai: false,
    video_ai: true,
    advanced_analytics: true,
    white_label_removal: true,
    multi_currency: true,
    multi_language: true
  },
  seo_config: {
    meta_title: "Terras no Paraguay - Imóveis e Investimentos",
    meta_description: "Encontre as melhores oportunidades de investimento imobiliário no Paraguay.",
    structured_data: true
  }
};

// Mock data - Properties
const properties = [
  {
    id: 1,
    tenant_id: "uuid-terras-paraguay",
    title: "Fazenda Produtiva - Soja e Milho",
    slug: "fazenda-produtiva-soja-milho",
    description: "Fazenda de 200 hectares altamente produtiva em Capitán Bado, Amambay. Solo de primeira qualidade.",
    property_type: "farm",
    purpose: "sale",
    status: "active",
    pricing: {
      sale_price: 850000,
      currency_primary: "USD",
      price_per_hectare: 4250,
      local_prices: {
        PYG: 6375000000,
        BRL: 4420000
      }
    },
    location: {
      address: "Ruta 5, Km 45, Capitán Bado",
      city: "Capitán Bado",
      state: "Amambay",
      country: "PY"
    },
    features: {
      area_total: 200,
      area_unit: "hectares",
      bedrooms: 4,
      bathrooms: 2
    },
    is_featured: true,
    created_at: new Date()
  },
  {
    id: 2,
    tenant_id: "uuid-terras-paraguay",
    title: "Casa Moderna em Asunción - Villa Morra",
    slug: "casa-moderna-asuncion-villa-morra",
    description: "Casa moderna de 150m² em Villa Morra. Acabamento de primeira qualidade.",
    property_type: "house",
    purpose: "sale",
    status: "active",
    pricing: {
      sale_price: 180000,
      currency_primary: "USD",
      price_per_m2: 1200,
      local_prices: {
        PYG: 1350000000,
        BRL: 936000
      }
    },
    location: {
      address: "Calle Últimas Noticias 1234",
      city: "Asunción",
      state: "Asunción",
      country: "PY"
    },
    features: {
      area_total: 600,
      area_built: 150,
      area_unit: "m2",
      bedrooms: 3,
      bathrooms: 2,
      parking_spaces: 2
    },
    is_featured: true,
    created_at: new Date()
  },
  {
    id: 3,
    tenant_id: "uuid-terras-paraguay",
    title: "Apartamento Luxo Torre Centenario",
    slug: "apartamento-luxo-torre-centenario",
    description: "Apartamento de alto padrão na Torre Centenario com vista panorâmica.",
    property_type: "apartment",
    purpose: "sale",
    status: "active",
    pricing: {
      sale_price: 320000,
      currency_primary: "USD",
      price_per_m2: 2500,
      local_prices: {
        PYG: 2400000000,
        BRL: 1664000
      }
    },
    location: {
      address: "Av. Brasília 1430, Torre Centenario",
      city: "Asunción",
      state: "Asunción",
      country: "PY"
    },
    features: {
      area_built: 128,
      area_unit: "m2",
      bedrooms: 2,
      bathrooms: 2,
      parking_spaces: 1,
      floor: 18
    },
    is_featured: true,
    created_at: new Date()
  },
  {
    id: 4,
    tenant_id: "uuid-terras-paraguay",
    title: "Sala Comercial Centro Empresarial",
    slug: "sala-comercial-centro-empresarial",
    description: "Moderna sala comercial em centro empresarial de Asunción.",
    property_type: "commercial",
    purpose: "sale",
    status: "active",
    pricing: {
      sale_price: 85000,
      rent_price: 1200,
      currency_primary: "USD",
      price_per_m2: 1417,
      local_prices: {
        PYG: 637500000,
        BRL: 442000
      }
    },
    location: {
      address: "Av. República Argentina, WTC",
      city: "Asunción",
      state: "Asunción",
      country: "PY"
    },
    features: {
      area_built: 60,
      area_unit: "m2",
      rooms: 3,
      bathrooms: 1,
      parking_spaces: 1,
      floor: 12
    },
    is_featured: false,
    created_at: new Date()
  },
  {
    id: 5,
    tenant_id: "uuid-terras-paraguay",
    title: "Galpão Industrial - Zona Franca",
    slug: "galpao-industrial-zona-franca",
    description: "Galpão industrial estratégicamente localizado na zona franca.",
    property_type: "warehouse",
    purpose: "rent",
    status: "active",
    pricing: {
      sale_price: 450000,
      rent_price: 3500,
      currency_primary: "USD",
      price_per_m2: 450,
      local_prices: {
        PYG: 3375000000,
        BRL: 2340000
      }
    },
    location: {
      address: "Zona Franca de Asunción",
      city: "Asunción",
      state: "Asunción",
      country: "PY"
    },
    features: {
      area_total: 2000,
      area_built: 1000,
      area_unit: "m2",
      height: 8
    },
    is_featured: false,
    created_at: new Date()
  }
];

// Middleware para resolver tenant
app.use((req, res, next) => {
  const tenantSlug = req.headers['x-tenant-slug'] || req.query.tenant;

  if (tenantSlug === 'terras-paraguay') {
    req.tenant = terrasParaguayTenant;
    req.tenantId = terrasParaguayTenant.id;
  }

  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    tenant: req.tenant?.slug || 'no-tenant',
    message: 'Demo server running - Plataforma White-Label Imobiliária'
  });
});

// GET /api/tenants/config
app.get('/api/tenants/config', (req, res) => {
  if (!req.tenant) {
    return res.status(400).json({
      error: 'Tenant not found',
      hint: 'Use ?tenant=terras-paraguay parameter'
    });
  }

  const config = {
    id: req.tenant.id,
    slug: req.tenant.slug,
    name: req.tenant.name,
    domain: req.tenant.domain,
    branding: req.tenant.branding,
    business_config: req.tenant.business_config,
    contact_info: req.tenant.contact_info,
    seo_config: req.tenant.seo_config,
    features_public: {
      virtual_tour_360: req.tenant.features.virtual_tour_360,
      multi_currency: req.tenant.features.multi_currency,
      multi_language: req.tenant.features.multi_language
    }
  };

  res.json(config);
});

// GET /api/properties
app.get('/api/properties', (req, res) => {
  if (!req.tenant) {
    return res.status(400).json({
      error: 'Tenant required',
      hint: 'Use ?tenant=terras-paraguay parameter'
    });
  }

  let filtered = properties.filter(p => p.tenant_id === req.tenant.id);

  // Filtros
  if (req.query.property_type) {
    filtered = filtered.filter(p => p.property_type === req.query.property_type);
  }

  if (req.query.purpose) {
    filtered = filtered.filter(p => p.purpose === req.query.purpose);
  }

  if (req.query.city) {
    filtered = filtered.filter(p =>
      p.location.city.toLowerCase().includes(req.query.city.toLowerCase())
    );
  }

  if (req.query.search) {
    const search = req.query.search.toLowerCase();
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(search) ||
      p.description.toLowerCase().includes(search) ||
      p.location.city.toLowerCase().includes(search)
    );
  }

  // Paginação
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  const paginatedProperties = filtered.slice(offset, offset + limit);

  res.json({
    properties: paginatedProperties,
    pagination: {
      page,
      limit,
      total: filtered.length,
      pages: Math.ceil(filtered.length / limit)
    }
  });
});

// GET /api/properties/:id
app.get('/api/properties/:id', (req, res) => {
  if (!req.tenant) {
    return res.status(400).json({ error: 'Tenant required' });
  }

  const property = properties.find(p =>
    p.id == req.params.id && p.tenant_id === req.tenant.id
  );

  if (!property) {
    return res.status(404).json({ error: 'Property not found' });
  }

  res.json(property);
});

// GET /api/tenants/stats
app.get('/api/tenants/stats', (req, res) => {
  if (!req.tenant) {
    return res.status(400).json({ error: 'Tenant required' });
  }

  const tenantProperties = properties.filter(p => p.tenant_id === req.tenant.id);

  const stats = {
    total_properties: tenantProperties.length,
    property_types: tenantProperties.reduce((acc, p) => {
      acc[p.property_type] = (acc[p.property_type] || 0) + 1;
      return acc;
    }, {}),
    cities: tenantProperties.reduce((acc, p) => {
      acc[p.location.city] = (acc[p.location.city] || 0) + 1;
      return acc;
    }, {}),
    featured_properties: tenantProperties.filter(p => p.is_featured).length
  };

  res.json(stats);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Demo Server rodando na porta ${PORT}`);
  console.log(`📱 URLs de teste:`);
  console.log(`├── Health: http://localhost:${PORT}/health`);
  console.log(`├── Tenant: http://localhost:${PORT}/api/tenants/config?tenant=terras-paraguay`);
  console.log(`├── Properties: http://localhost:${PORT}/api/properties?tenant=terras-paraguay`);
  console.log(`├── Stats: http://localhost:${PORT}/api/tenants/stats?tenant=terras-paraguay`);
  console.log(`└── Fazendas: http://localhost:${PORT}/api/properties?tenant=terras-paraguay&property_type=farm`);
  console.log(`\n🎯 Tenant configurado: "terras-paraguay"`);
  console.log(`🏠 ${properties.length} propriedades de teste carregadas`);
});

module.exports = app;