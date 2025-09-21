const Tenant = require('./Tenant');
const User = require('./User');
const Property = require('./Property');

// Definir associações entre modelos

// Tenant tem muitos Users
Tenant.hasMany(User, {
  foreignKey: 'tenant_id',
  as: 'users',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

// User pertence a um Tenant
User.belongsTo(Tenant, {
  foreignKey: 'tenant_id',
  as: 'tenant',
  allowNull: true // Permite super admins sem tenant
});

// Tenant tem muitas Properties
Tenant.hasMany(Property, {
  foreignKey: 'tenant_id',
  as: 'properties',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// Property pertence a um Tenant
Property.belongsTo(Tenant, {
  foreignKey: 'tenant_id',
  as: 'tenant',
  allowNull: false
});

// Exportar todos os modelos
module.exports = {
  Tenant,
  User,
  Property
};

// Função para sincronizar banco de dados
const syncDatabase = async (options = {}) => {
  const { sequelize } = require('../config/database');

  try {
    console.log('🔄 Synchronizing database...');

    // Sincronizar modelos na ordem correta
    await Tenant.sync(options);
    await User.sync(options);
    await Property.sync(options);

    console.log('✅ Database synchronized successfully');
    return true;
  } catch (error) {
    console.error('❌ Database synchronization failed:', error);
    throw error;
  }
};

module.exports.syncDatabase = syncDatabase;