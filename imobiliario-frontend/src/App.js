import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import PropertyDetails from './PropertyDetailsAdvanced';
import SearchSystem from './components/SearchSystem';
import tenantConfigurations from './config/tenantConfig';
import AdminLogin from './components/admin/AdminLogin';

// ========== UTILITY FUNCTIONS ==========
const generateSlug = (title, id) => {
  if (!title) return `propriedade-${id}`;
  return title.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-') + `-${id}`;
};

const extractIdFromSlug = (slug) => slug.split('-').pop();

const formatPrice = (price) => {
  if (!price) return 'Consultar preço';
  if (typeof price === 'string') {
    const num = parseFloat(price.replace(/[^\d.-]/g, ''));
    return isNaN(num) ? 'Consultar preço' : `USD ${num.toLocaleString()}`;
  }
  return `USD ${price.toLocaleString()}`;
};

// ========== CURRENCY RATES ==========
const CurrencyRates = () => {
  const [rates, setRates] = useState({
    USD_BRL: 'Carregando...',
    USD_PYG: 'Carregando...',
    BRL_PYG: 'Carregando...'
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const fetchRates = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      
      if (data?.rates) {
        const usdToBrl = data.rates.BRL;
        const usdToPyg = data.rates.PYG;
        setRates({
          USD_BRL: usdToBrl.toFixed(2),
          USD_PYG: Math.round(usdToPyg).toLocaleString(),
          BRL_PYG: Math.round(usdToPyg / usdToBrl).toLocaleString()
        });
        setLastUpdate(new Date());
      }
    } catch (error) {
      setRates({ USD_BRL: '5.45', USD_PYG: '7.450', BRL_PYG: '1.367' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ backgroundColor: '#1f2937', color: 'white', padding: '8px 0', fontSize: '13px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <span>USD/BRL: R$ {rates.USD_BRL}</span>
          <span>USD/PYG: G {rates.USD_PYG}</span>
          <span>BRL/PYG: G {rates.BRL_PYG}</span>
        </div>
        <button onClick={fetchRates} disabled={loading} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '2px 8px', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? '...' : '↻'}
        </button>
      </div>
    </div>
  );
};

// ========== HERO PROPERTY CARD ==========
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
    <div style={{ width: '280px', background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
      <div style={{ height: '200px', background: property?.images?.[currentImageIndex] ? `url(${property.images[currentImageIndex]}) center/cover` : 'linear-gradient(135deg, #ff7b54 0%, #ffb347 50%, #ffd700 100%)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <button onClick={prevImage} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', zIndex: 3 }}>‹</button>
        <button onClick={nextImage} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', zIndex: 3 }}>›</button>
        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px', zIndex: 3 }}>
          <span style={{ background: '#ff9500', color: 'white', padding: '6px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600' }}>DESTAQUE</span>
        </div>
        {(!property?.images || property.images.length === 0) && <span style={{ position: 'relative', zIndex: 2, fontSize: '64px', color: 'white' }}>🏠</span>}
      </div>
      <div style={{ background: primaryColor, color: 'white', padding: '18px' }}>
        <div style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '8px' }}>USD {property.price.toLocaleString()}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', marginBottom: '14px' }}>📍 {property.location}</div>
        <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '14px', lineHeight: '1.3' }}>{property.title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', marginBottom: '16px' }}>⚫ {property.area} hectares</div>
      </div>
    </div>
  );
};

