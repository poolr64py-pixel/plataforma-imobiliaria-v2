const express = require('express');
const { Op } = require('sequelize');
const Tenant = require('../models/Tenant');
const Property = require('../models/Property');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * Middleware para verificar se é super admin
 */
const requireSuperAdmin = (req, res, next) => {
  if (!req.user || !req.user.isSuperAdmin()) {
    return res.status(403).json({ error: 'Super admin access required' });
  }
  next();
};

/**
 * GET /api/admin/dashboard
 * Dashboard principal do sistema
 */
router.get('/dashboard', auth, requireSuperAdmin, async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const dashboard = {
      tenants: {
        total: await Tenant.count(),
        active: await Tenant.count({ where: { status: 'active' } }),
        trial: await Tenant.count({ where: { status: 'trial' } }),
        suspended: await Tenant.count({ where: { status: 'suspended' } }),
        recent: await Tenant.count({
          where: { created_at: { [Op.gte]: thirtyDaysAgo } }
        })
      },
      properties: {
        total: await Property.count(),
        active: await Property.count({ where: { status: 'active' } }),
        recent: await Property.count({
          where: { created_at: { [Op.gte]: thirtyDaysAgo } }
        })
      },
      users: {
        total: await User.count(),
        active: await User.count({ where: { status: 'active' } }),
        recent: await User.count({
          where: { created_at: { [Op.gte]: thirtyDaysAgo } }
        })
      },
      revenue: {
        mrr: 0, // Calcular MRR baseado nos planos
        plans: {
          basic: await Tenant.count({ where: { plan: 'basic', status: 'active' } }),
          professional: await Tenant.count({ where: { plan: 'professional', status: 'active' } }),
          enterprise: await Tenant.count({ where: { plan: 'enterprise', status: 'active' } })
        }
      }
    };

    // Calcular MRR (Monthly Recurring Revenue)
    const planPrices = { basic: 297, professional: 597, enterprise: 1297 };
    dashboard.revenue.mrr = Object.keys(planPrices).reduce((total, plan) => {
      return total + (dashboard.revenue.plans[plan] * planPrices[plan]);
    }, 0);

    res.json(dashboard);
  } catch (error) {
    console.error('Error fetching admin dashboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/admin/tenants
 * Listar todos os tenants
 */
router.get('/tenants', auth, requireSuperAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const where = {};
    if (req.query.status) {
      where.status = req.query.status;
    }
    if (req.query.plan) {
      where.plan = req.query.plan;
    }
    if (req.query.search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${req.query.search}%` } },
        { slug: { [Op.iLike]: `%${req.query.search}%` } },
        { domain: { [Op.iLike]: `%${req.query.search}%` } }
      ];
    }

    const { count, rows: tenants } = await Tenant.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: User,
          as: 'users',
          attributes: ['id', 'email', 'name', 'role'],
          limit: 1,
          where: { role: 'tenant_admin' },
          required: false
        }
      ]
    });

    res.json({
      tenants,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching tenants:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/admin/tenants
 * Criar novo tenant
 */
router.post('/tenants', auth, requireSuperAdmin, async (req, res) => {
  try {
    const {
      slug,
      name,
      domain,
      plan = 'basic',
      admin_user,
      branding,
      business_config,
      contact_info
    } = req.body;

    // Verificar se slug já existe
    const existingTenant = await Tenant.findOne({ where: { slug } });
    if (existingTenant) {
      return res.status(400).json({ error: 'Tenant slug already exists' });
    }

    // Criar tenant
    const tenant = await Tenant.create({
      slug,
      name,
      domain,
      plan,
      status: 'active',
      branding: branding || {},
      business_config: business_config || {},
      contact_info: contact_info || {},
      license_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 ano
    });

    // Criar usuário admin do tenant se fornecido
    let tenantAdmin = null;
    if (admin_user) {
      tenantAdmin = await User.create({
        tenant_id: tenant.id,
        email: admin_user.email,
        password: admin_user.password,
        name: admin_user.name,
        role: 'tenant_admin',
        status: 'active'
      });
    }

    res.status(201).json({
      message: 'Tenant created successfully',
      tenant,
      admin_user: tenantAdmin ? {
        id: tenantAdmin.id,
        email: tenantAdmin.email,
        name: tenantAdmin.name
      } : null
    });
  } catch (error) {
    console.error('Error creating tenant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /api/admin/tenants/:id
 * Atualizar tenant
 */
router.put('/tenants/:id', auth, requireSuperAdmin, async (req, res) => {
  try {
    const tenant = await Tenant.findByPk(req.params.id);
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    const allowedUpdates = [
      'name', 'domain', 'status', 'plan', 'branding',
      'business_config', 'contact_info', 'features',
      'limits', 'integrations', 'seo_config', 'license_expires_at'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    await tenant.update(updates);

    res.json({
      message: 'Tenant updated successfully',
      tenant
    });
  } catch (error) {
    console.error('Error updating tenant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /api/admin/tenants/:id
 * Suspender/deletar tenant
 */
router.delete('/tenants/:id', auth, requireSuperAdmin, async (req, res) => {
  try {
    const tenant = await Tenant.findByPk(req.params.id);
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    const action = req.query.action || 'suspend';

    if (action === 'suspend') {
      await tenant.update({ status: 'suspended' });
      res.json({ message: 'Tenant suspended successfully' });
    } else if (action === 'delete') {
      // Soft delete - marcar como inativo
      await tenant.update({ status: 'inactive' });
      res.json({ message: 'Tenant deactivated successfully' });
    } else {
      res.status(400).json({ error: 'Invalid action. Use suspend or delete' });
    }
  } catch (error) {
    console.error('Error deleting tenant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/admin/tenants/:id/analytics
 * Analytics detalhadas do tenant
 */
router.get('/tenants/:id/analytics', auth, requireSuperAdmin, async (req, res) => {
  try {
    const tenant = await Tenant.findByPk(req.params.id);
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    const analytics = {
      properties: {
        total: await Property.count({ where: { tenant_id: tenant.id } }),
        by_type: await Property.findAll({
          where: { tenant_id: tenant.id },
          attributes: [
            'property_type',
            [Property.sequelize.fn('COUNT', '*'), 'count']
          ],
          group: ['property_type']
        }),
        by_status: await Property.findAll({
          where: { tenant_id: tenant.id },
          attributes: [
            'status',
            [Property.sequelize.fn('COUNT', '*'), 'count']
          ],
          group: ['status']
        })
      },
      users: {
        total: await User.count({ where: { tenant_id: tenant.id } }),
        by_role: await User.findAll({
          where: { tenant_id: tenant.id },
          attributes: [
            'role',
            [User.sequelize.fn('COUNT', '*'), 'count']
          ],
          group: ['role']
        })
      },
      tenant_info: {
        created_at: tenant.created_at,
        last_activity_at: tenant.last_activity_at,
        plan: tenant.plan,
        status: tenant.status,
        license_expires_at: tenant.license_expires_at
      }
    };

    res.json(analytics);
  } catch (error) {
    console.error('Error fetching tenant analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;