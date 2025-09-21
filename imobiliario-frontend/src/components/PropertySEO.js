import { useEffect } from 'react';

const PropertySEO = ({ property }) => {
  useEffect(() => {
    if (!property) return;

    // Geração de slug para URL amigável
    const generateSlug = (property) => {
      const { title, location, price, type } = property;
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

    // Geração de meta tags
    const generateMetaTags = (property) => {
      const { title, description, location, price, currency = 'USD', type, area, rooms, bathrooms } = property;

      // Title otimizado
      const city = location ? location.split(',')[0] : 'Paraguay';
      const typeTranslated = {
        'house': 'Casa',
        'apartment': 'Apartamento',
        'farm': 'Fazenda',
        'ranch': 'Estância',
        'land': 'Terreno'
      }[type] || type;

      const seoTitle = `${title} - ${city} - ${typeTranslated} - Terras Paraguay`;

      // Description otimizada
      const priceText = price ? `${currency} ${price.toLocaleString()}` : 'Consultar preço';
      const areaText = area ? ` - ${area}${property.areaUnit || 'm²'}` : '';
      const roomsText = rooms ? ` - ${rooms} quartos` : '';
      const bathroomsText = bathrooms ? ` - ${bathrooms} banheiros` : '';

      const seoDescription = `${title} em ${location}. ${priceText}${areaText}${roomsText}${bathroomsText}. ${description ? description.substring(0, 100) + '...' : 'Excelente oportunidade de investimento no Paraguay.'}`;

      // Keywords
      const keywords = [
        city.toLowerCase(),
        typeTranslated.toLowerCase(),
        'paraguay',
        'imoveis',
        'investimento',
        'terras',
        price && price < 100000 ? 'barato' : 'premium',
        type === 'farm' || type === 'ranch' ? 'agronegocio' : 'residencial'
      ].filter(Boolean).join(', ');

      return { seoTitle, seoDescription, keywords };
    };

    // Structured Data JSON-LD
    const generateStructuredData = (property) => {
      const { title, description, location, price, currency = 'USD', images = [], coordinates, realtor, type, area, rooms, bathrooms } = property;

      const structuredData = {
        "@context": "https://schema.org",
        "@type": "RealEstateListing",
        "name": title,
        "description": description,
        "url": `${window.location.origin}/propriedade/${generateSlug(property)}`,
        "price": price,
        "priceCurrency": currency,
        "availability": "https://schema.org/InStock",
        "category": "RealEstate",
        "areaServed": location,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": location?.split(',')[0],
          "addressCountry": "PY"
        },
        "geo": coordinates ? {
          "@type": "GeoCoordinates",
          "latitude": coordinates.lat,
          "longitude": coordinates.lng
        } : undefined,
        "floorSize": area ? {
          "@type": "QuantitativeValue",
          "value": area,
          "unitText": property.areaUnit || "m²"
        } : undefined,
        "numberOfRooms": rooms,
        "numberOfBathroomsTotal": bathrooms,
        "image": images.length > 0 ? images[0] : undefined,
        "seller": realtor ? {
          "@type": "RealEstateAgent",
          "name": realtor.name,
          "telephone": realtor.phone,
          "email": realtor.email
        } : {
          "@type": "Organization",
          "name": "Terras Paraguay",
          "telephone": "+595971123456",
          "email": "contato@terrasparaguay.com"
        },
        "datePosted": property.createdAt || property.criadoEm,
        "offers": {
          "@type": "Offer",
          "price": price,
          "priceCurrency": currency,
          "availability": "https://schema.org/InStock",
          "validFrom": property.createdAt || property.criadoEm,
          "seller": {
            "@type": "Organization",
            "name": "Terras Paraguay"
          }
        }
      };

      // Remove undefined values
      Object.keys(structuredData).forEach(key => {
        if (structuredData[key] === undefined) {
          delete structuredData[key];
        }
      });

      return structuredData;
    };

    // Open Graph tags
    const generateOpenGraphTags = (property) => {
      const { title, description, images = [], location, price, currency = 'USD' } = property;
      const priceText = price ? `${currency} ${price.toLocaleString()}` : 'Consultar preço';

      return {
        'og:title': `${title} - ${location}`,
        'og:description': `${priceText} - ${description ? description.substring(0, 200) : 'Excelente oportunidade de investimento no Paraguay'}`,
        'og:image': images[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=630&fit=crop',
        'og:url': `${window.location.origin}/propriedade/${generateSlug(property)}`,
        'og:type': 'article',
        'og:site_name': 'Terras Paraguay',
        'og:locale': 'pt_BR',
        'twitter:card': 'summary_large_image',
        'twitter:title': `${title} - ${location}`,
        'twitter:description': `${priceText} - ${description ? description.substring(0, 200) : 'Excelente oportunidade no Paraguay'}`,
        'twitter:image': images[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=630&fit=crop'
      };
    };

    // Aplicar meta tags
    const { seoTitle, seoDescription, keywords } = generateMetaTags(property);
    const openGraphTags = generateOpenGraphTags(property);
    const structuredData = generateStructuredData(property);

    // Update document title
    document.title = seoTitle;

    // Update or create meta tags
    const updateMetaTag = (property, content) => {
      let meta = document.querySelector(`meta[property="${property}"], meta[name="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        if (property.startsWith('og:') || property.startsWith('twitter:')) {
          meta.setAttribute('property', property);
        } else {
          meta.setAttribute('name', property);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', seoDescription);
    updateMetaTag('keywords', keywords);
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('author', 'Terras Paraguay');

    // Open Graph and Twitter tags
    Object.entries(openGraphTags).forEach(([property, content]) => {
      updateMetaTag(property, content);
    });

    // Structured data
    let structuredDataScript = document.querySelector('script[type="application/ld+json"]#property-data');
    if (!structuredDataScript) {
      structuredDataScript = document.createElement('script');
      structuredDataScript.type = 'application/ld+json';
      structuredDataScript.id = 'property-data';
      document.head.appendChild(structuredDataScript);
    }
    structuredDataScript.textContent = JSON.stringify(structuredData);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `${window.location.origin}/propriedade/${generateSlug(property)}`;

    // Cleanup function
    return () => {
      // Reset to default title when component unmounts
      document.title = 'Terras Paraguay - Imóveis Premium no Paraguay';
    };
  }, [property]);

  return null; // This component doesn't render anything
};

export default PropertySEO;