import AdminLogin from './components/admin/AdminLogin';
import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import PropertyDetails from './PropertyDetailsAdvanced';
import SearchSystem from './components/SearchSystem';
import PropertyGallery from './components/PropertyGallery';
import HeroGallery from './components/HeroGallery';
import tenantConfigurations from './config/tenantConfig';

// Função para gerar URL amigável (slug)
const generateSlug = (title, id) => {
  if (!title) return `propriedade-${id}`;
  const slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  return `${slug}-${id}`;
};

// Função para extrair ID do slug
const extractIdFromSlug = (slug) => {
  const parts = slug.split('-');
  return parts[parts.length - 1];
};

// Componente de Cotações
const CurrencyRates = () => {
  const [rates, setRates] = useState({
    USD_BRL: 'Carregando...',
    USD_PYG: 'Carregando...',
    BRL_PYG: 'Carregando...'
  });
  const [loadingRates, setLoadingRates] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const fetchRates = async () => {
    try {
      setLoadingRates(true);
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      
      if (data && data.rates) {
        const usdToBrl = data.rates.BRL;
        const usdToPyg = data.rates.PYG;
        const brlToPyg = usdToPyg / usdToBrl;
        
        setRates({
          USD_BRL: usdToBrl.toFixed(2),
          USD_PYG: Math.round(usdToPyg).toLocaleString(),
          BRL_PYG: Math.round(brlToPyg).toLocaleString()
        });
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Erro ao buscar cotações:', error);
      setRates({
        USD_BRL: '5.45',
        USD_PYG: '7.450',
        BRL_PYG: '1.367'
      });
    } finally {
      setLoadingRates(false);
    }
  };

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      backgroundColor: '#1f2937',
      color: 'white',
      padding: '8px 0',
      fontSize: '13px'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <span>USD/BRL: R$ {rates.USD_BRL}</span>
          <span>USD/PYG: G {rates.USD_PYG}</span>
          <span>BRL/PYG: G {rates.BRL_PYG}</span>
        </div>
        <div style={{ fontSize: '11px', opacity: '0.8' }}>
          Atualizado: {lastUpdate.toLocaleTimeString()}
          <button
            onClick={fetchRates}
            disabled={loadingRates}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '10px',
              cursor: loadingRates ? 'not-allowed' : 'pointer',
              marginLeft: '8px'
            }}
          >
            {loadingRates ? '...' : 'Refresh'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente Hero Card
const HeroPropertyCard = ({ property, primaryColor = '#059669', secondaryColor = '#047857' }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const nextImage = () => {
    if (property.images && property.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };
  
  const prevImage = () => {
    if (property.images && property.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  return (
    <div style={{
      width: '280px',
      background: 'white',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
    }}>
      <div style={{
        height: '200px',
        background: property?.images && property.images.length > 0 
          ? `url(${property.images[currentImageIndex]}) center/cover` 
          : 'linear-gradient(135deg, #ff7b54 0%, #ffb347 50%, #ffd700 100%)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(255,123,84,0.3) 0%, rgba(255,179,71,0.3) 50%, rgba(255,215,0,0.3) 100%)'
        }} />
        
        <button 
          onClick={prevImage}
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(0,0,0,0.5)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            zIndex: 3
          }}
        >
          ‹
        </button>
        
        <button 
          onClick={nextImage}
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(0,0,0,0.5)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            zIndex: 3
          }}
        >
          ›
        </button>

        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          display: 'flex',
          gap: '6px',
          zIndex: 3
        }}>
          <span style={{
            background: '#ff9500',
            color: 'white',
            padding: '6px 10px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: '600'
          }}>
            DESTAQUE
          </span>
          <span style={{
            background: primaryColor,
            color: 'white',
            padding: '6px 10px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: '600'
          }}>
            🌱 Fazenda
          </span>
        </div>

        <button style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'rgba(0,0,0,0.5)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '28px',
          height: '28px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          zIndex: 3
        }}>
          ℹ
        </button>

        {(!property?.images || property.images.length === 0) && (
          <span style={{ 
            position: 'relative', 
            zIndex: 2, 
            fontSize: '64px',
            color: 'white'
          }}>
            🏠
          </span>
        )}
      </div>

      <div style={{
        background: primaryColor,
        color: 'white',
        padding: '18px'
      }}>
        <div style={{
          fontSize: '22px',
          fontWeight: 'bold',
          marginBottom: '8px'
        }}>
          USD {property.price.toLocaleString()}
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '13px',
          marginBottom: '14px'
        }}>
          📍 {property.location}
        </div>

        <div style={{
          fontSize: '15px',
          fontWeight: '600',
          marginBottom: '14px',
          lineHeight: '1.3'
        }}>
          {property.title}
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '13px',
          marginBottom: '16px'
        }}>
          ⚫ {property.area}hectares
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px'
        }}>
          {[0, 1, 2, 3, 4].map((index) => (
            <div
              key={index}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: index === currentImageIndex ? 'white' : 'rgba(255,255,255,0.4)',
                cursor: 'pointer'
              }}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Componente PropertyCard
const PropertyCard = ({ property, viewMode, favorites, toggleFavorite, navigate, handleWhatsAppContact }) => {
  const slug = generateSlug(property.title || 'propriedade', property.id);
  
  const formatPrice = (price) => {
    if (!price || price === undefined || price === null) {
      return 'Consultar preço';
    }
    if (typeof price === 'string') {
      const numPrice = parseFloat(price.replace(/[^\d.-]/g, ''));
      return isNaN(numPrice) ? 'Consultar preço' : `USD ${numPrice.toLocaleString()}`;
    }
    if (typeof price === 'number') {
      return `USD ${price.toLocaleString()}`;
    }
    return 'Consultar preço';
  };
  
  return (
    <div
      style={{
        width: viewMode === 'list' ? '100%' : '280px',
        background: 'white',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        position: 'relative',
        ...(viewMode === 'list' && {
          display: 'flex',
          flexDirection: 'row',
          height: '200px',
          width: '100%'
        })
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.3)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
      }}
      onClick={() => navigate(`/propriedade/${slug}`)}
    >
      <div style={{
        width: viewMode === 'list' ? '300px' : '100%',
        height: viewMode === 'list' ? '100%' : '200px',
        background: property.images && property.images.length > 0 
          ? `url(${property.images[0]}) center/cover` 
          : 'linear-gradient(135deg, #228b22 0%, #32cd32 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '48px',
        position: 'relative',
        flexShrink: 0
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(255,123,84,0.3) 0%, rgba(255,179,71,0.3) 50%, rgba(255,215,0,0.3) 100%)'
        }} />

        {(!property.images || property.images.length === 0) && (
          <span style={{ position: 'relative', zIndex: 2 }}>🏠</span>
        )}

        <div style={{
          position: 'absolute',
          top: '15px',
          left: '15px',
          display: 'flex',
          gap: '8px',
          zIndex: 3
        }}>
          <span style={{
            background: '#ff9500',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '15px',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            DESTAQUE
          </span>
          
          <span style={{
            background: '#4caf50',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '15px',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            {property.type || 'Fazenda'}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(property.id);
          }}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'rgba(0,0,0,0.5)',
            color: favorites.has(property.id) ? '#ff6b6b' : 'white',
            border: 'none',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            zIndex: 3,
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(0,0,0,0.7)';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(0,0,0,0.5)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {favorites.has(property.id) ? '❤️' : '🤍'}
        </button>
      </div>

      <div style={{ 
        padding: '20px', 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '8px'
        }}>
          {formatPrice(property.price)}
        </div>

        <div style={{ 
          color: '#e74c3c', 
          fontSize: '0.9rem', 
          marginBottom: '15px',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}>
          📍 {property.location}
        </div>

        <div style={{
          fontSize: '1.1rem',
          fontWeight: '600',
          color: '#333',
          marginBottom: '15px',
          lineHeight: '1.3',
          minHeight: '44px'
        }}>
          {property.title}
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          marginBottom: '15px',
          fontSize: '0.9rem',
          color: '#666'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            🏠 {property.area || '0'} {property.areaUnit || 'hectares'}
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '8px',
          marginTop: '15px'
        }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleWhatsAppContact(property);
            }}
            style={{
              flex: 1,
              background: '#10b981',
              color: 'white',
              border: 'none',
              padding: '8px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500'
            }}
          >
            WhatsApp
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/propriedade/${slug}`);
            }}
            style={{
              flex: 1,
              background: '#059669',
              color: 'white',
              border: 'none',
              padding: '8px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500'
            }}
          >
            Ver Detalhes
          </button>
        </div>
      </div>
    </div>
  );
};

// COMPONENTE PAGINAÇÃO FUNCIONAL - ÚNICO E LIMPO
const Pagination = ({ currentPage, totalPages, onPageChange, totalItems }) => {
  if (totalPages <= 1) return null;

  const handleClick = (page) => {
    console.log(`CLIQUE DETECTADO: Mudando para página ${page}`);
    console.log(`Estado atual: currentPage=${currentPage}, totalPages=${totalPages}`);
    
    if (typeof onPageChange === 'function') {
      console.log('Função onPageChange encontrada, executando...');
      onPageChange(page);
    } else {
      console.error('ERRO: onPageChange não é uma função!', typeof onPageChange);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '10px',
      marginTop: '30px',
      padding: '20px',
      backgroundColor: '#f0f9ff',
      borderRadius: '10px',
      border: '2px solid #0ea5e9'
    }}>
      <button
        onClick={() => handleClick(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          padding: '10px 20px',
          backgroundColor: currentPage === 1 ? '#d1d5db' : '#059669',
          color: currentPage === 1 ? '#6b7280' : 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          fontWeight: '600',
          fontSize: '14px'
        }}
      >
        ← Anterior
      </button>

      {[1, 2, 3, 4, 5].slice(0, totalPages).map(page => (
        <button
          key={page}
          onClick={() => handleClick(page)}
          style={{
            padding: '10px 15px',
            backgroundColor: page === currentPage ? '#059669' : 'white',
            color: page === currentPage ? 'white' : '#374151',
            border: '2px solid #059669',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: page === currentPage ? '700' : '500',
            fontSize: '14px',
            minWidth: '45px'
          }}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => handleClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          padding: '10px 20px',
          backgroundColor: currentPage === totalPages ? '#d1d5db' : '#059669',
          color: currentPage === totalPages ? '#6b7280' : 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          fontWeight: '600',
          fontSize: '14px'
        }}
      >
        Próximo →
      </button>

      <div style={{
        marginLeft: '20px',
        padding: '8px 12px',
        backgroundColor: 'white',
        borderRadius: '5px',
        border: '1px solid #d1d5db',
        fontSize: '14px',
        color: '#374151'
      }}>
        Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong> | {totalItems} itens
      </div>
    </div>
  );
};

// Modal de Contato
const ContactModal = ({ showContactModal, setShowContactModal, handleWhatsAppContact, tenantConfig }) => {
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
        borderRadius: '12px',
        padding: '32px',
        maxWidth: '500px',
        width: '100%',
        position: 'relative'
      }}>
        <button
          onClick={() => setShowContactModal(false)}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#6b7280'
          }}
        >
          ×
        </button>

        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: '600', 
          marginBottom: '24px', 
          color: tenantConfig?.primaryColor || '#059669' 
        }}>
          Entre em Contato
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <button
            onClick={() => {
              handleWhatsAppContact({});
              setShowContactModal(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            📱 WhatsApp: {tenantConfig?.phone || '+595 971 123456'}
          </button>

          <button
            onClick={() => {
              window.open(`mailto:${tenantConfig?.email || 'contato@terrasparaguay.com'}`, '_blank');
              setShowContactModal(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            📧 Email: {tenantConfig?.email || 'contato@terrasparaguay.com'}
          </button>

          <div style={{
            padding: '16px',
            background: '#f3f4f6',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
              📍 {tenantConfig?.address || 'Asunción, Paraguay'}<br />
              🕒 Atendimento: Segunda a Sexta, 8h às 18h
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Função principal do App
function App() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [status, setStatus] = useState('Carregando...');
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('price-asc');

  // Sistema Multi-Tenant
  const [tenantConfig, setTenantConfig] = useState(null);

  useEffect(() => {
    const hostname = window.location.hostname;
    console.log('=== DEBUG TENANT ===');
    console.log('hostname:', hostname);
    console.log('tenantConfigurations disponíveis:', Object.keys(tenantConfigurations));
    
    if (hostname === 'cliente2.localhost') {
      setTenantConfig(tenantConfigurations['cliente2.localhost']);
      console.log('CARREGOU CONFIG CLIENTE 2');
    } else {
      setTenantConfig(tenantConfigurations['localhost:3003']);
      console.log('CARREGOU CONFIG PADRÃO');
    }
  }, []);

  const propertiesPerPage = 3;
  const isDevelopment = window.location.hostname === 'localhost';
  const API_BASE = isDevelopment ? 'http://localhost:3001' : process.env.REACT_APP_API_URL || 'https://api.terrasparaguay.com';

  const formatPrice = (price) => {
    if (!price || price === undefined || price === null) {
      return 'Consultar preço';
    }
    if (typeof price === 'string') {
      const numPrice = parseFloat(price.replace(/[^\d.-]/g, ''));
      return isNaN(numPrice) ? 'Consultar preço' : `USD ${numPrice.toLocaleString()}`;
    }
    if (typeof price === 'number') {
      return `USD ${price.toLocaleString()}`;
    }
    return 'Consultar preço';
  };

  // FUNÇÃO FETCHDATA CORRIGIDA PARA PAGINAÇÃO
  const fetchData = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      console.log(`🔄 [FETCH] Buscando página ${page} da API...`);
      console.log('API Base URL:', API_BASE);

      const healthResponse = await fetch(`${API_BASE}/api/health`);
      const healthData = await healthResponse.json();
      console.log('✅ Backend conectado:', healthData.status);
      setStatus('Conectado');

      const url = `${API_BASE}/api/properties?page=${page}&limit=${propertiesPerPage}&sortBy=createdAt&sortOrder=desc`;
      console.log('🌐 URL da requisição:', url);
      
      const propertiesResponse = await fetch(url);
      const propertiesData = await propertiesResponse.json();
      console.log(`📦 Dados da página ${page}:`, propertiesData);

      if (propertiesData.success && propertiesData.data) {
        console.log('=== PAGINAÇÃO ATUALIZADA ===');
        console.log('Página atual:', propertiesData.pagination?.page);
        console.log('Total páginas:', propertiesData.pagination?.pages);
        console.log('Total propriedades:', propertiesData.pagination?.total);
        console.log('Propriedades nesta página:', propertiesData.data.length);
        console.log('IDs das propriedades:', propertiesData.data.map(p => p.id));
        
        setProperties(propertiesData.data);
        setFilteredProperties(propertiesData.data);
        setCurrentPage(propertiesData.pagination?.page || page);
        setTotalPages(propertiesData.pagination?.pages || 1);
        setTotalItems(propertiesData.pagination?.total || propertiesData.data.length);
      } else {
        console.error('❌ Resposta inválida da API:', propertiesData);
      }
      setError(null);
    } catch (error) {
      console.error('❌ Erro ao buscar dados:', error);
      setStatus('Backend offline');
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [API_BASE, propertiesPerPage]);

  const updateSEO = (property = null) => {
    if (property) {
      document.title = `${property.title} - ${formatPrice(property.price)} - ${tenantConfig?.name || 'Terras Paraguay'}`;
      
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        const description = `${property.description?.substring(0, 150)}... Localizada em ${property.location}. ${property.area} ${property.areaUnit}. Entre em contato!`;
        metaDescription.setAttribute('content', description);
      }
    } else {
      document.title = `${tenantConfig?.name || 'Terras Paraguay'} - Imóveis, Casas, Fazendas e Investimentos`;
      
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', tenantConfig?.seo?.description || 'Encontre os melhores imóveis: casas, apartamentos, fazendas e lotes. Financiamento disponível e assessoria completa.');
      }
    }
  };

  useEffect(() => {
    if (tenantConfig) {
      updateSEO();
      fetchData(1);
    }
  }, [tenantConfig]);

  const handleSearchResults = useCallback((filtered) => {
    setFilteredProperties(filtered);
    setCurrentPage(1);
  }, []);

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
      'Olá! Gostaria de mais informações sobre os imóveis disponíveis.';
    const phoneNumber = tenantConfig?.whatsapp || '+595994718400';
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  useEffect(() => {
    const savedFavorites = localStorage.getItem('terras-paraguay-favorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  const handlePageChange = (newPage) => {
    console.log(`🔄 [CHANGE] Mudança solicitada: ${currentPage} → ${newPage}`);
    console.log(`🔄 [CHANGE] Validação: newPage=${newPage}, currentPage=${currentPage}, totalPages=${totalPages}`);
    
    if (newPage !== currentPage && newPage >= 1 && newPage <= totalPages) {
      console.log('✅ [CHANGE] Mudança válida, chamando fetchData...');
      fetchData(newPage);
      setTimeout(() => {
        document.getElementById('imoveis')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      console.log('❌ [CHANGE] Mudança rejeitada');
    }
  };

  const ProfessionalHeader = () => {
    const navigate = useNavigate();
    
    return (
      <>
        <CurrencyRates />
        <header style={{
          background: 'white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 16px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '64px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div 
                  onClick={() => navigate('/')}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: `linear-gradient(135deg, ${tenantConfig?.primaryColor || '#059669'} 0%, ${tenantConfig?.secondaryColor || '#047857'} 100%)`,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>
                      {tenantConfig?.logo || 'TP'}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontWeight: 'bold', fontSize: '20px', color: '#1f2937' }}>
                      {tenantConfig?.name || 'Terras Paraguay'}
                    </span>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '-4px' }}>
                      Imóveis e Investimentos
                    </div>
                  </div>
                </div>
              </div>
              <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <button 
                  onClick={() => navigate('/')}
                  style={{ 
                    background: 'none',
                    border: 'none',
                    color: '#374151', 
                    fontWeight: '500', 
                    cursor: 'pointer'
                  }}
                >
                  Início
                </button>
                <button 
                  onClick={() => {
                    navigate('/');
                    setTimeout(() => {
                      document.getElementById('imoveis')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  style={{ 
                    background: 'none',
                    border: 'none',
                    color: '#374151', 
                    fontWeight: '500', 
                    cursor: 'pointer'
                  }}
                >
                  Imóveis
                </button>
                <button
                  onClick={() => setShowContactModal(true)}
                  style={{
                    background: `linear-gradient(135deg, ${tenantConfig?.primaryColor || '#059669'} 0%, ${tenantConfig?.secondaryColor || '#047857'} 100%)`,
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Fale Conosco
                </button>
              </nav>
            </div>
          </div>
        </header>
      </>
    );
  };

  const HeroSection = () => (
    <section style={{
      background: `linear-gradient(135deg, ${tenantConfig?.primaryColor || '#059669'} 0%, ${tenantConfig?.secondaryColor || '#047857'} 100%)`,
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '64px 16px',
        display: 'grid',
        gridTemplateColumns: window.innerWidth > 768 ? '320px 1fr 320px' : '1fr',
        gap: '32px',
        alignItems: 'start'
      }}>
        {window.innerWidth > 768 && (
          <HeroPropertyCard 
            property={{
              price: 1250000,
              location: 'Encarnación',
              title: 'Mega Fazenda em Itapúa - 500 Hectares',
              area: 500,
              images: properties.length > 0 && properties[0]?.images ? properties[0].images : []
            }}
            primaryColor={tenantConfig?.primaryColor || '#059669'}
            secondaryColor={tenantConfig?.secondaryColor || '#047857'}
          />
        )}
        <div style={{ textAlign: 'center', alignSelf: 'center' }}>
          <h1 style={{
            fontSize: window.innerWidth > 768 ? '48px' : '32px',
            fontWeight: 'bold',
            marginBottom: '24px',
            lineHeight: '1.2'
          }}>
            Seu Imóvel dos Sonhos
            <span style={{ display: 'block', color: '#a7f3d0' }}>no Paraguay</span>
          </h1>
          <button
            onClick={() => document.getElementById('imoveis')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              background: 'white',
              color: tenantConfig?.primaryColor || '#059669',
              padding: '16px 32px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: '600',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Ver Propriedades
          </button>
        </div>
        {window.innerWidth > 768 && (
          <HeroPropertyCard 
            property={{
              price: 350000,
              location: 'Coronel Oviedo',
              title: 'Fazenda Produtiva em Coronel Oviedo',
              area: 100,
              images: properties.length > 1 && properties[1]?.images ? properties[1].images : []
            }}
            primaryColor={tenantConfig?.primaryColor || '#059669'}
            secondaryColor={tenantConfig?.secondaryColor || '#047857'}
          />
        )}
      </div>
    </section>
  );

  const PropertyPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const propertyId = extractIdFromSlug(slug);
    const property = properties.find(p => p.id.toString() === propertyId);

    useEffect(() => {
      if (property) {
        updateSEO(property);
      }
    }, [property]);

    if (!property && !loading) {
      return (
        <div style={{ 
          minHeight: '50vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <h2>Propriedade não encontrada</h2>
          <button
            onClick={() => navigate('/')}
            style={{
              background: tenantConfig?.primaryColor || '#059669',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Voltar ao Início
          </button>
        </div>
      );
    }

    if (loading) {
      return (
        <div style={{
          minHeight: '50vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            border: '4px solid #e5e7eb',
            borderTop: `4px solid ${tenantConfig?.primaryColor || '#059669'}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        </div>
      );
    }

    return (
      <PropertyDetails
        property={property}
        onClose={() => navigate('/')}
      />
    );
  };

  const HomePage = () => {
    const navigate = useNavigate();
    
    if (loading) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f9fafb'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              border: '4px solid #e5e7eb',
              borderTop: `4px solid ${tenantConfig?.primaryColor || '#059669'}`,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }} />
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Carregando Propriedades
            </h2>
            <p style={{ color: '#6b7280' }}>Conectando com o servidor...</p>
          </div>
        </div>
      );
    }

    return (
      <>
        <HeroSection />
        
        <main style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '32px 16px'
        }}>
         {/*  <SearchSystem
            properties={properties}
            onSearchResults={handleSearchResults}
            onFiltersChange={(filters) => console.log('Filtros aplicados:', filters)}
          />*/}

          <section id="imoveis" style={{
            background: 'white',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <h2 style={{ color: tenantConfig?.primaryColor || '#059669', margin: 0 }}>
                Propriedades {tenantConfig?.name || 'Terras Paraguay'} ({totalItems}) - Página {currentPage}/{totalPages}
              </h2>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    padding: '6px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value="price-asc">Menor Preço</option>
                  <option value="price-desc">Maior Preço</option>
                  <option value="newest">Mais Recentes</option>
                  <option value="area-desc">Maior Área</option>
                </select>
              </div>
            </div>

            {properties.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 40px',
                color: '#6b7280'
              }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏡</div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: '#374151'
                }}>
                  Carregando propriedades...
                </h3>
              </div>
            ) : (
              <>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '24px',
                  justifyItems: 'center'
                }}>
                  {properties.map((property, index) => (
                    <PropertyCard 
                      key={`${property.id}-${currentPage}-${index}`}
                      property={property}
                      viewMode={viewMode}
                      favorites={favorites}
                      toggleFavorite={toggleFavorite}
                      navigate={navigate}
                      handleWhatsAppContact={handleWhatsAppContact}
                    />
                  ))}
                </div>
                
                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </section>
        </main>

        <footer style={{
          marginTop: '40px',
          padding: '40px 16px',
          background: `linear-gradient(135deg, ${tenantConfig?.secondaryColor || '#047857'} 0%, ${tenantConfig?.primaryColor || '#059669'} 100%)`,
          color: 'white'
        }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '32px',
              marginBottom: '32px'
            }}>
              <div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  marginBottom: '16px'
                }}>{tenantConfig?.name || 'Terras Paraguay'}</h3>
                <p style={{
                  color: 'rgba(255,255,255,0.9)',
                  lineHeight: '1.6'
                }}>
                  Especialistas em imóveis há mais de 15 anos.
                </p>
              </div>
              <div>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '16px'
                }}>Contato</h4>
                <div style={{
                  color: 'rgba(255,255,255,0.9)',
                  lineHeight: '1.8'
                }}>
                  <p>WhatsApp: {tenantConfig?.phone || '+595 971 123456'}</p>
                  <p>Email: {tenantConfig?.email || 'contato@terrasparaguay.com'}</p>
                  <p>{tenantConfig?.address || 'Asunción, Paraguay'}</p>
                </div>
              </div>
            </div>
            <div style={{
              borderTop: '1px solid rgba(255,255,255,0.2)',
              paddingTop: '20px',
              textAlign: 'center',
              color: 'rgba(255,255,255,0.8)'
            }}>
              <p>© 2025 {tenantConfig?.name || 'Terras Paraguay'} - Todos os direitos reservados</p>
            </div>
          </div>
        </footer>

        <ContactModal 
          showContactModal={showContactModal}
          setShowContactModal={setShowContactModal}
          handleWhatsAppContact={handleWhatsAppContact}
          tenantConfig={tenantConfig}
        />

        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 50
        }}>
          <button
            onClick={() => handleWhatsAppContact({})}
            style={{
              background: '#10b981',
              color: 'white',
              borderRadius: '50%',
              width: '56px',
              height: '56px',
              border: 'none',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
              cursor: 'pointer',
              fontSize: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            📱
          </button>
        </div>
      </>
    );
  };

  const AdminPage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [adminUser, setAdminUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const token = localStorage.getItem('admin-token');
      const user = localStorage.getItem('admin-user');
      
      if (token && user) {
        setAdminUser(JSON.parse(user));
        setIsAuthenticated(true);
      }
      setLoading(false);
    }, []);

    const handleLoginSuccess = (user) => {
      setAdminUser(user);
      setIsAuthenticated(true);
    };

    const handleLogout = () => {
      localStorage.removeItem('admin-token');
      localStorage.removeItem('admin-user');
      setIsAuthenticated(false);
      setAdminUser(null);
    };

    if (loading) {
      return <div style={{padding: '20px'}}>Carregando...</div>;
    }

    if (!isAuthenticated) {
      return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
    }

    return (
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#059669' }}>Admin Panel - {adminUser?.name}</h1>
          <button 
            onClick={handleLogout}
            style={{ 
              padding: '8px 16px', 
              background: '#dc2626', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer' 
            }}
          >
            Logout
          </button>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
          <h3>Dashboard</h3>
          <p>Tenant: {adminUser?.tenant}</p>
          <p>Próximas funcionalidades: CRUD de propriedades</p>
        </div>
      </div>
    );
  };

  return (
    <Router>
      <div style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
        backgroundColor: '#f9fafb',
        minHeight: '100vh'
      }}>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>

        <ProfessionalHeader />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/propriedade/:slug" element={<PropertyPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>

        {selectedProperty && (
          <PropertyDetails
            property={selectedProperty}
            onClose={() => setSelectedProperty(null)}
          />
        )}
      </div>
    </Router>
  );
}

export default App;