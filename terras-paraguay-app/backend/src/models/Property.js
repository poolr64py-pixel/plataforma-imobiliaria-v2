const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Property = sequelize.define('Property', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  tenant_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'tenants',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [5, 200]
    }
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  property_type: {
    type: DataTypes.ENUM('house', 'apartment', 'duplex', 'farm', 'ranch', 'land', 'commercial', 'warehouse', 'townhouse'),
    allowNull: false
  },
  purpose: {
    type: DataTypes.ENUM('sale', 'rent', 'lease'),
    defaultValue: 'sale'
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'sold', 'rented', 'reserved'),
    defaultValue: 'active'
  },

  // Preços em diferentes moedas
  pricing: {
    type: DataTypes.JSONB,
    defaultValue: {
      sale_price: null,
      rent_price: null,
      currency_primary: 'BRL',
      currency_secondary: null,
      price_per_m2: null,
      price_per_hectare: null
    }
  },

  // Localização
  location: {
    type: DataTypes.JSONB,
    defaultValue: {
      address: null,
      neighborhood: null,
      city: null,
      state: null,
      country: 'BR',
      postal_code: null,
      coordinates: {
        lat: null,
        lng: null
      }
    }
  },

  // Características da propriedade
  features: {
    type: DataTypes.JSONB,
    defaultValue: {
      area_total: null,
      area_built: null,
      area_unit: 'm2', // m2 ou hectares
      rooms: null,
      bedrooms: null,
      bathrooms: null,
      parking_spaces: null,
      floor: null,
      floors_total: null,
      year_built: null,
      condition: null // novo, usado, reformado
    }
  },

  // Amenidades e características especiais
  amenities: {
    type: DataTypes.JSONB,
    defaultValue: {
      internal: [],
      external: [],
      neighborhood: [],
      security: []
    }
  },

  // Mídia
  media: {
    type: DataTypes.JSONB,
    defaultValue: {
      images: [],
      videos: [],
      virtual_tour_360: null,
      floor_plans: [],
      documents: []
    }
  },

  // Informações do corretor
  realtor_info: {
    type: DataTypes.JSONB,
    defaultValue: {
      name: null,
      phone: null,
      whatsapp: null,
      email: null,
      photo: null,
      creci: null,
      languages: ['pt']
    }
  },

  // Financiamento
  financing: {
    type: DataTypes.JSONB,
    defaultValue: {
      available: false,
      down_payment_min: null,
      max_years: null,
      banks: [],
      interest_rate: null
    }
  },

  // SEO e marketing
  seo: {
    type: DataTypes.JSONB,
    defaultValue: {
      meta_title: null,
      meta_description: null,
      keywords: [],
      structured_data: {}
    }
  },

  // Analytics
  analytics: {
    type: DataTypes.JSONB,
    defaultValue: {
      views: 0,
      leads: 0,
      favorites: 0,
      last_view_at: null,
      source_tracking: {}
    }
  },

  // Dados específicos por tipo de negócio
  business_specific: {
    type: DataTypes.JSONB,
    defaultValue: {
      // Para fazendas/estâncias
      agricultural: {
        soil_type: null,
        water_source: null,
        crops_history: [],
        cattle_capacity: null
      },
      // Para terrenos
      land: {
        zoning: null,
        permits: [],
        utilities: {
          water: false,
          electricity: false,
          sewage: false,
          internet: false
        }
      }
    }
  },

  // Featured/priority
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  priority: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },

  // Datas importantes
  available_from: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  indexes: [
    { fields: ['tenant_id'] },
    { fields: ['property_type'] },
    { fields: ['purpose'] },
    { fields: ['status'] },
    { fields: ['is_featured'] },
    { fields: ['available_from'] },
    { fields: ['tenant_id', 'status'] },
    { fields: ['tenant_id', 'property_type'] }
  ]
});

module.exports = Property;