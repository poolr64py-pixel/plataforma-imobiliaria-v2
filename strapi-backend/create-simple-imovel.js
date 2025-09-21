const fs = require('fs');
const path = require('path');

const simpleSchema = {
  kind: 'collectionType',
  collectionName: 'imoveis',
  info: {
    singularName: 'imovel',
    pluralName: 'imoveis',
    displayName: 'Imovel'
  },
  attributes: {
    titulo: { type: 'string', required: true },
    preco: { type: 'integer' },
    cidade: { type: 'string' },
    tipo: { type: 'string' },
    area: { type: 'integer' },
    quartos: { type: 'integer' },
    banheiros: { type: 'integer' },
    descricao: { type: 'text' },
    ativo: { type: 'boolean', default: true }
  }
};

const contentTypePath = 'src/api/imovel/content-types/imovel';
fs.mkdirSync(contentTypePath, { recursive: true });
fs.writeFileSync(path.join(contentTypePath, 'schema.json'), JSON.stringify(simpleSchema, null, 2));
console.log('Schema simples criado');