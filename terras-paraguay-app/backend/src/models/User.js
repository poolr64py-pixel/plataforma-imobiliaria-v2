const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  tenant_id: {
    type: DataTypes.UUID,
    allowNull: true, // null para super admins
    references: {
      model: 'tenants',
      key: 'id'
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 100]
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 100]
    }
  },
  role: {
    type: DataTypes.ENUM('super_admin', 'tenant_admin', 'manager', 'agent', 'user'),
    defaultValue: 'user'
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'pending', 'suspended'),
    defaultValue: 'pending'
  },

  // Perfil do usuário
  profile: {
    type: DataTypes.JSONB,
    defaultValue: {
      avatar: null,
      phone: null,
      whatsapp: null,
      bio: null,
      languages: ['pt'],
      timezone: 'America/Sao_Paulo'
    }
  },

  // Configurações
  settings: {
    type: DataTypes.JSONB,
    defaultValue: {
      notifications: {
        email: true,
        browser: true,
        mobile: false
      },
      dashboard_layout: 'default',
      language: 'pt'
    }
  },

  // Permissões específicas
  permissions: {
    type: DataTypes.JSONB,
    defaultValue: {
      properties: {
        create: false,
        read: true,
        update: false,
        delete: false
      },
      leads: {
        create: false,
        read: false,
        update: false,
        delete: false
      },
      analytics: {
        read: false
      },
      settings: {
        read: false,
        update: false
      }
    }
  },

  // Informações profissionais (para corretores)
  professional_info: {
    type: DataTypes.JSONB,
    defaultValue: {
      creci: null,
      specialties: [],
      experience_years: null,
      education: [],
      certifications: []
    }
  },

  // Verificações
  email_verified_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  phone_verified_at: {
    type: DataTypes.DATE,
    allowNull: true
  },

  // Login tracking
  last_login_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  login_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    }
  },
  indexes: [
    { fields: ['email'], unique: true },
    { fields: ['tenant_id'] },
    { fields: ['role'] },
    { fields: ['status'] },
    { fields: ['tenant_id', 'role'] }
  ]
});

// Instance methods
User.prototype.validatePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

User.prototype.hasPermission = function(resource, action) {
  return this.permissions?.[resource]?.[action] || false;
};

User.prototype.isTenantAdmin = function() {
  return this.role === 'tenant_admin';
};

User.prototype.isSuperAdmin = function() {
  return this.role === 'super_admin';
};

module.exports = User;