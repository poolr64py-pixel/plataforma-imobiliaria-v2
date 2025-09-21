const axios = require('axios');

const API_BASE = 'http://localhost:1337/api';

// Função para testar conectividade
async function testConnection() {
  try {
    const response = await axios.get(`${API_BASE}/imovels`);
    console.log('✅ Conexão com API estabelecida');
    return true;
  } catch (error) {
    if (error.response) {
      console.log(`❌ API respondeu com erro ${error.response.status}`);
      if (error.response.status === 404) {
        console.log('🔍 Tentando endpoint singular...');
        try {
          await axios.get(`${API_BASE}/imovel`);
          console.log('✅ Endpoint correto: /imovel');
          return 'imovel';
        } catch (err) {
          console.log('❌ Endpoint /imovel também não funciona');
          return false;
        }
      }
    } else {
      console.log(`❌ Erro de conexão: ${error.message}`);
      return false;
    }
  }
}

// Criar cliente de teste primeiro
async function createTestClient() {
  const clientData = {
    nome: 'Imobiliária Teste',
    telefone: '59521999999',
    email_contato: 'teste@imobiliaria.com'
  };

  try {
    const response = await axios.post(`${API_BASE}/clientes`, {
      data: clientData
    });
    console.log('✅ Cliente teste criado');
    return response.data.data.id;
  } catch (error) {
    console.log('❌ Erro ao criar cliente:', error.response?.data || error.message);
    return null;
  }
}

// Criar imóvel simples para teste
async function createSimpleProperty(endpoint, clientId) {
  const propertyData = {
    titulo: 'Casa Teste',
    preco: 100000,
    cidade: 'Asunción',
    tipo: 'casa',
    ativo: true
  };

  // Adicionar cliente se ID disponível
  if (clientId) {
    propertyData.cliente = clientId;
  }

  try {
    const response = await axios.post(`${API_BASE}/${endpoint}`, {
      data: propertyData
    });
    console.log('✅ Imóvel teste criado com sucesso');
    return true;
  } catch (error) {
    console.log('❌ Erro ao criar imóvel:');
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Erro:`, JSON.stringify(error.response.data, null, 2));
    } else {
      console.log(`   Rede: ${error.message}`);
    }
    return false;
  }
}

// Criar múltiplos imóveis se o teste passou
async function createAllProperties(endpoint, clientId) {
  const properties = [
    {
      titulo: 'Casa Moderna Centro',
      preco: 280000,
      cidade: 'Asunción',
      tipo: 'casa',
      area: 180,
      quartos: 3,
      banheiros: 2,
      descricao: 'Casa moderna no centro de Asunción',
      ativo: true,
      cliente: clientId
    },
    {
      titulo: 'Apartamento Villa Morra',
      preco: 350000,
      cidade: 'Asunción',
      tipo: 'apartamento',
      area: 120,
      quartos: 2,
      banheiros: 2,
      descricao: 'Apartamento de luxo em Villa Morra',
      ativo: true,
      cliente: clientId
    },
    {
      titulo: 'Casa Lambaré',
      preco: 185000,
      cidade: 'Lambaré',
      tipo: 'casa',
      area: 150,
      quartos: 4,
      banheiros: 3,
      descricao: 'Casa familiar em Lambaré',
      ativo: true
    }
  ];

  let successCount = 0;
  for (const property of properties) {
    try {
      await axios.post(`${API_BASE}/${endpoint}`, { data: property });
      console.log(`✅ ${property.titulo}`);
      successCount++;
    } catch (error) {
      console.log(`❌ ${property.titulo}: ${error.response?.data?.error?.message || error.message}`);
    }
  }
  
  console.log(`\n📊 Resultado: ${successCount}/${properties.length} imóveis criados`);
}

// Função principal
async function main() {
  console.log('🏠 Iniciando população do Strapi...\n');

  // Teste de conectividade
  const connection = await testConnection();
  if (!connection) {
    console.log('\n❌ Não foi possível conectar com a API do Strapi');
    console.log('   Certifique-se que o Strapi está rodando em http://localhost:1337');
    return;
  }

  const endpoint = connection === 'imovel' ? 'imovel' : 'imovels';
  console.log(`📡 Usando endpoint: /${endpoint}\n`);

  // Criar cliente teste
  console.log('👥 Criando cliente...');
  const clientId = await createTestClient();

  // Teste com um imóvel simples
  console.log('\n🏠 Testando criação de imóvel...');
  const testSuccess = await createSimpleProperty(endpoint, clientId);

  if (testSuccess) {
    console.log('\n✅ Teste passou! Criando todos os imóveis...\n');
    await createAllProperties(endpoint, clientId);
  } else {
    console.log('\n❌ Teste falhou. Verifique as permissões no admin do Strapi:');
    console.log('   1. Acesse http://localhost:1337/admin');
    console.log('   2. Settings > Users & Permissions > Roles > Public');
    console.log('   3. Marque "create" para Imovel e Cliente');
    console.log('   4. Salve e execute este script novamente');
  }

  console.log('\n🎉 Script finalizado!');
  console.log('📱 Frontend: http://localhost:3000');
  console.log('⚙️  Admin: http://localhost:1337/admin');
}

main().catch(console.error);