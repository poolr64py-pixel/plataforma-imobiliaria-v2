import React, { useState, useEffect } from 'react';
import PropertyDetails from './PropertyDetails';
import SearchSystem from './components/SearchSystem';
import ImageGallery from './ImageGallery';

function App() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [status, setStatus] = useState('Carregando...');
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(new Set());

  // Environment detection
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

  useEffect(() => {
    document.title = 'Terras Paraguay - Imóveis, Casas, Fazendas e Investimentos';

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Encontre os melhores imóveis no Paraguay: casas, apartamentos, fazendas e lotes. Financiamento disponível e assessoria completa para brasileiros.');
    }

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log('App iniciado - testando conexão com backend...');
      console.log('API Base URL:', API_BASE);

      const healthResponse = await fetch(`${API_BASE}/api/health`);
      const healthData = await healthResponse.json();
      console.log('Resposta do backend:', healthData);
      setStatus('Conectado ✅');

      const propertiesResponse = await fetch(`${API_BASE}/api/properties`);
      const propertiesData = await propertiesResponse.json();
      console.log('Propriedades recebidas:', propertiesData);

      if (propertiesData.success) {
        console.log('=== ESTRUTURA PROPRIEDADES ===');
        console.log('Primeira propriedade completa:', propertiesData.data[0]);
        console.log('Total properties:', propertiesData.data.length);

        setProperties(propertiesData.data);
        setFilteredProperties(propertiesData.data);
      }
      setError(null);
    } catch (error) {
      console.error('Erro ao conectar:', error);
      setStatus('Backend offline ❌');
      setError(error.message);
    }
  };

  const handleSearchResults = (filtered) => {
    setFilteredProperties(filtered);
  };

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
  };

  const handleWhatsAppContact = (property) => {
    const message = `Olá! Tenho interesse na propriedade: ${property.title} - ${formatPrice(property.price)}. Localizada em ${property.location}. Gostaria de mais informações.`;
    const phoneNumber = '+595971123456'; // Default Paraguay number
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Professional Header Component
  const ProfessionalHeader = () => (
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>TP</span>
              </div>
              <div>
                <span style={{ fontWeight: 'bold', fontSize: '20px', color: '#1f2937' }}>Terras Paraguay</span>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '-4px' }}>Imóveis & Investimentos</div>
              </div>
            </div>
          </div>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <a href="#inicio" style={{ color: '#374151', fontWeight: '500', textDecoration: 'none' }}>Início</a>
            <a href="#imoveis" style={{ color: '#374151', fontWeight: '500', textDecoration: 'none' }}>Imóveis</a>
            <a href="#sobre" style={{ color: '#374151', fontWeight: '500', textDecoration: 'none' }}>Sobre</a>
            <a href="#contato" style={{ color: '#374151', fontWeight: '500', textDecoration: 'none' }}>Contato</a>
            <button
              onClick={() => handleWhatsAppContact({ title: 'Informações Gerais', price: '', location: '' })}
              style={{
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
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
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '64px 16px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '48px',
        alignItems: 'center'
      }}>
        <div>
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '24px',
            display: 'inline-block'
          }}>
            Especialistas desde 2008
          </div>

          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            marginBottom: '24px',
            lineHeight: '1.2'
          }}>
            Seu Imóvel dos Sonhos
            <span style={{ display: 'block', color: '#a7f3d0' }}>no Paraguay</span>
          </h1>

          <p style={{
            fontSize: '20px',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '32px',
            lineHeight: '1.6'
          }}>
            Mais de 15 anos conectando investidores brasileiros às melhores oportunidades
            imobiliárias no coração da América do Sul.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
            marginBottom: '32px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>{properties.length}+</div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>Imóveis</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>2000+</div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>Clientes</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>15+</div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>Anos</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{
            width: '100%',
            height: '300px',
            background: 'linear-gradient(135deg, #047857 0%, #059669 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px'
          }}>
            🏡
          </div>
        </div>
      </div>
    </section>
  );

  // Enhanced Property Card
  const PropertyCard = ({ property }) => (
    <div
      key={property.id}
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '0',
        background: 'white',
        boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        overflow: 'hidden'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.07)';
      }}
      onClick={() => handlePropertyClick(property)}
    >
      {/* Property Image */}
      <div style={{
        width: '100%',
        height: '200px',
        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '48px',
        position: 'relative'
      }}>
        🏠

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(property.id);
          }}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: favorites.has(property.id) ? '#ef4444' : 'rgba(255,255,255,0.9)',
            color: favorites.has(property.id) ? 'white' : '#6b7280',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          ❤️
        </button>

        {/* Property Tags */}
        {property.tags && property.tags.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px'
          }}>
            {property.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                style={{
                  background: '#10b981',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: '20px' }}>
        <h3 style={{
          color: '#059669',
          margin: '0 0 15px 0',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          {property.title}
        </h3>

        <div style={{ marginBottom: '15px' }}>
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#059669',
            marginBottom: '5px'
          }}>
            {formatPrice(property.price)}
          </div>
          <div style={{ color: '#6b7280', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            📍 {property.location}
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '10px',
          marginBottom: '15px',
          fontSize: '14px',
          color: '#374151'
        }}>
          <div><strong>Tipo:</strong> {property.type}</div>
          <div><strong>Área:</strong> {property.area} {property.areaUnit}</div>
          {property.rooms && <div><strong>Quartos:</strong> {property.rooms}</div>}
          {property.bathrooms && <div><strong>Banheiros:</strong> {property.bathrooms}</div>}
        </div>

        <p style={{
          color: '#6b7280',
          fontSize: '14px',
          lineHeight: '1.5',
          marginBottom: '15px'
        }}>
          {property.description?.substring(0, 120)}...
        </p>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{
            flex: 1,
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            color: 'white',
            border: 'none',
            padding: '12px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s ease'
          }}>
            Ver Detalhes
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
              padding: '12px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
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

  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#f9fafb',
      minHeight: '100vh'
    }}>
      <ProfessionalHeader />
      <HeroSection />

      <main style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '32px 16px'
      }}>
        {/* Status Section */}
        <section style={{
          background: 'white',
          padding: '25px',
          borderRadius: '12px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#059669', margin: '0 0 15px 0' }}>
            📊 Status do Sistema
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div style={{ padding: '15px', background: '#ecfdf5', borderRadius: '8px' }}>
              <strong>✅ Frontend React</strong><br />
              <span style={{ color: '#666' }}>Porta {window.location.port || '3003'}</span>
            </div>
            <div style={{ padding: '15px', background: '#ecfdf5', borderRadius: '8px' }}>
              <strong>✅ Backend API</strong><br />
              <span style={{ color: '#666' }}>{isDevelopment ? 'Localhost' : 'Produção'}</span>
            </div>
            <div style={{ padding: '15px', background: '#ecfdf5', borderRadius: '8px' }}>
              <strong>📊 Status</strong><br />
              <span style={{ color: '#666' }}>{status}</span>
            </div>
            <div style={{ padding: '15px', background: '#ecfdf5', borderRadius: '8px' }}>
              <strong>🏡 Propriedades</strong><br />
              <span style={{ color: '#666' }}>{filteredProperties.length} encontradas</span>
            </div>
          </div>
          {error && (
            <div style={{ color: '#dc2626', marginTop: '15px', padding: '10px', background: '#fef2f2', borderRadius: '8px' }}>
              Erro: {error}
            </div>
          )}
        </section>

        {/* Search System */}
        <SearchSystem
          properties={properties}
          onSearchResults={handleSearchResults}
          onFiltersChange={(filters) => console.log('Filtros aplicados:', filters)}
        />

        {/* Properties Section */}
        <section style={{
          background: 'white',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h2 style={{ color: '#059669', margin: 0 }}>
              🏡 Propriedades Terras Paraguay ({filteredProperties.length})
            </h2>

            {favorites.size > 0 && (
              <span style={{
                background: '#fef3c7',
                color: '#92400e',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                ❤️ {favorites.size} favoritos
              </span>
            )}
          </div>

          {filteredProperties.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 40px',
              color: '#6b7280'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏡</div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                {properties.length === 0 ? 'Carregando propriedades...' : 'Nenhum imóvel encontrado'}
              </h3>
              <p style={{ fontSize: '16px' }}>
                {properties.length === 0 ?
                  'Conectando com o backend para buscar as propriedades disponíveis.' :
                  'Tente ajustar os filtros ou termos de busca para encontrar imóveis.'
                }
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '24px'
            }}>
              {filteredProperties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer style={{
        marginTop: '40px',
        padding: '40px 16px',
        background: 'linear-gradient(135deg, #047857 0%, #059669 100%)',
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
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Terras Paraguay</h3>
              <p style={{ color: 'rgba(255,255,255,0.9)', lineHeight: '1.6' }}>
                Especialistas em imóveis no Paraguay há mais de 15 anos.
                Conectamos investidores brasileiros às melhores oportunidades.
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Contato</h4>
              <div style={{ color: 'rgba(255,255,255,0.9)', lineHeight: '1.8' }}>
                <p>📱 WhatsApp: +595 971 123456</p>
                <p>📧 Email: contato@terrasparaguay.com</p>
                <p>📍 Assunção, Paraguay</p>
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Informações</h4>
              <div style={{ color: 'rgba(255,255,255,0.9)', lineHeight: '1.8' }}>
                <p>🌐 Ambiente: {isDevelopment ? 'Desenvolvimento' : 'Produção'}</p>
                <p>🔗 API: {API_BASE}</p>
                <p>⚡ Status: {status}</p>
              </div>
            </div>
          </div>

          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.2)',
            paddingTop: '20px',
            textAlign: 'center',
            color: 'rgba(255,255,255,0.8)'
          }}>
            <p>© 2025 Terras Paraguay - Todos os direitos reservados | Plataforma White Label</p>
          </div>
        </div>
      </footer>

      {/* Property Details Modal */}
      {selectedProperty && (
        <PropertyDetails
          property={selectedProperty}
          onClose={handleCloseModal}
        />
      )}

      {/* WhatsApp Float Button */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 50
      }}>
        <button
          onClick={() => handleWhatsAppContact({ title: 'Informações Gerais', price: '', location: '' })}
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
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.6)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
          }}
        >
          📱
        </button>
      </div>
    </div>
  );
}

export default App;