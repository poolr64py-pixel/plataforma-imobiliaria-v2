const express = require('express');
const router = express.Router();

// Mock data - should be replaced with actual database in production
const mockProperties = require('../data/properties.json');

// Generate sitemap.xml
router.get('/sitemap.xml', (req, res) => {
  try {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3003';
    const currentDate = new Date().toISOString().split('T')[0];

    // Generate slug for property
    const generateSlug = (property) => {
      const { title, location, price } = property;
      const parts = [];

      if (title) {
        parts.push(title.toLowerCase()
          .replace(/[áàâãä]/g, 'a')
          .replace(/[éèêë]/g, 'e')
          .replace(/[íìîï]/g, 'i')
          .replace(/[óòôõö]/g, 'o')
          .replace(/[úùûü]/g, 'u')
          .replace(/[ç]/g, 'c')
          .replace(/[ñ]/g, 'n')
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, ''));
      }

      if (location) {
        const city = location.split(',')[0].toLowerCase()
          .replace(/[áàâãä]/g, 'a')
          .replace(/[éèêë]/g, 'e')
          .replace(/[íìîï]/g, 'i')
          .replace(/[óòôõö]/g, 'o')
          .replace(/[úùûü]/g, 'u')
          .replace(/[ç]/g, 'c')
          .replace(/[ñ]/g, 'n')
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
        parts.push(city);
      }

      if (price) {
        parts.push(price.toString());
      }

      return parts.join('-');
    };

    // Calculate priority based on property characteristics
    const calculatePriority = (property) => {
      let priority = 0.5;

      // Higher priority for premium properties
      if (property.price > 200000) priority += 0.2;

      // Higher priority for houses and farms
      if (property.type === 'house' || property.type === 'farm') priority += 0.1;

      // Higher priority for properties with more images
      if (property.images && property.images.length > 3) priority += 0.1;

      // Higher priority for properties with high ratings
      if (property.rating > 4.5) priority += 0.1;

      return Math.min(priority, 1.0).toFixed(1);
    };

    // Start sitemap XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

    // Homepage
    sitemap += `
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

    // Category pages
    const categories = [
      { path: '/propriedades', name: 'Todas as Propriedades' },
      { path: '/casas', name: 'Casas' },
      { path: '/apartamentos', name: 'Apartamentos' },
      { path: '/fazendas', name: 'Fazendas' },
      { path: '/terrenos', name: 'Terrenos' }
    ];

    categories.forEach(category => {
      sitemap += `
  <url>
    <loc>${baseUrl}${category.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    // Individual property pages
    mockProperties.forEach(property => {
      const slug = generateSlug(property);
      const priority = calculatePriority(property);
      const lastMod = property.createdAt || property.criadoEm || currentDate;

      sitemap += `
  <url>
    <loc>${baseUrl}/propriedade/${slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>`;

      // Add images to sitemap
      if (property.images && property.images.length > 0) {
        property.images.forEach((image, index) => {
          if (index < 5) { // Limit to 5 images per property
            sitemap += `
    <image:image>
      <image:loc>${image}</image:loc>
      <image:title>${property.title} - Imagem ${index + 1}</image:title>
      <image:caption>${property.description ? property.description.substring(0, 100) : property.title}</image:caption>
    </image:image>`;
          }
        });
      }

      sitemap += `
  </url>`;
    });

    // Location-based pages
    const locations = [...new Set(mockProperties.map(p => p.location?.split(',')[0]).filter(Boolean))];
    locations.forEach(location => {
      const slug = location.toLowerCase()
        .replace(/[áàâãä]/g, 'a')
        .replace(/[éèêë]/g, 'e')
        .replace(/[íìîï]/g, 'i')
        .replace(/[óòôõö]/g, 'o')
        .replace(/[úùûü]/g, 'u')
        .replace(/[ç]/g, 'c')
        .replace(/[ñ]/g, 'n')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      sitemap += `
  <url>
    <loc>${baseUrl}/localidade/${slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    // Close sitemap
    sitemap += `
</urlset>`;

    res.set('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).json({ error: 'Failed to generate sitemap' });
  }
});

// Generate robots.txt
router.get('/robots.txt', (req, res) => {
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3003';

  const robots = `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/api/sitemap.xml

# Disallow admin areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/

# Allow specific paths
Allow: /propriedade/
Allow: /localidade/
Allow: /casas/
Allow: /apartamentos/
Allow: /fazendas/
Allow: /terrenos/

# Crawl delay
Crawl-delay: 1`;

  res.set('Content-Type', 'text/plain');
  res.send(robots);
});

module.exports = router;