const Tenant = require('../models/Tenant');

/**
 * Middleware para resolução de tenant baseado em:
 * 1. Subdomínio (cliente1.plataforma.com)
 * 2. Header X-Tenant-Slug
 * 3. Query parameter ?tenant=slug
 * 4. Domain personalizado (cliente.com.br)
 */
const tenantMiddleware = async (req, res, next) => {
  try {
    let tenantSlug = null;
    let tenant = null;

    // 1. Verificar header X-Tenant-Slug (prioridade máxima)
    if (req.headers['x-tenant-slug']) {
      tenantSlug = req.headers['x-tenant-slug'];
    }

    // 2. Verificar query parameter
    else if (req.query.tenant) {
      tenantSlug = req.query.tenant;
    }

    // 3. Verificar subdomínio
    else {
      const host = req.get('host') || '';
      const subdomain = host.split('.')[0];

      // Se não é localhost e tem subdomínio válido
      if (!host.includes('localhost') && subdomain && subdomain !== 'www' && subdomain !== 'api') {
        tenantSlug = subdomain;
      }
    }

    // 4. Buscar tenant por slug
    if (tenantSlug) {
      tenant = await Tenant.findOne({
        where: { slug: tenantSlug, status: 'active' }
      });
    }

    // 5. Se não encontrou por slug, tentar por domínio personalizado
    if (!tenant && req.get('host')) {
      const domain = req.get('host');
      tenant = await Tenant.findOne({
        where: { domain, status: 'active' }
      });
    }

    // Verificar se tenant existe e está ativo
    if (tenant) {
      // Verificar se licença não expirou
      if (tenant.license_expires_at && new Date() > tenant.license_expires_at) {
        return res.status(403).json({
          error: 'Tenant license expired',
          code: 'LICENSE_EXPIRED'
        });
      }

      // Atualizar última atividade
      await tenant.update({ last_activity_at: new Date() });

      // Adicionar tenant ao request
      req.tenant = tenant;
      req.tenantId = tenant.id;
    }

    // Para rotas administrativas, permitir sem tenant
    if (req.path.startsWith('/api/admin') || req.path.startsWith('/admin')) {
      return next();
    }

    // Para rotas de API que precisam de tenant
    if (req.path.startsWith('/api/') && !tenant) {
      return res.status(400).json({
        error: 'Tenant not specified or not found',
        code: 'TENANT_REQUIRED',
        hint: 'Use X-Tenant-Slug header or ?tenant=slug parameter'
      });
    }

    next();
  } catch (error) {
    console.error('Tenant middleware error:', error);
    res.status(500).json({
      error: 'Error resolving tenant',
      code: 'TENANT_RESOLUTION_ERROR'
    });
  }
};

/**
 * Middleware para verificar se tenant tem feature habilitada
 */
const requireFeature = (featureName) => {
  return (req, res, next) => {
    if (!req.tenant) {
      return res.status(400).json({
        error: 'Tenant required',
        code: 'TENANT_REQUIRED'
      });
    }

    if (!req.tenant.features[featureName]) {
      return res.status(403).json({
        error: `Feature '${featureName}' not available in current plan`,
        code: 'FEATURE_NOT_AVAILABLE',
        upgrade_url: `/admin/billing/upgrade?feature=${featureName}`
      });
    }

    next();
  };
};

/**
 * Middleware para verificar limites do plano
 */
const checkPlanLimits = (limitType) => {
  return async (req, res, next) => {
    if (!req.tenant) {
      return res.status(400).json({
        error: 'Tenant required',
        code: 'TENANT_REQUIRED'
      });
    }

    try {
      const limits = req.tenant.limits;
      let currentUsage = 0;

      switch (limitType) {
        case 'properties':
          // Contar propriedades do tenant
          const Property = require('../models/Property');
          currentUsage = await Property.count({
            where: { tenant_id: req.tenant.id }
          });
          break;

        case 'users':
          // Contar usuários do tenant
          const User = require('../models/User');
          currentUsage = await User.count({
            where: { tenant_id: req.tenant.id }
          });
          break;
      }

      const maxAllowed = limits[`max_${limitType}`];
      if (maxAllowed && currentUsage >= maxAllowed) {
        return res.status(403).json({
          error: `Plan limit reached for ${limitType}`,
          code: 'PLAN_LIMIT_REACHED',
          current: currentUsage,
          max: maxAllowed,
          upgrade_url: `/admin/billing/upgrade`
        });
      }

      req.currentUsage = currentUsage;
      req.maxAllowed = maxAllowed;
      next();
    } catch (error) {
      console.error('Plan limits check error:', error);
      next();
    }
  };
};

module.exports = {
  tenantMiddleware,
  requireFeature,
  checkPlanLimits
};