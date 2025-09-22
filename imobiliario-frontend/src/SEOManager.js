import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Funções utilitárias SEO
export const generateSlug = (property) => {
  const { title, location, price, type, id } = property;
  const slug = `${type}-${title}-${location}-${price}-${id}`
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  return slug;
};

export const generateMetaTags = (property) => {
  const { title, description, price, location, type, images } = property;
  
  return {
    title: `${title} - ${location} - ${type} | Terras Paraguay`,
    description: `${description} Por ${price}. ${type} em ${location}. Invista no Paraguai com segurança.`,
    keywords: `${type}, ${location}, paraguai, imóveis, investimento`,
    ogTitle: `${title} - ${location}`,
    ogDescription: `${type} por ${price} em ${location}. ${description.substring(0, 150)}...`,
    ogImage: images && images[0] ? images[0] : '/default-property.jpg',
    ogUrl: `https://terrasnoparaguay.com/propriedade/${generateSlug(property)}`
  };
};

export const generateStructuredData = (property) => {
  const { title, description, price, location, type, images, bedrooms, bathrooms, area } = property;
  
  return {
    "@context": "https://schema.org",
    "@type": "RealEstate",
    "name": title,
    "description": description,
    "url": `https://terrasnoparaguay.com/propriedade/${generateSlug(property)}`,
    "image": images || ["/default-property.jpg"],
    "offers": {
      "@type": "Offer",
      "price": String(price).replace(/[^0-9]/g, ''),
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": location,
      "addressCountry": "Paraguay"
    },
    "broker": {
      "@type": "Organization",
      "name": "Terras Paraguay",
      "url": "https://terrasnoparaguay.com"
    }
  };
};

// Componente SEO Head
export const SEOHead = ({ property }) => {
  const metaTags = generateMetaTags(property);
  const structuredData = generateStructuredData(property);
  
  useEffect(() => {
    document.title = metaTags.title;
    
    const updateMetaTag = (name, content, property = 'name') => {
      let meta = document.querySelector(`meta[${property}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(property, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };
    
    updateMetaTag('description', metaTags.description);
    updateMetaTag('keywords', metaTags.keywords);
    updateMetaTag('og:title', metaTags.ogTitle, 'property');
    updateMetaTag('og:description', metaTags.ogDescription, 'property');
    updateMetaTag('og:image', metaTags.ogImage, 'property');
    updateMetaTag('og:url', metaTags.ogUrl, 'property');
    updateMetaTag('og:type', 'website', 'property');
    
    let structuredDataScript = document.querySelector('script[type="application/ld+json"]');
    if (!structuredDataScript) {
      structuredDataScript = document.createElement('script');
      structuredDataScript.type = 'application/ld+json';
      document.head.appendChild(structuredDataScript);
    }
    structuredDataScript.textContent = JSON.stringify(structuredData);
    
  }, [property]);
  
  return null;
};

// Página da Propriedade
export const PropertyPage = ({ propertyId, properties }) => {
  const property = properties.find(p => p.id === parseInt(propertyId));
  
  if (!property) {
    return <div>Propriedade não encontrada</div>;
  }
  
  return (
    <div>
      <SEOHead property={property} />
      
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>{property.title}</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
          <div>
            {property.images && property.images.length > 0 ? (
              <img 
                src={property.images[0]} 
                alt={property.title}
                style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '8px' }}
              />
            ) : (
              <div style={{ 
                width: '100%', 
                height: '400px', 
                backgroundColor: '#f3f4f6', 
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                Sem imagem disponível
              </div>
            )}
          </div>
          
          <div style={{ padding: '20px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
            <h2 style={{ color: '#059669', marginBottom: '15px' }}>Detalhes</h2>
            
            <div style={{ marginBottom: '15px' }}>
              <strong>Preço:</strong> {property.price}
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <strong>Localização:</strong> {property.location}
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <strong>Tipo:</strong> {property.type}
            </div>
            
            <div style={{ marginTop: '20px' }}>
              <button style={{
                backgroundColor: '#059669',
                color: 'white',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                width: '100%'
              }}>
                Entrar em Contato
              </button>
            </div>
          </div>
        </div>
        
        <div style={{ marginTop: '30px' }}>
          <h3>Descrição</h3>
          <p style={{ lineHeight: '1.6', color: '#374151' }}>
            {property.description}
          </p>
        </div>
      </div>
    </div>
  );
};