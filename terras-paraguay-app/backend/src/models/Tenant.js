const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Tenant = sequelize.define('Tenant', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isAlphanumeric: true,
      len: [3, 50]
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 100]
    }
  },
  domain: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'suspended', 'trial'),
    defaultValue: 'trial'
  },
  plan: {
    type: DataTypes.ENUM('basic', 'professional', 'enterprise'),
    defaultValue: 'basic'
  },

  // Configurações de branding
  branding: {
    type: DataTypes.JSONB,
    defaultValue: {
      logo: null,
      colors: {
        primary: '#007bff',
        secondary: '#6c757d',
        accent: '#28a745'
      },
      fonts: ['Inter', 'sans-serif'],
      favicon: null
    }
  },

  // Configurações de negócio
  business_config: {
    type: DataTypes.JSONB,
    defaultValue: {
      property_types: ['house', 'apartment', 'land'],
      currencies: ['BRL'],
      languages: ['pt'],
      countries: ['BR'],
      business_focus: 'residential'
    }
  },

  // Configurações de contato
  contact_info: {
    type: DataTypes.JSONB,
    defaultValue: {
      phone: null,
      whatsapp: null,
      email: null,
      address: null,
      social_media: {}
    }
  },

  // Features habilitadas
  features: {
    type: DataTypes.JSONB,
    defaultValue: {
      virtual_tour_360: false,
      crm: false,
      marketing_ai: false,
      video_ai: false,
      advanced_analytics: false,
      white_label_removal: false
    }
  },

  // Limites do plano
  limits: {
    type: DataTypes.JSONB,
    defaultValue: {
      max_properties: 100,
      max_users: 5,
      max_storage_gb: 10,
      max_api_calls_month: 10000
    }
  },

  // Configurações de API e integrações
  integrations: {
    type: DataTypes.JSONB,
    defaultValue: {
      google_maps_key: null,
      stripe_key: null,
      cloudinary_config: null,
      email_provider: null,
      sms_provider: null
    }
  },

  // Configurações de SEO
  seo_config: {
    type: DataTypes.JSONB,
    defaultValue: {
      meta_title: null,
      meta_description: null,
      google_analytics_id: null,
      facebook_pixel_id: null,
      structured_data: true
    }
  },

  // Data de expiração da licença
  license_expires_at: {
    type: DataTypes.DATE,
    allowNull: true
  },

  // Data da última atividade
  last_activity_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  indexes: [
    { fields: ['slug'] },
    { fields: ['domain'] },
    { fields: ['status'] },
    { fields: ['plan'] }
  ]
});

module.exports = Tenant;