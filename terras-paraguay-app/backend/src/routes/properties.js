const express = require('express');
const { Op } = require('sequelize');
const { body, query, validationResult } = require('express-validator');
const Property = require('../models/Property');
const auth = require('../middleware/auth');
const { checkPlanLimits } = require('../middleware/tenant');

const router = express.Router();

/**
 * GET /api/properties
 * Listar propriedades do tenant com filtros
 */
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('property_type').optional().isIn(['house', 'apartment', 'duplex', 'farm', 'ranch', 'land', 'commercial']),
  query('purpose').optional().isIn(['sale', 'rent', 'lease']),
  query('status').optional().isIn(['active', 'inactive', 'sold', 'rented', 'reserved']),
  query('min_price').optional().isNumeric(),
  query('max_price').optional().isNumeric(),
  query('city').optional().isString(),
  query('search').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant required' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    // Construir filtros
    const where = {
      tenant_id: req.tenant.id,
      status: req.query.status || 'active'
    };

    if (req.query.property_type) {
      where.property_type = req.query.property_type;
    }

    if (req.query.purpose) {
      where.purpose = req.query.purpose;
    }

    // Filtros de preço
    if (req.query.min_price || req.query.max_price) {
      const priceFilter = {};
      if (req.query.min_price) {
        priceFilter[Op.gte] = parseFloat(req.query.min_price);
      }
      if (req.query.max_price) {
        priceFilter[Op.lte] = parseFloat(req.query.max_price);
      }
      where['pricing.sale_price'] = priceFilter;
    }

    // Filtro de cidade
    if (req.query.city) {
      where['location.city'] = { [Op.iLike]: `%${req.query.city}%` };
    }

    // Busca textual
    if (req.query.search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${req.query.search}%` } },
        { description: { [Op.iLike]: `%${req.query.search}%` } },
        { 'location.address': { [Op.iLike]: `%${req.query.search}%` } },
        { 'location.neighborhood': { [Op.iLike]: `%${req.query.search}%` } }
      ];
    }

    const { count, rows: properties } = await Property.findAndCountAll({
      where,
      limit,
      offset,
      order: [
        ['is_featured', 'DESC'],
        ['priority', 'DESC'],
        ['created_at', 'DESC']
      ]
    });

    // Incrementar views para propriedades visualizadas
    if (properties.length > 0) {
      const propertyIds = properties.map(p => p.id);
      await Property.update(
        {
          analytics: Property.sequelize.literal(`
            jsonb_set(
              analytics,
              '{views}',
              ((analytics->>'views')::int + 1)::text::jsonb
            )
          `)
        },
        {
          where: { id: { [Op.in]: propertyIds } }
        }
      );
    }

    res.json({
      properties,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/properties/:id
 * Buscar propriedade específica
 */
router.get('/:id', async (req, res) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant required' });
    }

    const property = await Property.findOne({
      where: {
        id: req.params.id,
        tenant_id: req.tenant.id
      }
    });

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Incrementar visualização
    await property.update({
      analytics: {
        ...property.analytics,
        views: (property.analytics.views || 0) + 1,
        last_view_at: new Date()
      }
    });

    res.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/properties
 * Criar nova propriedade
 */
router.post('/', auth, checkPlanLimits('properties'), [
  body('title').trim().isLength({ min: 5, max: 200 }),
  body('property_type').isIn(['house', 'apartment', 'duplex', 'farm', 'ranch', 'land', 'commercial']),
  body('purpose').optional().isIn(['sale', 'rent', 'lease']),
  body('pricing.sale_price').optional().isNumeric(),
  body('location.address').optional().isString(),
  body('location.city').optional().isString(),
  body('features.area_total').optional().isNumeric()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant required' });
    }

    // Verificar permissões
    if (!req.user.hasPermission('properties', 'create')) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    // Gerar slug único
    const baseSlug = req.body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    let slug = baseSlug;
    let counter = 1;

    while (await Property.findOne({ where: { slug, tenant_id: req.tenant.id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const property = await Property.create({
      ...req.body,
      tenant_id: req.tenant.id,
      slug,
      analytics: {
        views: 0,
        leads: 0,
        favorites: 0,
        source_tracking: {}
      }
    });

    res.status(201).json({
      message: 'Property created successfully',
      property
    });
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /api/properties/:id
 * Atualizar propriedade
 */
router.put('/:id', auth, [
  body('title').optional().trim().isLength({ min: 5, max: 200 }),
  body('property_type').optional().isIn(['house', 'apartment', 'duplex', 'farm', 'ranch', 'land', 'commercial']),
  body('purpose').optional().isIn(['sale', 'rent', 'lease']),
  body('status').optional().isIn(['active', 'inactive', 'sold', 'rented', 'reserved'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant required' });
    }

    // Verificar permissões
    if (!req.user.hasPermission('properties', 'update')) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    const property = await Property.findOne({
      where: {
        id: req.params.id,
        tenant_id: req.tenant.id
      }
    });

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Remover campos que não devem ser atualizados diretamente
    const { tenant_id, id, created_at, ...updates } = req.body;

    await property.update(updates);

    res.json({
      message: 'Property updated successfully',
      property
    });
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /api/properties/:id
 * Deletar propriedade
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant required' });
    }

    // Verificar permissões
    if (!req.user.hasPermission('properties', 'delete')) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    const property = await Property.findOne({
      where: {
        id: req.params.id,
        tenant_id: req.tenant.id
      }
    });

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    await property.destroy();

    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/properties/stats/summary
 * Estatísticas das propriedades do tenant
 */
router.get('/stats/summary', async (req, res) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant required' });
    }

    const stats = {
      total: await Property.count({
        where: { tenant_id: req.tenant.id }
      }),
      by_status: await Property.findAll({
        where: { tenant_id: req.tenant.id },
        attributes: [
          'status',
          [Property.sequelize.fn('COUNT', '*'), 'count']
        ],
        group: ['status']
      }),
      by_type: await Property.findAll({
        where: { tenant_id: req.tenant.id },
        attributes: [
          'property_type',
          [Property.sequelize.fn('COUNT', '*'), 'count']
        ],
        group: ['property_type']
      }),
      by_purpose: await Property.findAll({
        where: { tenant_id: req.tenant.id },
        attributes: [
          'purpose',
          [Property.sequelize.fn('COUNT', '*'), 'count']
        ],
        group: ['purpose']
      }),
      featured: await Property.count({
        where: {
          tenant_id: req.tenant.id,
          is_featured: true
        }
      })
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching property stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;