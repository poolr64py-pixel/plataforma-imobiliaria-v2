const express = require('express');
const { Op } = require('sequelize');
const Tenant = require('../models/Tenant');
const Property = require('../models/Property');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { requireFeature } = require('../middleware/tenant');

const router = express.Router();

/**
 * GET /api/tenants/config
 * Retorna configuração pública do tenant atual
 */
router.get('/config', async (req, res) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }

    const config = {
      id: req.tenant.id,
      slug: req.tenant.slug,
      name: req.tenant.name,
      domain: req.tenant.domain,
      branding: req.tenant.branding,
      business_config: req.tenant.business_config,
      contact_info: req.tenant.contact_info,
      seo_config: {
        meta_title: req.tenant.seo_config.meta_title,
        meta_description: req.tenant.seo_config.meta_description,
        structured_data: req.tenant.seo_config.structured_data
      },
      features_public: {
        virtual_tour_360: req.tenant.features.virtual_tour_360,
        advanced_search: req.tenant.features.advanced_search
      }
    };

    res.json(config);
  } catch (error) {
    console.error('Error fetching tenant config:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/tenants/stats
 * Estatísticas públicas do tenant
 */
router.get('/stats', async (req, res) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }

    const stats = {
      total_properties: await Property.count({
        where: {
          tenant_id: req.tenant.id,
          status: 'active'
        }
      }),
      property_types: await Property.findAll({
        where: {
          tenant_id: req.tenant.id,
          status: 'active'
        },
        attributes: [
          'property_type',
          [Property.sequelize.fn('COUNT', '*'), 'count']
        ],
        group: ['property_type']
      }),
      cities: await Property.findAll({
        where: {
          tenant_id: req.tenant.id,
          status: 'active'
        },
        attributes: [
          [Property.sequelize.fn('JSON_EXTRACT', Property.sequelize.col('location'), '$.city'), 'city'],
          [Property.sequelize.fn('COUNT', '*'), 'count']
        ],
        group: [Property.sequelize.fn('JSON_EXTRACT', Property.sequelize.col('location'), '$.city')],
        limit: 10
      })
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching tenant stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /api/tenants/config
 * Atualizar configuração do tenant (apenas admin do tenant)
 */
router.put('/config', auth, async (req, res) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }

    // Verificar se usuário é admin do tenant
    if (req.user.tenant_id !== req.tenant.id || !req.user.isTenantAdmin()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const allowedUpdates = [
      'name', 'branding', 'business_config',
      'contact_info', 'seo_config', 'integrations'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    await req.tenant.update(updates);

    res.json({
      message: 'Tenant configuration updated successfully',
      tenant: req.tenant
    });
  } catch (error) {
    console.error('Error updating tenant config:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/tenants/dashboard
 * Dashboard do tenant com métricas detalhadas
 */
router.get('/dashboard', auth, async (req, res) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }

    // Verificar se usuário pertence ao tenant
    if (req.user.tenant_id !== req.tenant.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const dashboard = {
      properties: {
        total: await Property.count({
          where: { tenant_id: req.tenant.id }
        }),
        active: await Property.count({
          where: {
            tenant_id: req.tenant.id,
            status: 'active'
          }
        }),
        sold_rented: await Property.count({
          where: {
            tenant_id: req.tenant.id,
            status: ['sold', 'rented']
          }
        }),
        recent: await Property.count({
          where: {
            tenant_id: req.tenant.id,
            created_at: { [Op.gte]: thirtyDaysAgo }
          }
        })
      },
      users: {
        total: await User.count({
          where: { tenant_id: req.tenant.id }
        }),
        active: await User.count({
          where: {
            tenant_id: req.tenant.id,
            status: 'active'
          }
        })
      },
      plan_usage: {
        properties: {
          current: await Property.count({
            where: { tenant_id: req.tenant.id }
          }),
          limit: req.tenant.limits.max_properties
        },
        users: {
          current: await User.count({
            where: { tenant_id: req.tenant.id }
          }),
          limit: req.tenant.limits.max_users
        }
      },
      tenant_info: {
        name: req.tenant.name,
        plan: req.tenant.plan,
        status: req.tenant.status,
        license_expires_at: req.tenant.license_expires_at,
        features: req.tenant.features
      }
    };

    res.json(dashboard);
  } catch (error) {
    console.error('Error fetching tenant dashboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;