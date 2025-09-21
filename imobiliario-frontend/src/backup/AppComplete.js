import React, { useState, useEffect, useCallback } from 'react';
import PropertyDetailsAdvanced from './PropertyDetailsAdvanced';
import SearchSystem from './components/SearchSystem';

function AppComplete() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [status, setStatus] = useState('Carregando...');
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('price-asc');
  const [exchangeRates, setExchangeRates] = useState({
    USD_PYG: 7800,
    USD_BRL: 5.8,
    PYG_BRL: 0.00074
  });

  const propertiesPerPage = 9;

  // Environment detection
  const isDevelopment = window.location.hostname === 'localhost';
  const API_BASE = isDevelopment ? 'http://localhost:3001' : process.env.REACT_APP_API_URL || 'https://api.terrasparaguay.com';

  // Fetch exchange rates
  const fetchExchangeRates = async () => {
    try {
      const rates = {
        USD_PYG: 7800 + Math.random() * 100 - 50,
        USD_BRL: 5.8 + Math.random() * 0.2 - 0.1,
        PYG_BRL: 0.00074 + Math.random() * 0.00001 - 0.000005
      };
      setExchangeRates(rates);
    } catch (error) {
      console.error('Erro ao buscar cotações:', error);
    }
  };

  const formatPrice = (price) => {
    if (!price || price === undefined || price === null) {
      return 'Consultar preço';
    }

    if (typeof price === 'string') {
      const numPrice = parseFloat(price.replace(/[^\\d.-]/g, ''));
      return isNaN(numPrice) ? 'Consultar preço' : `USD ${numPrice.toLocaleString()}`;
    }

    if (typeof price === 'number') {
      return `USD ${price.toLocaleString()}`;
    }

    return 'Consultar preço';
  };

  // SEO optimization
  useEffect(() => {
    document.title = 'Terras Paraguay - Imóveis Premium | Sistema Avançado de Busca';

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Sistema avançado de busca de imóveis no Paraguay com cotações em tempo real, galeria de imagens e filtros profissionais. Mais de 15 anos no mercado.');
    }

    // Add structured data for SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      "name": "Terras Paraguay",
      "description": "Sistema avançado de busca de imóveis com cotações em tempo real",
      "url": window.location.origin,
      "telephone": "+595971123456",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "PY",
        "addressLocality": "Asunción"
      },
      "areaServed": ["Paraguay", "Brasil"],
      "serviceType": "Real Estate Advanced Search"
    };

    let script = document.querySelector('script[type="application/ld+json"]');
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);

    fetchExchangeRates();
    const interval = setInterval(fetchExchangeRates, 30000);

    fetchData();

    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      console.log('🚀 Iniciando sistema avançado Terras Paraguay...');
      console.log('🔗 API Base URL:', API_BASE);

      const healthResponse = await fetch(`${API_BASE}/api/health`);
      const healthData = await healthResponse.json();
      console.log('✅ Status do backend:', healthData);
      setStatus('Sistema Online ✅');

      const propertiesResponse = await fetch(`${API_BASE}/api/properties`);
      const propertiesData = await propertiesResponse.json();
      console.log('🏠 Propriedades carregadas:', propertiesData);

      if (propertiesData.success) {
        console.log('📊 Total de propriedades:', propertiesData.data.length);
        setProperties(propertiesData.data);
        setFilteredProperties(propertiesData.data);
      }
      setError(null);
    } catch (error) {
      console.error('❌ Erro na conexão:', error);
      setStatus('Backend offline ❌');
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchResults = useCallback((filtered) => {
    setFilteredProperties(filtered);
    setCurrentPage(1);
  }, []);

  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
  };

  const handleCloseModal = () => {
    setSelectedProperty(null);
  };

  const toggleFavorite = (id) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
    localStorage.setItem('terras-paraguay-favorites', JSON.stringify([...newFavorites]));
  };

  const handleWhatsAppContact = (property) => {
    const message = property.title ?
      `Olá! Tenho interesse na propriedade: ${property.title} - ${formatPrice(property.price)}. Localizada em ${property.location}. Gostaria de mais informações.` :
      'Olá! Gostaria de mais informações sobre os imóveis disponíveis no Paraguay.';

    const phoneNumber = '+595971123456';
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('terras-paraguay-favorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  // Sort properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return (a.price || 0) - (b.price || 0);
      case 'price-desc':
        return (b.price || 0) - (a.price || 0);
      case 'newest':
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      case 'area-desc':
        return (b.area || 0) - (a.area || 0);
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedProperties.length / propertiesPerPage);
  const startIndex = (currentPage - 1) * propertiesPerPage;
  const currentProperties = sortedProperties.slice(startIndex, startIndex + propertiesPerPage);

  // Professional Header Component
  const ProfessionalHeader = () => (
    <header style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      borderBottom: '1px solid #e2e8f0'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '80px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
              }}>
                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>TP</span>
              </div>
              <div>
                <span style={{ fontWeight: 'bold', fontSize: '24px', color: '#1f2937' }}>Terras Paraguay</span>
                <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '-2px' }}>Sistema Avançado de Busca</div>
              </div>
            </div>
          </div>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <a href="#inicio" style={{ color: '#374151', fontWeight: '500', textDecoration: 'none', padding: '8px 0', borderBottom: '2px solid transparent', transition: 'all 0.2s ease' }}>Início</a>
            <a href="#imoveis" style={{ color: '#374151', fontWeight: '500', textDecoration: 'none', padding: '8px 0', borderBottom: '2px solid transparent', transition: 'all 0.2s ease' }}>Imóveis</a>
            <a href="#busca" style={{ color: '#374151', fontWeight: '500', textDecoration: 'none', padding: '8px 0', borderBottom: '2px solid transparent', transition: 'all 0.2s ease' }}>Busca Avançada</a>
            <a href="#cotacoes" style={{ color: '#374151', fontWeight: '500', textDecoration: 'none', padding: '8px 0', borderBottom: '2px solid transparent', transition: 'all 0.2s ease' }}>Cotações</a>
            <a href="#sobre" style={{ color: '#374151', fontWeight: '500', textDecoration: 'none', padding: '8px 0', borderBottom: '2px solid transparent', transition: 'all 0.2s ease' }}>Sobre</a>
            <a href="#contato" style={{ color: '#374151', fontWeight: '500', textDecoration: 'none', padding: '8px 0', borderBottom: '2px solid transparent', transition: 'all 0.2s ease' }}>Contato</a>
            <button
              onClick={() => setShowContactModal(true)}
              style={{
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '10px',
                border: 'none',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(5, 150, 105, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(5, 150, 105, 0.3)';
              }}
            >
              💬 Fale Conosco
            </button>
          </nav>
        </div>

        {/* Real-time Exchange Rates Bar */}
        <div style={{
          background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '8px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(5, 150, 105, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>💱</span>
            <span style={{ fontWeight: '600' }}>Cotações em Tempo Real:</span>
          </div>
          <div style={{ display: 'flex', gap: '32px', fontSize: '14px' }}>
            <div>
              <span style={{ opacity: 0.9 }}>USD → PYG:</span>
              <span style={{ fontWeight: '700', marginLeft: '6px' }}>₲ {exchangeRates.USD_PYG.toLocaleString()}</span>
            </div>
            <div>
              <span style={{ opacity: 0.9 }}>USD → BRL:</span>
              <span style={{ fontWeight: '700', marginLeft: '6px' }}>R$ {exchangeRates.USD_BRL.toFixed(2)}</span>
            </div>
            <div>
              <span style={{ opacity: 0.9 }}>PYG → BRL:</span>
              <span style={{ fontWeight: '700', marginLeft: '6px' }}>R$ {exchangeRates.PYG_BRL.toFixed(6)}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );

  // Hero Section Component
  const HeroSection = () => (
    <section style={{
      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '80px 20px',
        display: 'grid',
        gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr',
        gap: '60px',
        alignItems: 'center'
      }}>
        <div>
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            padding: '10px 20px',
            borderRadius: '25px',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '32px',
            display: 'inline-block'
          }}>
            🚀 Sistema Avançado de Busca
          </div>

          <h1 style={{
            fontSize: window.innerWidth > 768 ? '56px' : '36px',
            fontWeight: 'bold',
            marginBottom: '32px',
            lineHeight: '1.1'
          }}>
            Encontre o Imóvel
            <span style={{ display: 'block', color: '#a7f3d0' }}>dos Seus Sonhos</span>
          </h1>

          <p style={{
            fontSize: '22px',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '40px',
            lineHeight: '1.6'
          }}>
            Sistema profissional com filtros avançados, galeria de imagens interativa,
            cotações em tempo real e mapas integrados.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '32px',
            marginBottom: '40px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'white' }}>{properties.length}+</div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>Imóveis</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'white' }}>15+</div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>Filtros</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'white' }}>3</div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>Moedas</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'white' }}>24/7</div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>Online</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <button
              onClick={() => document.getElementById('busca-avancada').scrollIntoView({ behavior: 'smooth' })}
              style={{
                background: 'white',
                color: '#059669',
                padding: '18px 36px',
                borderRadius: '12px',
                border: 'none',
                fontWeight: '700',
                fontSize: '16px',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.2)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
              }}
            >
              🔍 Busca Avançada
            </button>

            <button
              onClick={() => document.getElementById('propriedades').scrollIntoView({ behavior: 'smooth' })}
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                padding: '18px 36px',
                borderRadius: '12px',
                border: '2px solid rgba(255,255,255,0.3)',
                fontWeight: '600',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              }}
            >
              🏠 Ver Propriedades
            </button>
          </div>
        </div>

        {window.innerWidth > 768 && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: '100%',
              height: '500px',
              background: 'linear-gradient(135deg, #047857 0%, #059669 100%)',
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '80px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}>
              🏡
              <div style={{
                position: 'absolute',
                bottom: '30px',
                left: '30px',
                background: 'rgba(255,255,255,0.95)',
                color: '#059669',
                padding: '16px 24px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '700'
              }}>
                ✨ Sistema Avançado
              </div>
              <div style={{
                position: 'absolute',
                top: '30px',
                right: '30px',
                background: 'rgba(255,255,255,0.95)',
                color: '#059669',
                padding: '16px 24px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '700'
              }}>
                📱 Galeria Interativa
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );

  // Enhanced Property Card
  const PropertyCard = ({ property }) => (
    <div
      style={{
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '0',
        background: 'white',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        overflow: 'hidden',
        ...(viewMode === 'list' && {
          display: 'flex',
          flexDirection: 'row',
          height: '240px'
        })
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
        e.currentTarget.style.borderColor = '#059669';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
        e.currentTarget.style.borderColor = '#e2e8f0';
      }}
      onClick={() => handlePropertyClick(property)}
    >
      {/* Property Image */}
      <div style={{
        width: viewMode === 'list' ? '320px' : '100%',
        height: viewMode === 'list' ? '100%' : '220px',
        background: property.images && property.images.length > 0 ?
          `url(${property.images[0]})` :
          'linear-gradient(135deg, #059669 0%, #047857 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '48px',
        position: 'relative',
        flexShrink: 0
      }}>
        {(!property.images || property.images.length === 0) && '🏠'}

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(property.id);
          }}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: favorites.has(property.id) ? '#ef4444' : 'rgba(255,255,255,0.9)',
            color: favorites.has(property.id) ? 'white' : '#6b7280',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontSize: '18px'
          }}
        >
          ❤️
        </button>

        {/* Property Tags */}
        {property.tags && property.tags.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px'
          }}>
            {property.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                style={{
                  background: '#10b981',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Image Count */}
        {property.images && property.images.length > 1 && (
          <div style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '16px',
            fontSize: '12px',
            fontWeight: '500'
          }}>
            📷 {property.images.length}
          </div>
        )}
      </div>

      <div style={{ padding: '24px', flex: 1 }}>
        <h3 style={{
          color: '#059669',
          margin: '0 0 16px 0',
          fontSize: '20px',
          fontWeight: '700'
        }}>
          {property.title}
        </h3>

        <div style={{ marginBottom: '20px' }}>
          <div style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#059669',
            marginBottom: '8px'
          }}>
            {formatPrice(property.price)}
          </div>
          <div style={{ color: '#6b7280', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            📍 {property.location}
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          marginBottom: '20px',
          fontSize: '14px',
          color: '#374151'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>🏠</span>
            <strong>{property.type}</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>📐</span>
            <strong>{property.area} {property.areaUnit}</strong>
          </div>
          {property.rooms && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>🛏️</span>
              <strong>{property.rooms} quartos</strong>
            </div>
          )}
          {property.bathrooms && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>🚿</span>
              <strong>{property.bathrooms} banheiros</strong>
            </div>
          )}
        </div>

        <p style={{
          color: '#6b7280',
          fontSize: '14px',
          lineHeight: '1.5',
          marginBottom: '20px'
        }}>
          {property.description?.substring(0, 120)}...
        </p>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={{
            flex: 1,
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            color: 'white',
            border: 'none',
            padding: '14px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s ease'
          }}>
            👁️ Ver Detalhes
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleWhatsAppContact(property);
            }}
            style={{
              background: '#10b981',
              color: 'white',
              border: 'none',
              padding: '14px 18px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}
          >
            📱
          </button>
        </div>
      </div>
    </div>
  );

  // Pagination Component
  const Pagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '12px',
        marginTop: '40px'
      }}>
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          style={{
            padding: '12px 20px',
            border: '1px solid #d1d5db',
            borderRadius: '10px',
            background: currentPage === 1 ? '#f3f4f6' : 'white',
            color: currentPage === 1 ? '#9ca3af' : '#374151',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            fontWeight: '500'
          }}
        >
          ← Anterior
        </button>

        {[...Array(totalPages)].map((_, index) => {
          const page = index + 1;
          const isCurrentPage = page === currentPage;

          return (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              style={{
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '10px',
                background: isCurrentPage ? '#059669' : 'white',
                color: isCurrentPage ? 'white' : '#374151',
                cursor: 'pointer',
                fontWeight: isCurrentPage ? '700' : '500',
                minWidth: '48px'
              }}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          style={{
            padding: '12px 20px',
            border: '1px solid #d1d5db',
            borderRadius: '10px',
            background: currentPage === totalPages ? '#f3f4f6' : 'white',
            color: currentPage === totalPages ? '#9ca3af' : '#374151',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            fontWeight: '500'
          }}
        >
          Próximo →
        </button>
      </div>
    );
  };

  // Contact Modal
  const ContactModal = () => {
    if (!showContactModal) return null;

    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: '16px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '40px',
          maxWidth: '600px',
          width: '100%',
          position: 'relative'
        }}>
          <button
            onClick={() => setShowContactModal(false)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'none',
              border: 'none',
              fontSize: '28px',
              cursor: 'pointer',
              color: '#6b7280'
            }}
          >
            ×
          </button>

          <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '32px', color: '#059669' }}>
            💬 Entre em Contato
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <button
              onClick={() => {
                handleWhatsAppContact({});
                setShowContactModal(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '20px',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: '600',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#059669';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#10b981';
              }}
            >
              📱 WhatsApp: +595 971 123456
            </button>

            <button
              onClick={() => {
                window.open('mailto:contato@terrasparaguay.com', '_blank');
                setShowContactModal(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '20px',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: '600',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#2563eb';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#3b82f6';
              }}
            >
              📧 Email: contato@terrasparaguay.com
            </button>

            <div style={{
              padding: '24px',
              background: '#f8fafc',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '16px', lineHeight: '1.6' }}>
                📍 Escritório em Assunción, Paraguay<br />
                🕒 Atendimento: Segunda a Sexta, 8h às 18h<br />
                🌐 Sistema disponível 24/7
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '80px',
            height: '80px',
            border: '6px solid #e5e7eb',
            borderTop: '6px solid #059669',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 24px'
          }} />
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#374151', marginBottom: '12px' }}>
            🚀 Carregando Sistema Avançado
          </h2>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>Preparando busca profissional de imóveis...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#f8fafc',
      minHeight: '100vh'
    }}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        a:hover {
          border-bottom-color: #059669 !important;
        }
      `}</style>

      <ProfessionalHeader />
      <HeroSection />

      <main style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        {/* Status Section */}
        <section style={{
          background: 'white',
          padding: '32px',
          borderRadius: '16px',
          marginBottom: '32px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          border: '1px solid #e2e8f0'
        }}>
          <h2 style={{ color: '#059669', margin: '0 0 24px 0', fontSize: '24px', fontWeight: '700' }}>
            📊 Status do Sistema Avançado
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div style={{ padding: '20px', background: '#ecfdf5', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
              <strong style={{ color: '#059669' }}>✅ Frontend React</strong><br />
              <span style={{ color: '#6b7280' }}>Sistema Avançado Ativo</span>
            </div>
            <div style={{ padding: '20px', background: '#ecfdf5', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
              <strong style={{ color: '#059669' }}>✅ Backend API</strong><br />
              <span style={{ color: '#6b7280' }}>{isDevelopment ? 'Localhost' : 'Produção'}</span>
            </div>
            <div style={{ padding: '20px', background: '#ecfdf5', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
              <strong style={{ color: '#059669' }}>📊 Status</strong><br />
              <span style={{ color: '#6b7280' }}>{status}</span>
            </div>
            <div style={{ padding: '20px', background: '#ecfdf5', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
              <strong style={{ color: '#059669' }}>🏡 Propriedades</strong><br />
              <span style={{ color: '#6b7280' }}>{filteredProperties.length} encontradas</span>
            </div>
          </div>
          {error && (
            <div style={{ color: '#dc2626', marginTop: '20px', padding: '16px', background: '#fef2f2', borderRadius: '12px', border: '1px solid #fecaca' }}>
              ❌ Erro: {error}
            </div>
          )}
        </section>

        {/* Advanced Search System */}
        <div id="busca-avancada">
          <SearchSystem
            properties={properties}
            onSearchResults={handleSearchResults}
            onFiltersChange={(filters) => console.log('🔍 Filtros aplicados:', filters)}
          />
        </div>

        {/* Properties Section */}
        <section id="propriedades" style={{
          background: 'white',
          padding: '32px',
          borderRadius: '16px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <h2 style={{ color: '#059669', margin: 0, fontSize: '28px', fontWeight: '700' }}>
              🏠 Propriedades Premium ({filteredProperties.length})
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              {favorites.size > 0 && (
                <span style={{
                  background: '#fef3c7',
                  color: '#92400e',
                  padding: '10px 20px',
                  borderRadius: '25px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  ❤️ {favorites.size} favoritos
                </span>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <label style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>Ordenar:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                >
                  <option value="price-asc">💰 Menor Preço</option>
                  <option value="price-desc">💰 Maior Preço</option>
                  <option value="newest">🆕 Mais Recentes</option>
                  <option value="area-desc">📐 Maior Área</option>
                </select>
              </div>

              <div style={{ display: 'flex', border: '1px solid #d1d5db', borderRadius: '8px' }}>
                <button
                  onClick={() => setViewMode('grid')}
                  style={{
                    padding: '8px 16px',
                    background: viewMode === 'grid' ? '#059669' : 'white',
                    color: viewMode === 'grid' ? 'white' : '#374151',
                    border: 'none',
                    borderRadius: '8px 0 0 8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  ⊞ Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  style={{
                    padding: '8px 16px',
                    background: viewMode === 'list' ? '#059669' : 'white',
                    color: viewMode === 'list' ? 'white' : '#374151',
                    border: 'none',
                    borderRadius: '0 8px 8px 0',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  ☰ Lista
                </button>
              </div>
            </div>
          </div>

          {currentProperties.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '80px 40px',
              color: '#6b7280'
            }}>
              <div style={{ fontSize: '80px', marginBottom: '20px' }}>🔍</div>
              <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>
                {properties.length === 0 ? 'Carregando propriedades...' : 'Nenhum imóvel encontrado'}
              </h3>
              <p style={{ fontSize: '16px' }}>
                {properties.length === 0 ?
                  'Conectando com o sistema avançado para buscar as propriedades disponíveis.' :
                  'Tente ajustar os filtros para encontrar imóveis que atendam seus critérios.'
                }
              </p>
            </div>
          ) : (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fit, minmax(380px, 1fr))' : '1fr',
                gap: '32px'
              }}>
                {currentProperties.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
              <Pagination />
            </>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer style={{
        marginTop: '60px',
        padding: '60px 20px',
        background: 'linear-gradient(135deg, #047857 0%, #059669 100%)',
        color: 'white'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '40px',
            marginBottom: '40px'
          }}>
            <div>
              <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px' }}>🏡 Terras Paraguay</h3>
              <p style={{ color: 'rgba(255,255,255,0.9)', lineHeight: '1.6', fontSize: '16px' }}>
                Sistema avançado de busca de imóveis com galeria interativa,
                filtros profissionais e cotações em tempo real.
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>📞 Contato</h4>
              <div style={{ color: 'rgba(255,255,255,0.9)', lineHeight: '2', fontSize: '16px' }}>
                <p>📱 WhatsApp: +595 971 123456</p>
                <p>📧 Email: contato@terrasparaguay.com</p>
                <p>📍 Assunção, Paraguay</p>
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>🚀 Sistema</h4>
              <div style={{ color: 'rgba(255,255,255,0.9)', lineHeight: '2', fontSize: '16px' }}>
                <p>🌐 Ambiente: {isDevelopment ? 'Desenvolvimento' : 'Produção'}</p>
                <p>🔗 API: {API_BASE}</p>
                <p>⚡ Status: {status}</p>
                <p>❤️ Favoritos: {favorites.size}</p>
              </div>
            </div>
          </div>

          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.2)',
            paddingTop: '30px',
            textAlign: 'center',
            color: 'rgba(255,255,255,0.8)',
            fontSize: '16px'
          }}>
            <p>© 2025 Terras Paraguay - Sistema Avançado de Busca | Todos os direitos reservados</p>
          </div>
        </div>
      </footer>

      {/* Advanced Property Details Modal */}
      {selectedProperty && (
        <PropertyDetailsAdvanced
          property={selectedProperty}
          onClose={handleCloseModal}
          onWhatsAppContact={handleWhatsAppContact}
        />
      )}

      {/* Contact Modal */}
      <ContactModal />

      {/* WhatsApp Float Button */}
      <div style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        zIndex: 50
      }}>
        <button
          onClick={() => handleWhatsAppContact({})}
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            borderRadius: '50%',
            width: '64px',
            height: '64px',
            border: 'none',
            boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
            cursor: 'pointer',
            fontSize: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.1) translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(16, 185, 129, 0.6)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1) translateY(0)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
          }}
        >
          📱
        </button>
      </div>
    </div>
  );
}

export default AppComplete;