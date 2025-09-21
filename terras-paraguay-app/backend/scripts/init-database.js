#!/usr/bin/env node

/**
 * Script de inicialização do banco de dados
 * Cria as tabelas e executa os seeders
 */

const { sequelize } = require('../src/config/database');
const { syncDatabase } = require('../src/models');

async function initDatabase() {
  try {
    console.log('🚀 Iniciando configuração do banco de dados...\n');

    // 1. Testar conexão
    console.log('📡 Testando conexão com o banco...');
    await sequelize.authenticate();
    console.log('✅ Conexão estabelecida com sucesso\n');

    // 2. Sincronizar modelos
    console.log('🔄 Sincronizando modelos do banco...');
    await syncDatabase({ force: false, alter: true });
    console.log('✅ Modelos sincronizados\n');

    // 3. Executar seeders manualmente
    console.log('🌱 Executando seeders...');

    // Importar e executar seeders
    const createTerrasParaguayTenant = require('../src/seeders/001-create-terras-paraguay-tenant');
    const createTerrasParaguayProperties = require('../src/seeders/002-create-terras-paraguay-properties');

    // Executar seeder do tenant
    console.log('📋 Criando tenant Terras Paraguay...');
    await createTerrasParaguayTenant.up(sequelize.getQueryInterface(), sequelize.Sequelize);

    // Executar seeder das propriedades
    console.log('🏠 Criando propriedades de exemplo...');
    await createTerrasParaguayProperties.up(sequelize.getQueryInterface(), sequelize.Sequelize);

    console.log('\n🎉 Banco de dados inicializado com sucesso!');
    console.log('\n📊 Resumo da inicialização:');
    console.log('└── ✅ Tenant "Terras Paraguay" criado');
    console.log('└── ✅ Admin user criado (admin@terrasnoparaguay.com)');
    console.log('└── ✅ 4 propriedades de exemplo criadas');
    console.log('└── ✅ Configurações multi-tenant ativas');

    console.log('\n🔐 Credenciais de acesso:');
    console.log('├── Email: admin@terrasnoparaguay.com');
    console.log('├── Senha: admin123');
    console.log('└── Tenant: terras-paraguay');

    console.log('\n🌐 URLs de teste:');
    console.log('├── API Health: http://localhost:3001/health');
    console.log('├── API Tenant: http://localhost:3001/api/tenants/config?tenant=terras-paraguay');
    console.log('├── API Properties: http://localhost:3001/api/properties?tenant=terras-paraguay');
    console.log('└── Admin Dashboard: http://localhost:3001/admin');

    console.log('\n🛠️  Próximos passos:');
    console.log('1. Copie .env.example para .env e configure suas variáveis');
    console.log('2. Execute "npm run dev" para iniciar o servidor');
    console.log('3. Teste as APIs usando o tenant "terras-paraguay"');
    console.log('4. Configure seu frontend para usar a API');

  } catch (error) {
    console.error('❌ Erro na inicialização:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  initDatabase();
}

module.exports = initDatabase;