// ========== PROPERTY CARD ==========
const PropertyCard = ({ property, favorites, toggleFavorite, navigate, handleWhatsAppContact, tenantConfig }) => {
  const slug = generateSlug(property.title, property.id);
  
  return (
    <div onClick={() => navigate(`/propriedade/${slug}`)} style={{ width: '280px', background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', transition: 'all 0.3s', cursor: 'pointer' }}>
      <div style={{ height: '200px', background: property.images?.[0] ? `url(${property.images[0]}) center/cover` : 'linear-gradient(135deg, #228b22, #32cd32)', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '15px', left: '15px', display: 'flex', gap: '8px' }}>
          <span style={{ background: '#ff9500', color: 'white', padding: '6px 12px', borderRadius: '15px', fontSize: '12px', fontWeight: '600' }}>DESTAQUE</span>
        </div>
        <button onClick={(e) => { e.stopPropagation(); toggleFavorite(property.id); }} style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(0,0,0,0.5)', color: favorites.has(property.id) ? '#ff6b6b' : 'white', border: 'none', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', fontSize: '14px' }}>
          {favorites.has(property.id) ? '❤️' : '🤍'}
        </button>
      </div>
      <div style={{ padding: '20px' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>{formatPrice(property.price)}</div>
        <div style={{ color: '#e74c3c', fontSize: '0.9rem', marginBottom: '15px' }}>📍 {property.location}</div>
        <div style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '15px' }}>{property.title}</div>
        <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>🏠 {property.area} {property.areaUnit || 'hectares'}</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={(e) => { e.stopPropagation(); handleWhatsAppContact(property); }} style={{ flex: 1, background: '#10b981', color: 'white', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>WhatsApp</button>
          <button onClick={(e) => { e.stopPropagation(); navigate(`/propriedade/${slug}`); }} style={{ flex: 1, background: tenantConfig?.primaryColor || '#059669', color: 'white', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Detalhes</button>
        </div>
      </div>
    </div>
  );
};

  const Pagination = ({ currentPage, totalPages, totalItems, onPageChange }) => {
    if (totalPages <= 1) return null;

    console.log(`📍 [PAGINATION RENDER] currentPage=${currentPage}, totalPages=${totalPages}`);

    return (
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '30px', padding: '20px', backgroundColor: '#f0f9ff', borderRadius: '10px' }}>
        <button 
          onClick={() => {
            console.log('CLIQUE ANTERIOR - currentPage:', currentPage);
            onPageChange(currentPage - 1);
          }} 
          disabled={currentPage === 1} 
          style={{ padding: '10px 20px', backgroundColor: currentPage === 1 ? '#d1d5db' : '#059669', color: currentPage === 1 ? '#6b7280' : 'white', border: 'none', borderRadius: '5px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontWeight: '600' }}
        >
          ← Anterior
        </button>
        
        {[...Array(Math.min(totalPages, 5))].map((_, i) => {
          const pageNum = i + 1;
          const isActive = pageNum === currentPage;
          console.log(`📍 [BTN] Página ${pageNum} - isActive=${isActive} (currentPage=${currentPage})`);
          
          return (
            <button 
              key={pageNum} 
              onClick={() => {
                console.log('CLIQUE PÁGINA:', pageNum);
                onPageChange(pageNum);
              }} 
              style={{ 
                padding: '10px 15px', 
                backgroundColor: isActive ? '#059669' : 'white', 
                color: isActive ? 'white' : '#374151', 
                border: '2px solid #059669', 
                borderRadius: '5px', 
                cursor: 'pointer', 
                fontWeight: isActive ? '700' : '500',
                minWidth: '45px'
              }}
            >
              {pageNum}
            </button>
          );
        })}
        
        <button 
          onClick={() => {
            console.log('CLIQUE PRÓXIMO - currentPage:', currentPage);
            onPageChange(currentPage + 1);
          }} 
          disabled={currentPage === totalPages} 
          style={{ padding: '10px 20px', backgroundColor: currentPage === totalPages ? '#d1d5db' : '#059669', color: currentPage === totalPages ? '#6b7280' : 'white', border: 'none', borderRadius: '5px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontWeight: '600' }}
        >
          Próximo →
        </button>
        
        <div style={{ marginLeft: '20px', padding: '8px 12px', backgroundColor: 'white', borderRadius: '5px', fontSize: '14px' }}>
          Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong> | {totalItems} itens
        </div>
      </div>
    );
  };

// ========== PAGE TITLE ==========
const PageTitle = ({ currentPage, totalPages, totalItems, tenantConfig }) => {
  console.log(`📌 [TITLE] Renderizando: Página ${currentPage}/${totalPages} | ${totalItems} itens`);
  
  return (
    <h2 style={{ color: tenantConfig?.primaryColor || '#059669', marginBottom: '20px' }}>
      Propriedades ({totalItems}) - Página {currentPage}/{totalPages}
    </h2>
  );
};

// ========== CONTACT MODAL ==========
const ContactModal = ({ show, onClose, handleWhatsAppContact, tenantConfig }) => {
  if (!show) return null;
  
  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
      <div style={{ background: 'white', borderRadius: '12px', padding: '32px', maxWidth: '500px', width: '90%' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px', color: tenantConfig?.primaryColor || '#059669' }}>Entre em Contato</h2>
        <button onClick={() => { handleWhatsAppContact({}); onClose(); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', marginBottom: '12px' }}>📱 WhatsApp: {tenantConfig?.phone || '+595 994 718400'}</button>
        <button onClick={onClose} style={{ width: '100%', padding: '12px', background: '#e5e7eb', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Fechar</button>
      </div>
    </div>
  );
};

// ========== MAIN APP ==========
function App() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tenantConfig, setTenantConfig] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  
  const propertiesPerPage = 3;
  const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:3001' : process.env.REACT_APP_API_URL;

  useEffect(() => {
    const hostname = window.location.hostname;
    setTenantConfig(tenantConfigurations[hostname] || tenantConfigurations['localhost:3003']);
  }, []);

  const fetchData = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      console.log(`🔄 [FETCH] Buscando página ${page}...`);
      const url = `${API_BASE}/api/properties?page=${page}&limit=${propertiesPerPage}&sortBy=createdAt&sortOrder=desc`;
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.success && data.data) {
        console.log(`✅ [FETCH] Recebidos ${data.data.length} itens`);
        console.log(`📊 [PAGINATION] Página ${data.pagination?.page} de ${data.pagination?.pages}`);
        
        const newPage = data.pagination?.page || page;
        const newTotalPages = data.pagination?.pages || 1;
        const newTotalItems = data.pagination?.total || data.data.length;
        
        console.log(`🔄 [STATE UPDATE] Atualizando currentPage para: ${newPage}`);
        
        setProperties(data.data);
        setFilteredProperties(data.data);
        setCurrentPage(newPage);
        setTotalPages(newTotalPages);
        setTotalItems(newTotalItems);
        
        console.log(`✅ [STATE UPDATE] Estado atualizado - currentPage agora é: ${newPage}`);
      }
    } catch (error) {
      console.error('❌ [FETCH] Erro:', error);
    } finally {
      setLoading(false);
    }
  }, [API_BASE, propertiesPerPage]);

  useEffect(() => {
    if (tenantConfig) fetchData(1);
    const saved = localStorage.getItem('terras-paraguay-favorites');
    if (saved) setFavorites(new Set(JSON.parse(saved)));
  }, [tenantConfig, fetchData]);

  const toggleFavorite = (id) => {
    const newFavorites = new Set(favorites);
    newFavorites.has(id) ? newFavorites.delete(id) : newFavorites.add(id);
    setFavorites(newFavorites);
    localStorage.setItem('terras-paraguay-favorites', JSON.stringify([...newFavorites]));
  };

  const handleWhatsAppContact = (property) => {
    const message = property.title ? `Olá! Interesse em: ${property.title}` : 'Olá! Gostaria de informações';
    const phone = tenantConfig?.whatsapp || '+595994718400';
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handlePageChange = (page) => {
    console.log(`🔄 [PAGE CHANGE] Solicitando mudança para página ${page}`);
    console.log(`🔄 [PAGE CHANGE] Estado atual antes da mudança: currentPage=${currentPage}`);
    
    // SEMPRE chama fetchData, deixa o backend decidir se a página é válida
    if (page >= 1 && page <= totalPages) {
      console.log('✅ [PAGE CHANGE] Página válida - chamando fetchData');
      fetchData(page);
      setTimeout(() => {
        const element = document.getElementById('imoveis');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          console.log('✅ [SCROLL] Rolou para #imoveis');
        }
      }, 100);
    } else {
      console.warn(`⚠️ [PAGE CHANGE] Página ${page} fora do range 1-${totalPages}`);
    }
  };

  const PropertyPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const property = properties.find(p => p.id.toString() === extractIdFromSlug(slug));
    if (!property && !loading) return <div style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><h2>Propriedade não encontrada</h2></div>;
    if (loading) return <div style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Carregando...</div>;
    return <PropertyDetails property={property} onClose={() => navigate('/')} />;
  };

  const HomePage = () => {
    const navigate = useNavigate();
    return (
      <>
        <section style={{ background: `linear-gradient(135deg, ${tenantConfig?.primaryColor || '#059669'}, ${tenantConfig?.secondaryColor || '#047857'})`, color: 'white', position: 'relative', overflow: 'hidden' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '64px 16px', display: 'grid', gridTemplateColumns: window.innerWidth > 768 ? '320px 1fr 320px' : '1fr', gap: '32px', alignItems: 'start' }}>
            {window.innerWidth > 768 && properties.length > 0 && (
              <HeroPropertyCard property={{ price: properties[0]?.price || 1250000, location: properties[0]?.location || 'Encarnación', title: properties[0]?.title || 'Fazenda Premium', area: properties[0]?.area || 500, images: properties[0]?.images || [] }} primaryColor={tenantConfig?.primaryColor} secondaryColor={tenantConfig?.secondaryColor} />
            )}
            <div style={{ textAlign: 'center', alignSelf: 'center' }}>
              <h1 style={{ fontSize: window.innerWidth > 768 ? '48px' : '32px', fontWeight: 'bold', marginBottom: '24px' }}>Seu Imóvel dos Sonhos<span style={{ display: 'block', color: '#a7f3d0' }}>no Paraguay</span></h1>
              <button onClick={() => document.getElementById('imoveis')?.scrollIntoView({ behavior: 'smooth' })} style={{ background: 'white', color: tenantConfig?.primaryColor || '#059669', padding: '16px 32px', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer' }}>Ver Propriedades</button>
            </div>
            {window.innerWidth > 768 && properties.length > 1 && (
              <HeroPropertyCard property={{ price: properties[1]?.price || 350000, location: properties[1]?.location || 'Coronel Oviedo', title: properties[1]?.title || 'Fazenda Produtiva', area: properties[1]?.area || 100, images: properties[1]?.images || [] }} primaryColor={tenantConfig?.primaryColor} secondaryColor={tenantConfig?.secondaryColor} />
            )}
          </div>
        </section>
        <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 16px' }}>
          <SearchSystem 
            properties={properties} 
            onSearchResults={(filtered) => { 
              console.log('🔍 [SEARCH] Novos resultados de busca');
              setFilteredProperties(filtered); 
              // SÓ reseta página se houver filtros ativos
              if (filtered.length !== properties.length) {
                setCurrentPage(1);
              }
            }} 
            onFiltersChange={() => {}} 
          />
          <section id="imoveis" style={{ background: 'white', padding: '25px', borderRadius: '12px', marginTop: '32px' }}>
            <PageTitle 
              currentPage={currentPage} 
              totalPages={totalPages} 
              totalItems={totalItems} 
              tenantConfig={tenantConfig}
            />
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px' }}>Carregando...</div>
            ) : properties.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>Nenhum imóvel encontrado</div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', justifyItems: 'center' }}>
                  {properties.map(property => (
                    <PropertyCard key={property.id} property={property} favorites={favorites} toggleFavorite={toggleFavorite} navigate={navigate} handleWhatsAppContact={handleWhatsAppContact} tenantConfig={tenantConfig} />
                  ))}
                </div>
                <Pagination 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  totalItems={totalItems} 
                  onPageChange={handlePageChange} 
                  key={`pagination-${currentPage}-${totalPages}`}
                />
              </>
            )}
          </section>
        </main>
        <footer style={{ marginTop: '40px', padding: '40px 16px', background: `linear-gradient(135deg, ${tenantConfig?.secondaryColor || '#047857'}, ${tenantConfig?.primaryColor || '#059669'})`, color: 'white', textAlign: 'center' }}>
          <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>{tenantConfig?.name || 'Terras Paraguay'}</h3>
          <p>WhatsApp: {tenantConfig?.phone || '+595 994 718400'} | Email: {tenantConfig?.email || 'contato@terrasparaguay.com'}</p>
          <p style={{ marginTop: '20px', opacity: 0.8 }}>© 2025 {tenantConfig?.name || 'Terras Paraguay'} - Todos os direitos reservados</p>
        </footer>
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 50 }}>
          <button onClick={() => handleWhatsAppContact({})} style={{ background: '#10b981', color: 'white', borderRadius: '50%', width: '56px', height: '56px', border: 'none', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)', cursor: 'pointer', fontSize: '24px' }}>📱</button>
        </div>
        <ContactModal show={showContactModal} onClose={() => setShowContactModal(false)} handleWhatsAppContact={handleWhatsAppContact} tenantConfig={tenantConfig} />
      </>
    );
  };

  return (
    <Router>
      <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
        <CurrencyRates />
        <header style={{ background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 40 }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 'bold', fontSize: '20px' }}>{tenantConfig?.name || 'Terras Paraguay'}</span>
            <button onClick={() => setShowContactModal(true)} style={{ background: tenantConfig?.primaryColor || '#059669', color: 'white', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>Contato</button>
          </div>
        </header>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/propriedade/:slug" element={<PropertyPage />} />
          <Route path="/admin" element={<AdminLogin onLoginSuccess={(user) => console.log('Login:', user)} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;