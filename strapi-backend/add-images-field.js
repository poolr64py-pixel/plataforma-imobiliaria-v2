// Script para adicionar campo imagens
const fs = require('fs');
const path = require('path');

// Caminho do schema do Imovel
const schemaPath = path.join(__dirname, 'src/api/imovel/content-types/imovel/schema.json');

try {
  // Ler schema atual
  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
  
  // Adicionar campo imagens
  schema.attributes.imagens = {
    type: "media",
    multiple: true,
    required: false,
    allowedTypes: ["images", "files", "videos", "audios"]
  };
  
  // Salvar schema atualizado
  fs.writeFileSync(schemaPath, JSON.stringify(schema, null, 2));
  
  console.log('✅ Campo imagens adicionado com sucesso!');
  console.log('🔄 Reinicie o Strapi: npm run develop');
  
} catch (error) {
  console.error('❌ Erro:', error.message);
  console.log('💡 Certifique-se que o Strapi está parado antes de executar este script');
}