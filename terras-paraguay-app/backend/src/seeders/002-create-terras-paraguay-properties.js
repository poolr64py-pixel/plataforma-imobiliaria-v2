const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Buscar o tenant Terras Paraguay
    const [tenant] = await queryInterface.sequelize.query(
      `SELECT id FROM tenants WHERE slug = 'terras-paraguay'`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (!tenant) {
      throw new Error('Tenant "terras-paraguay" não encontrado. Execute o seeder 001 primeiro.');
    }

    const tenantId = tenant.id;

    // Propriedades diversificadas para Terras Paraguay - Imobiliária Completa
    const properties = [
      {
        id: uuidv4(),
        tenant_id: tenantId,
        title: 'Fazenda Produtiva - Soja e Milho',
        slug: 'fazenda-produtiva-soja-milho-capitanbado',
        description: 'Fazenda de 200 hectares altamente produtiva, localizada em Capitán Bado, Amambay. Solo de primeira qualidade com histórico comprovado de produção de soja e milho. Infraestrutura completa com casa sede, galpões, energia elétrica trifásica e poço artesiano.',
        property_type: 'farm',
        purpose: 'sale',
        status: 'active',

        pricing: JSON.stringify({
          sale_price: 850000, // USD
          rent_price: null,
          currency_primary: 'USD',
          currency_secondary: 'PYG',
          price_per_m2: null,
          price_per_hectare: 4250,
          local_prices: {
            PYG: 6375000000, // 850000 * 7500
            BRL: 4420000     // 850000 * 5.2
          }
        }),

        location: JSON.stringify({
          address: 'Ruta 5, Km 45, Capitán Bado',
          neighborhood: 'Zona Rural',
          city: 'Capitán Bado',
          state: 'Amambay',
          country: 'PY',
          postal_code: '160101',
          coordinates: {
            lat: -23.2617,
            lng: -55.5294
          },
          distance_to_brazil: '5 km',
          access_road: 'Ruta pavimentada'
        }),

        features: JSON.stringify({
          area_total: 200,
          area_built: 300, // casa + galpões
          area_unit: 'hectares',
          rooms: null,
          bedrooms: 4, // casa sede
          bathrooms: 2,
          parking_spaces: 5,
          floor: null,
          floors_total: 1,
          year_built: 2015,
          condition: 'excelente',
          agricultural_area: 195,
          infrastructure_area: 5
        }),

        amenities: JSON.stringify({
          internal: [
            'Casa sede renovada',
            'Galpões para maquinário',
            'Escritório administrativo',
            'Energia elétrica trifásica'
          ],
          external: [
            'Poço artesiano',
            'Cercas em bom estado',
            'Estradas internas',
            'Área de manejo'
          ],
          agricultural: [
            'Solo classe I',
            'Topografia plana',
            'Drenagem natural',
            'Acesso a água abundante'
          ],
          location: [
            'Próximo à fronteira Brasil',
            'Acesso pavimentado',
            'Infraestrutura regional',
            'Serviços próximos'
          ]
        }),

        media: JSON.stringify({
          images: [
            'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop'
          ],
          videos: [],
          virtual_tour_360: null,
          floor_plans: [],
          documents: [
            'titulo_propriedade.pdf',
            'historico_producao.pdf'
          ]
        }),

        realtor_info: JSON.stringify({
          name: 'João Silva',
          phone: '+595 21 789123',
          whatsapp: '+595 983 789123',
          email: 'joao@terrasnoparaguay.com',
          photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          creci: null,
          languages: ['pt', 'es'],
          specialties: ['Propriedades Rurais', 'Agronegócio']
        }),

        financing: JSON.stringify({
          available: true,
          down_payment_min: 50, // 50%
          max_years: 10,
          banks: ['Banco Nacional de Fomento', 'Banco Regional'],
          interest_rate: 8.5,
          details: 'Financiamento rural disponível para produtores'
        }),

        business_specific: JSON.stringify({
          agricultural: {
            soil_type: 'Latossolo Vermelho',
            water_source: 'Poço artesiano + chuva',
            crops_history: [
              { year: 2023, crop: 'soja', yield: '3.2 ton/ha', revenue: 320000 },
              { year: 2022, crop: 'milho', yield: '8.5 ton/ha', revenue: 280000 },
              { year: 2021, crop: 'soja', yield: '3.0 ton/ha', revenue: 310000 }
            ],
            cattle_capacity: null,
            certifications: ['Orgânico', 'Sustentável'],
            equipment_included: [
              'Trator John Deere',
              'Plantadeira',
              'Pulverizador'
            ]
          }
        }),

        seo: JSON.stringify({
          meta_title: 'Fazenda Produtiva 200ha - Soja e Milho - Capitán Bado, Paraguay',
          meta_description: 'Fazenda de 200 hectares para venda em Capitán Bado, Amambay. Solo de primeira, infraestrutura completa. Histórico produtivo comprovado.',
          keywords: ['fazenda paraguay', 'terra produtiva', 'soja', 'milho', 'amambay'],
          structured_data: {
            '@type': 'RealEstateListing',
            'name': 'Fazenda Produtiva - Soja e Milho',
            'description': 'Fazenda de 200 hectares altamente produtiva',
            'price': 850000,
            'priceCurrency': 'USD'
          }
        }),

        is_featured: true,
        priority: 10,
        available_from: new Date(),
        expires_at: null,
        created_at: new Date(),
        updated_at: new Date()
      },

      {
        id: uuidv4(),
        tenant_id: tenantId,
        title: 'Casa Moderna em Asunción - Villa Morra',
        slug: 'casa-moderna-asuncion-villa-morra',
        description: 'Casa moderna de 150m² em uma das áreas mais valorizadas de Asunción. Acabamento de primeira qualidade, área gourmet completa, piscina e jardim paisagístico. Documentação regularizada e financiamento disponível.',
        property_type: 'house',
        purpose: 'sale',
        status: 'active',

        pricing: JSON.stringify({
          sale_price: 180000, // USD
          rent_price: null,
          currency_primary: 'USD',
          currency_secondary: 'PYG',
          price_per_m2: 1200,
          price_per_hectare: null,
          local_prices: {
            PYG: 1350000000, // 180000 * 7500
            BRL: 936000      // 180000 * 5.2
          }
        }),

        location: JSON.stringify({
          address: 'Calle Últimas Noticias 1234',
          neighborhood: 'Villa Morra',
          city: 'Asunción',
          state: 'Asunción',
          country: 'PY',
          postal_code: '1209',
          coordinates: {
            lat: -25.2637,
            lng: -57.5759
          },
          landmarks: [
            'Shopping del Sol - 2km',
            'Centro de Asunción - 5km',
            'Aeroporto - 15km'
          ]
        }),

        features: JSON.stringify({
          area_total: 600, // terreno
          area_built: 150,
          area_unit: 'm2',
          rooms: 4,
          bedrooms: 3,
          bathrooms: 2,
          parking_spaces: 2,
          floor: null,
          floors_total: 1,
          year_built: 2020,
          condition: 'novo'
        }),

        amenities: JSON.stringify({
          internal: [
            'Ar condicionado central',
            'Cozinha planejada',
            'Closets nos quartos',
            'Pisos porcelanato'
          ],
          external: [
            'Área gourmet completa',
            'Piscina com deck',
            'Jardim paisagístico',
            'Quintal privativo'
          ],
          security: [
            'Portão eletrônico',
            'Câmeras de segurança',
            'Cerca elétrica',
            'Bairro seguro'
          ],
          neighborhood: [
            'Próximo ao Shopping del Sol',
            'Escolas internacionais',
            'Hospitais de qualidade',
            'Restaurantes'
          ]
        }),

        realtor_info: JSON.stringify({
          name: 'Carlos Rodriguez',
          phone: '+595 21 123456',
          whatsapp: '+595 981 123456',
          email: 'carlos@terrasnoparaguay.com',
          photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          languages: ['pt', 'es', 'en']
        }),

        financing: JSON.stringify({
          available: true,
          down_payment_min: 30,
          max_years: 20,
          banks: ['Banco Continental', 'Itaú Paraguay'],
          interest_rate: 12.5
        }),

        is_featured: true,
        priority: 9,
        created_at: new Date(),
        updated_at: new Date()
      },

      {
        id: uuidv4(),
        tenant_id: tenantId,
        title: 'Lote Residencial Premium - Luque',
        slug: 'lote-residencial-premium-luque',
        description: 'Lote de 600m² em condomínio fechado exclusivo em Luque. Infraestrutura completa, segurança 24h, área verde preservada. Ideal para construção da casa dos sonhos.',
        property_type: 'land',
        purpose: 'sale',
        status: 'active',

        pricing: JSON.stringify({
          sale_price: 75000,
          currency_primary: 'USD',
          currency_secondary: 'PYG',
          price_per_m2: 125,
          local_prices: {
            PYG: 562500000,
            BRL: 390000
          }
        }),

        location: JSON.stringify({
          address: 'Condominio Los Jardines, Luque',
          neighborhood: 'Los Jardines',
          city: 'Luque',
          state: 'Central',
          country: 'PY',
          coordinates: {
            lat: -25.2697,
            lng: -57.4928
          }
        }),

        features: JSON.stringify({
          area_total: 600,
          area_unit: 'm2',
          topography: 'plano',
          soil_type: 'firme'
        }),

        business_specific: JSON.stringify({
          land: {
            zoning: 'residencial',
            permits: ['construção residencial'],
            utilities: {
              water: true,
              electricity: true,
              sewage: true,
              internet: true,
              gas: false
            },
            restrictions: [
              'Área mínima construção: 100m²',
              'Recuo frontal: 5m',
              'Taxa ocupação: 60%'
            ]
          }
        }),

        is_featured: false,
        priority: 5,
        created_at: new Date(),
        updated_at: new Date()
      },

      {
        id: uuidv4(),
        tenant_id: tenantId,
        title: 'Estância para Gado - San Pedro',
        slug: 'estancia-gado-san-pedro',
        description: 'Estância de 600 hectares para pecuária em San Pedro. Terra de excelente qualidade com pastagens nativas e cultivadas. Infraestrutura completa para gado com currais modernos.',
        property_type: 'ranch',
        purpose: 'sale',
        status: 'active',

        pricing: JSON.stringify({
          sale_price: 1200000,
          currency_primary: 'USD',
          price_per_hectare: 2000,
          local_prices: {
            PYG: 9000000000,
            BRL: 6240000
          }
        }),

        location: JSON.stringify({
          address: 'Distrito de Yrybucuá, San Pedro',
          city: 'San Pedro de Ycuamandiyú',
          state: 'San Pedro',
          country: 'PY'
        }),

        features: JSON.stringify({
          area_total: 600,
          area_unit: 'hectares',
          pasture_area: 580,
          infrastructure_area: 20
        }),

        business_specific: JSON.stringify({
          agricultural: {
            cattle_capacity: 1200,
            current_stock: 800,
            breed: 'Nelore e cruzamentos',
            pastures: '80% cultivado, 20% nativo',
            water_sources: ['Aguadas naturais', 'Poços artesianos'],
            facilities: [
              'Currais modernos',
              'Manga de apartação',
              'Balança para gado',
              'Casa sede'
            ]
          }
        }),

        is_featured: false,
        priority: 7,
        created_at: new Date(),
        updated_at: new Date()
      },

      // APARTAMENTO MODERNO
      {
        id: uuidv4(),
        tenant_id: tenantId,
        title: 'Apartamento Luxo Torre Centenario',
        slug: 'apartamento-luxo-torre-centenario-asuncion',
        description: 'Apartamento de alto padrão na icônica Torre Centenario. Vista panorâmica do Rio Paraguay e da cidade. Localização privilegiada no coração de Asunción.',
        property_type: 'apartment',
        purpose: 'sale',
        status: 'active',

        pricing: JSON.stringify({
          sale_price: 320000,
          currency_primary: 'USD',
          price_per_m2: 2500,
          local_prices: {
            PYG: 2400000000,
            BRL: 1664000
          }
        }),

        location: JSON.stringify({
          address: 'Av. Brasília 1430, Torre Centenario',
          neighborhood: 'Centro',
          city: 'Asunción',
          state: 'Asunción',
          country: 'PY'
        }),

        features: JSON.stringify({
          area_total: 128,
          area_built: 128,
          area_unit: 'm2',
          rooms: 3,
          bedrooms: 2,
          bathrooms: 2,
          parking_spaces: 1,
          floor: 18,
          floors_total: 25,
          year_built: 2018,
          condition: 'excelente'
        }),

        amenities: JSON.stringify({
          internal: ['Vista panorâmica Rio Paraguay', 'Acabamentos importados', 'Cozinha planejada'],
          external: ['Piscina infinity', 'Academia', 'Portaria 24h'],
          building: ['Elevadores', 'Gerador', 'Cisterna']
        }),

        is_featured: true,
        priority: 8,
        created_at: new Date(),
        updated_at: new Date()
      },

      // SALA COMERCIAL
      {
        id: uuidv4(),
        tenant_id: tenantId,
        title: 'Sala Comercial Centro Empresarial',
        slug: 'sala-comercial-centro-empresarial-asuncion',
        description: 'Moderna sala comercial em centro empresarial de Asunción. Pronta para uso, com infraestrutura completa para escritórios e consultorias.',
        property_type: 'commercial',
        purpose: 'sale',
        status: 'active',

        pricing: JSON.stringify({
          sale_price: 85000,
          rent_price: 1200,
          currency_primary: 'USD',
          price_per_m2: 1417,
          local_prices: {
            PYG: 637500000,
            BRL: 442000
          }
        }),

        location: JSON.stringify({
          address: 'Av. República Argentina, World Trade Center',
          neighborhood: 'Villa Morra',
          city: 'Asunción',
          state: 'Asunción',
          country: 'PY'
        }),

        features: JSON.stringify({
          area_total: 60,
          area_built: 60,
          area_unit: 'm2',
          rooms: 3,
          bathrooms: 1,
          parking_spaces: 1,
          floor: 12,
          year_built: 2019,
          condition: 'novo'
        }),

        business_specific: JSON.stringify({
          commercial: {
            business_type: 'office',
            zoning: 'comercial',
            facilities: ['Ar condicionado central', 'Elevadores', 'Segurança 24h'],
            target_business: ['Escritórios', 'Consultorias', 'Agências']
          }
        }),

        is_featured: false,
        priority: 6,
        created_at: new Date(),
        updated_at: new Date()
      },

      // SOBRADO
      {
        id: uuidv4(),
        tenant_id: tenantId,
        title: 'Sobrado Moderno - Lambaré',
        slug: 'sobrado-moderno-lambare',
        description: 'Sobrado novo de 3 pavimentos em Lambaré. Arquitetura moderna, área gourmet, 4 suítes. Ideal para famílias grandes.',
        property_type: 'townhouse',
        purpose: 'sale',
        status: 'active',

        pricing: JSON.stringify({
          sale_price: 245000,
          currency_primary: 'USD',
          price_per_m2: 1361,
          local_prices: {
            PYG: 1837500000,
            BRL: 1274000
          }
        }),

        location: JSON.stringify({
          address: 'Barrio San Roque, Lambaré',
          neighborhood: 'San Roque',
          city: 'Lambaré',
          state: 'Central',
          country: 'PY'
        }),

        features: JSON.stringify({
          area_total: 400, // terreno
          area_built: 180,
          area_unit: 'm2',
          rooms: 6,
          bedrooms: 4,
          bathrooms: 3,
          parking_spaces: 2,
          floors_total: 3,
          year_built: 2021,
          condition: 'novo'
        }),

        amenities: JSON.stringify({
          internal: ['4 suítes', 'Escritório', 'Sala de estar', 'Sala de jantar'],
          external: ['Área gourmet', 'Piscina', 'Jardim', 'Quintal'],
          features: ['Portão eletrônico', 'Energia solar', 'Cisterna']
        }),

        is_featured: false,
        priority: 6,
        created_at: new Date(),
        updated_at: new Date()
      },

      // GALPÃO INDUSTRIAL
      {
        id: uuidv4(),
        tenant_id: tenantId,
        title: 'Galpão Industrial - Zona Franca',
        slug: 'galpao-industrial-zona-franca',
        description: 'Galpão industrial estrategicamente localizado na zona franca. Ideal para importação/exportação e logística.',
        property_type: 'warehouse',
        purpose: 'rent',
        status: 'active',

        pricing: JSON.stringify({
          sale_price: 450000,
          rent_price: 3500,
          currency_primary: 'USD',
          price_per_m2: 450,
          local_prices: {
            PYG: 3375000000,
            BRL: 2340000
          }
        }),

        location: JSON.stringify({
          address: 'Zona Franca de Asunción',
          neighborhood: 'Zona Industrial',
          city: 'Asunción',
          state: 'Asunción',
          country: 'PY'
        }),

        features: JSON.stringify({
          area_total: 2000, // terreno
          area_built: 1000,
          area_unit: 'm2',
          height: 8, // metros
          loading_docks: 4,
          year_built: 2017,
          condition: 'bom'
        }),

        business_specific: JSON.stringify({
          industrial: {
            zoning: 'industrial',
            utilities: {
              electricity: '220V/380V',
              water: 'abundante',
              sewage: true,
              internet: 'fibra ótica'
            },
            access: {
              truck_access: true,
              railway: false,
              port_distance: '40km'
            },
            certifications: ['Zona Franca', 'Bombeiros', 'Ambiental']
          }
        }),

        is_featured: false,
        priority: 4,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    // Inserir todas as propriedades
    await queryInterface.bulkInsert('properties', properties);

    console.log(`✅ ${properties.length} propriedades criadas para Terras Paraguay`);
    console.log('🏠 Tipos: Fazenda, Casa, Lote, Estância');
    console.log('💰 Preços: $75K - $1.2M USD');
  },

  down: async (queryInterface, Sequelize) => {
    // Buscar o tenant
    const [tenant] = await queryInterface.sequelize.query(
      `SELECT id FROM tenants WHERE slug = 'terras-paraguay'`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (tenant) {
      await queryInterface.bulkDelete('properties', {
        tenant_id: tenant.id
      });
      console.log('🗑️  Propriedades do Terras Paraguay removidas');
    }
  }
};