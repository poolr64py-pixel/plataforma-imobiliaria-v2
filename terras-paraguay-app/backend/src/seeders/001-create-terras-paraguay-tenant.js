const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tenantId = uuidv4();
    const adminUserId = uuidv4();

    // 1. Criar tenant Terras Paraguay
    await queryInterface.bulkInsert('tenants', [{
      id: tenantId,
      slug: 'terras-paraguay',
      name: 'Terras no Paraguay',
      domain: 'terrasparaguay.com',
      status: 'active',
      plan: 'professional',

      // Configurações de branding
      branding: JSON.stringify({
        logo: '/assets/terras-paraguay/logo.png',
        colors: {
          primary: '#22c55e',
          secondary: '#15803d',
          accent: '#fbbf24'
        },
        fonts: ['Inter', 'sans-serif'],
        favicon: '/assets/terras-paraguay/favicon.ico'
      }),

      // Configurações de negócio - Imobiliária Completa Paraguay
      business_config: JSON.stringify({
        property_types: [
          'house',        // Casas
          'apartment',    // Apartamentos
          'duplex',       // Duplex
          'farm',         // Fazendas/Chácaras
          'ranch',        // Estâncias
          'land',         // Terrenos/Lotes
          'commercial',   // Salas comerciais
          'warehouse',    // Galpões
          'townhouse'     // Sobrados
        ],
        currencies: ['USD', 'PYG', 'BRL'],
        currencies_config: {
          primary: 'USD',
          secondary: 'PYG',
          tertiary: 'BRL',
          exchange_rates: {
            'USD_PYG': 7500,
            'USD_BRL': 5.2,
            'PYG_BRL': 0.00069
          }
        },
        languages: ['pt', 'es'],
        countries: ['PY', 'BR'],
        business_focus: 'full_service_realty',
        specialties: [
          'imóveis_residenciais',
          'propriedades_comerciais',
          'terrenos_urbanos_rurais',
          'fazendas_estâncias',
          'investimento_internacional',
          'assessoria_completa_brasileiros',
          'documentação_regularizada',
          'financiamento_imobiliário'
        ],
        measurement_units: {
          area_primary: 'm2',      // Padrão para residencial/comercial
          area_secondary: 'hectares', // Para fazendas/estâncias
          currency_display: 'multi'   // Mostrar múltiplas moedas
        },
        property_categories: {
          residential: ['house', 'apartment', 'duplex', 'townhouse'],
          commercial: ['commercial', 'warehouse'],
          rural: ['farm', 'ranch'],
          land: ['land']
        }
      }),

      // Informações de contato
      contact_info: JSON.stringify({
        phone: '+595 21 123456',
        whatsapp: '+595 981 123456',
        email: 'contato@terrasnoparaguay.com',
        address: 'Av. Brasília 1234, Asunción - Paraguay',
        social_media: {
          facebook: 'https://facebook.com/terrasnoparaguay',
          instagram: 'https://instagram.com/terrasnoparaguay',
          youtube: 'https://youtube.com/terrasnoparaguay',
          linkedin: 'https://linkedin.com/company/terrasnoparaguay'
        },
        business_hours: {
          monday: '08:00-18:00',
          tuesday: '08:00-18:00',
          wednesday: '08:00-18:00',
          thursday: '08:00-18:00',
          friday: '08:00-18:00',
          saturday: '08:00-12:00',
          sunday: 'closed'
        }
      }),

      // Features habilitadas (plano professional)
      features: JSON.stringify({
        virtual_tour_360: true,
        crm: true,
        marketing_ai: false,
        video_ai: true,
        advanced_analytics: true,
        white_label_removal: true,
        multi_currency: true,
        multi_language: true,
        advanced_search: true,
        map_integration: true,
        lead_management: true,
        email_automation: true,
        sms_notifications: false,
        api_access: true
      }),

      // Limites do plano professional
      limits: JSON.stringify({
        max_properties: 500,
        max_users: 15,
        max_storage_gb: 100,
        max_api_calls_month: 50000,
        max_images_per_property: 20,
        max_videos_per_property: 5
      }),

      // Integrações específicas
      integrations: JSON.stringify({
        google_maps_key: null, // Para ser configurado
        stripe_key: null,
        cloudinary_config: null,
        email_provider: 'nodemailer',
        sms_provider: null,
        whatsapp_business_api: false,
        facebook_pixel_id: null,
        google_analytics_id: null,
        custom_domain_enabled: true
      }),

      // Configurações de SEO específicas Paraguay
      seo_config: JSON.stringify({
        meta_title: 'Terras no Paraguay - Imóveis e Investimentos no Coração da América do Sul',
        meta_description: 'Encontre as melhores oportunidades de investimento imobiliário no Paraguay. Terrenos, fazendas e propriedades com assessoria completa para brasileiros.',
        keywords: [
          'imóveis paraguay',
          'terrenos paraguay',
          'fazendas paraguay',
          'investimento paraguay',
          'imóveis para brasileiros',
          'terras produtivas',
          'estâncias paraguay'
        ],
        structured_data: true,
        sitemap_enabled: true,
        robots_txt_custom: true
      }),

      // Licença válida por 1 ano
      license_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      last_activity_at: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    }]);

    // 2. Criar usuário admin do tenant
    await queryInterface.bulkInsert('users', [{
      id: adminUserId,
      tenant_id: tenantId,
      email: 'admin@terrasnoparaguay.com',
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewfwrQ9Yq0GsA.MG', // hashed "admin123"
      name: 'Admin Terras Paraguay',
      role: 'tenant_admin',
      status: 'active',

      profile: JSON.stringify({
        avatar: null,
        phone: '+595 981 123456',
        whatsapp: '+595 981 123456',
        bio: 'Administrador principal da Terras no Paraguay',
        languages: ['pt', 'es'],
        timezone: 'America/Asuncion'
      }),

      settings: JSON.stringify({
        notifications: {
          email: true,
          browser: true,
          mobile: false,
          whatsapp: true
        },
        dashboard_layout: 'advanced',
        language: 'pt',
        currency_display: 'USD',
        date_format: 'DD/MM/YYYY',
        timezone: 'America/Asuncion'
      }),

      permissions: JSON.stringify({
        properties: {
          create: true,
          read: true,
          update: true,
          delete: true,
          publish: true,
          feature: true
        },
        leads: {
          create: true,
          read: true,
          update: true,
          delete: true,
          export: true
        },
        analytics: {
          read: true,
          export: true,
          advanced: true
        },
        settings: {
          read: true,
          update: true,
          integrations: true,
          billing: true
        },
        users: {
          create: true,
          read: true,
          update: true,
          delete: true,
          manage_roles: true
        }
      }),

      professional_info: JSON.stringify({
        creci: null, // Paraguay não usa CRECI
        specialties: [
          'Propriedades Rurais',
          'Investimento Internacional',
          'Assessoria para Brasileiros'
        ],
        experience_years: 15,
        education: [
          'Administração de Empresas',
          'Especialização em Mercado Imobiliário'
        ],
        certifications: [
          'Corretor Imobiliário Paraguay',
          'Especialista em Investimentos Rurais'
        ]
      }),

      email_verified_at: new Date(),
      last_login_at: new Date(),
      login_count: 1,
      created_at: new Date(),
      updated_at: new Date()
    }]);

    console.log('✅ Tenant "Terras Paraguay" criado com sucesso!');
    console.log('📧 Email admin: admin@terrasnoparaguay.com');
    console.log('🔑 Senha admin: admin123');
    console.log('🏷️  Slug tenant: terras-paraguay');
  },

  down: async (queryInterface, Sequelize) => {
    // Remover dados do seeder
    await queryInterface.bulkDelete('properties', {
      tenant_id: {
        [Sequelize.Op.in]: queryInterface.sequelize.literal(`
          (SELECT id FROM tenants WHERE slug = 'terras-paraguay')
        `)
      }
    });

    await queryInterface.bulkDelete('users', {
      tenant_id: {
        [Sequelize.Op.in]: queryInterface.sequelize.literal(`
          (SELECT id FROM tenants WHERE slug = 'terras-paraguay')
        `)
      }
    });

    await queryInterface.bulkDelete('tenants', {
      slug: 'terras-paraguay'
    });

    console.log('🗑️  Tenant "Terras Paraguay" removido');
  }
};