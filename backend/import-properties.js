const properties = [
  {
    title: 'Fazenda em Caaguazú',
    description: 'Fazenda produtiva com infraestrutura completa',
    price: 450000,
    location: 'Caaguazú, Paraguay',
    area: 200,
    type: 'farm',
    status: 'disponivel',
    purpose: 'sale',
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800']
  },
  {
    title: 'Terreno Industrial em Ciudad del Este',
    description: 'Terreno próximo à fronteira',
    price: 180000,
    location: 'Ciudad del Este, Alto Paraná',
    area: 5000,
    type: 'land',
    status: 'disponivel',
    purpose: 'sale',
    images: ['https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800']
  },
  {
    title: 'Casa em San Lorenzo',
    description: 'Casa moderna 3 quartos',
    price: 95000,
    location: 'San Lorenzo, Central',
    area: 150,
    type: 'house',
    status: 'disponivel',
    purpose: 'sale',
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800']
  }
  // Adicione quantas quiser aqui
];

async function importProperties() {
  for (const prop of properties) {
    try {
      const response = await fetch('http://localhost:3001/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prop)
      });
      
      if (response.ok) {
        console.log(`✅ Importado: ${prop.title}`);
      } else {
        console.log(`❌ Erro: ${prop.title}`);
      }
    } catch (error) {
      console.log(`❌ Falha na conexão`);
    }
  }
  console.log('🎉 Importação finalizada!');
}

importProperties();