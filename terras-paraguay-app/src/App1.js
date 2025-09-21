import React, { useState, useMemo } from 'react';
import { Search, MapPin, Bed, Bath, Car, Phone, MessageCircle, Star, TrendingUp, ChevronLeft, ChevronRight, X, Home, Building, TreePine, Square, Mountain } from 'lucide-react';
import { paraguayProperties, paraguayConfig } from './data/terrasParaguayData';
import SearchSystem from './components/SearchSystem';

// Simple Header Component
const Header = ({ selectedTenant, onTenantChange, config }) => (
  <header className="bg-white shadow-lg border-b-4" style={{borderBottomColor: config.colors.primary}}>
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{background: `linear-gradient(135deg, ${config.colors.primary}, ${config.colors.secondary})`}}>
            <span className="text-white font-bold text-xl">TP</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{color: config.colors.secondary}}>{selectedTenant}</h1>
            <p className="text-sm text-gray-600">{config.description}</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          <select 
            value={selectedTenant}
            onChange={(e) => onTenantChange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="Terras no Paraguay">Terras no Paraguay</option>
            <option value="Imobiliária Santos">Imobiliária Santos</option>
            <option value="Demo Imobiliária">Demo Imobiliária</option>
          </select>
          
          <div className="flex items-center gap-2" style={{color: config.colors.primary}}>
            <span className="text-2xl">{config.flag}</span>
            <span className="font-medium">{config.country}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" style={{color: config.colors.primary}} />
            <span className="text-sm font-medium">{config.phone}</span>
          </div>
        </div>
      </div>
    </div>
  </header>
);

// Simple Property Card Component
const PropertyCard = ({ property, onClick, formatPrice, config }) => {
  const formatArea = (area, type) => {
    if (type === 'farm' || type === 'ranch') {
      return `${area} hectares`;
    }
    return `${area}m²`;
  };

  const getMarketTrend = (comparison) => {
    if (comparison > 0) {
      return { text: `${comparison}% abaixo do mercado`, color: config.colors.primary, icon: TrendingUp };
    }
    return { text: 'Preço de mercado', color: '#6b7280', icon: null };
  };

  const trend = getMarketTrend(property.marketComparison);
  const priceInfo = formatPrice(property.price, property);

  return (
    <div 
      onClick={() => onClick(property)}
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
    >
      <div className="relative h-48">
        <img 
          src={property.images[0]} 
          alt={property.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {property.tags?.slice(0, 2).map(tag => (
            <span key={tag} className="text-white px-2 py-1 rounded text-xs font-medium" style={{backgroundColor: config.colors.primary}}>
              {tag}
            </span>
          ))}
        </div>
        <div className="absolute top-4 right-4 bg-white rounded-full p-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium">{property.rating}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{property.title}</h3>
        
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{property.location}</span>
        </div>

        <div className="mb-4">
          <div className="text-2xl font-bold" style={{color: config.colors.primary}}>{priceInfo.main}</div>
          {priceInfo.secondary && (
            <div className="text-sm text-gray-500">{priceInfo.secondary}</div>
          )}
          {trend.icon && (
            <div className="flex items-center text-xs mt-1" style={{color: trend.color}}>
              <trend.icon className="w-3 h-3 mr-1" />
              {trend.text}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-4">
            <span>{formatArea(property.area, property.type)}</span>
            {property.rooms && (
              <div className="flex items-center">
                <Bed className="w-4 h-4 mr-1" />
                {property.rooms}
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center">
                <Bath className="w-4 h-4 mr-1" />
                {property.bathrooms}
              </div>
            )}
            {property.parking && (
              <div className="flex items-center">
                <Car className="w-4 h-4 mr-1" />
                {property.parking}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button className="flex-1 text-white py-2 px-4 rounded-lg font-medium transition-colors" style={{backgroundColor: config.colors.primary}}>
            Ver Detalhes
          </button>
          <button className="p-2 rounded-lg transition-colors" style={{backgroundColor: `${config.colors.primary}20`, color: config.colors.primary}}>
            <MessageCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Simple Property Modal Component  
const PropertyModal = ({ property, isOpen, onClose, formatPrice, config }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen || !property) return null;

  const handleWhatsApp = () => {
    const message = `Olá! Tenho interesse no imóvel: ${property.title} - ${property.location}. Preço: ${formatPrice(property.price, property).main}`;
    const phone = property.realtor?.whatsapp?.replace(/\s+/g, '') || config.whatsapp?.replace(/\s+/g, '');
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const priceInfo = formatPrice(property.price, property);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">{property.title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="relative h-96">
          <img 
            src={property.images[currentImageIndex]} 
            alt={property.title}
            className="w-full h-full object-cover"
          />
          {property.images.length > 1 && (
            <>
              <button 
                onClick={() => setCurrentImageIndex(prev => prev === 0 ? property.images.length - 1 : prev - 1)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full hover:bg-opacity-100"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={() => setCurrentImageIndex(prev => prev === property.images.length - 1 ? 0 : prev + 1)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full hover:bg-opacity-100"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="mb-6">
                <div className="text-3xl font-bold mb-2" style={{color: config.colors.primary}}>
                  {priceInfo.main}
                </div>
                {priceInfo.secondary && (
                  <div className="text-gray-600">{priceInfo.secondary}</div>
                )}
              </div>

              <div className="flex items-center text-gray-600 mb-6">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{property.location}</span>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold mb-3">Descrição</h3>
                <p className="text-gray-700 leading-relaxed">{property.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold mb-3">Características</h3>
                <div className="grid grid-cols-1 gap-2">
                  {property.features?.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 rounded-full mr-3" style={{backgroundColor: config.colors.primary}}></div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-bold mb-4">Corretor Responsável</h3>
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mr-4" style={{backgroundColor: config.colors.primary}}>
                    <span className="text-white font-bold text-xl">
                      {property.realtor?.name ? property.realtor.name.split(' ').map(n => n[0]).join('') : 'TP'}
                    </span>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{property.realtor?.name || 'Terras Paraguay'}</div>
                    <div className="text-sm text-gray-600">Corretor Especializado</div>
                  </div>
                </div>
                
                <button 
                  onClick={handleWhatsApp}
                  className="w-full text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                  style={{backgroundColor: config.colors.primary}}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp: {property.realtor?.whatsapp || config.whatsapp}
                </button>
              </div>

              {property.financing && (
                <div className="p-6 rounded-lg" style={{backgroundColor: '#eff6ff'}}>
                  <h3 className="text-lg font-bold mb-4" style={{color: '#1e40af'}}>Financiamento Disponível</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span style={{color: '#1d4ed8'}}>Entrada:</span>
                      <span className="font-medium">{property.financing.downPayment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{color: '#1d4ed8'}}>Prazo máximo:</span>
                      <span className="font-medium">{property.financing.maxYears} anos</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{color: '#1d4ed8'}}>Banco parceiro:</span>
                      <span className="font-medium">{property.financing.bank}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple Footer Component
const Footer = ({ selectedTenant, config }) => (
  <footer className="text-white py-12" style={{backgroundColor: config.colors.secondary}}>
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
              <span className="font-bold text-xl" style={{color: config.colors.secondary}}>TP</span>
            </div>
            <div>
              <h3 className="text-xl font-bold">{selectedTenant}</h3>
              <p className="opacity-80">Desde 2008</p>
            </div>
          </div>
          <p className="mb-4 opacity-80">{config.description}</p>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-4">Contato</h4>
          <div className="space-y-2 opacity-80">
            <p>{config.address}</p>
            <p>Tel: {config.phone}</p>
            <p>WhatsApp: {config.whatsapp}</p>
            <p>Email: {config.email}</p>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-4">Informações</h4>
          <div className="space-y-2 opacity-80">
            <p>500+ propriedades</p>
            <p>2000+ clientes</p>
            <p>Português, Español</p>
          </div>
        </div>
      </div>

      <div className="border-t mt-8 pt-8 text-center opacity-80" style={{borderColor: config.colors.primary}}>
        <p>&copy; 2025 {selectedTenant}. Todos os direitos reservados.</p>
      </div>
    </div>
  </footer>
);

// Mock data for other tenants
const mockProperties = [
  {
    id: 1,
    title: 'Apartamento Moderno Vila Madalena',
    price: 450000,
    location: 'Vila Madalena, São Paulo - SP',
    area: 65,
    rooms: 2,
    bathrooms: 1,
    parking: 1,
    type: 'apartment',
    rating: 4.8,
    marketComparison: 5,
    tags: ['Novo', 'Destaque'],
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop'],
    description: 'Apartamento completamente reformado em uma das regiões mais valorizadas de São Paulo.',
    features: ['Área de lazer completa', 'Portaria 24h', 'Churrasqueira', 'Academia']
  }
];

function App() {
  const [selectedTenant, setSelectedTenant] = useState('Terras no Paraguay');
  const [properties, setProperties] = useState(paraguayProperties);
  const [filteredProperties, setFilteredProperties] = useState(paraguayProperties);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Tenant configurations
  const tenantConfig = {
    'Terras no Paraguay': {
      colors: { primary: '#22c55e', secondary: '#15803d', accent: '#fbbf24' },
      country: 'Paraguay',
      flag: '🇵🇾',
      phone: '+595 21 123456',
      whatsapp: '+595 981 123456',
      email: 'contato@terrasnoparaguay.com',
      address: 'Av. Brasília 1234, Asunción - Paraguay',
      description: 'Especialistas em imóveis no Paraguay há mais de 15 anos.'
    },
    'Imobiliária Santos': {
      colors: { primary: '#1e40af', secondary: '#64748b', accent: '#dc2626' },
      country: 'Brasil',
      flag: '🇧🇷',
      phone: '+55 11 99999-9999',
      whatsapp: '+55 11 99999-9999',
      email: 'contato@santos.com.br',
      address: 'São Paulo, SP - Brasil',
      description: 'Imobiliária tradicional em São Paulo há mais de 20 anos.'
    },
    'Demo Imobiliária': {
      colors: { primary: '#7c3aed', secondary: '#64748b', accent: '#f59e0b' },
      country: 'Brasil',
      flag: '🇧🇷',
      phone: '+55 11 0000-0000',
      whatsapp: '+55 11 0000-0000',
      email: 'demo@exemplo.com',
      address: 'Demo City, Demo State',
      description: 'Demonstração da plataforma white label.'
    }
  };

  const currentConfig = tenantConfig[selectedTenant];

  // Load properties based on tenant
  React.useEffect(() => {
    if (selectedTenant === 'Terras no Paraguay') {
      setProperties(paraguayProperties);
      setFilteredProperties(paraguayProperties);
    } else {
      setProperties(mockProperties);
      setFilteredProperties(mockProperties);
    }
  }, [selectedTenant]);

  // Custom format price function
  const formatPrice = (price, property) => {
    if (selectedTenant === 'Terras no Paraguay') {
      const usdPrice = `$${price.toLocaleString('en-US')}`;
      const pygPrice = property.priceLocal ? `₲${property.priceLocal.toLocaleString('es-PY')}` : '';
      return { main: usdPrice, secondary: pygPrice };
    }
    return { main: `R$ ${price.toLocaleString('pt-BR')}`, secondary: null };
  };

  // Search handler
  const handleSearch = (query, filters) => {
    let filtered = properties;

    if (query) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(query.toLowerCase()) ||
        property.location.toLowerCase().includes(query.toLowerCase()) ||
        (property.tags && property.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())))
      );
    }

    if (filters?.type && filters.type !== 'all') {
      filtered = filtered.filter(property => property.type === filters.type);
    }

    setFilteredProperties(filtered);
  };

  const openPropertyModal = (property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
  };

  return (
    <div className="App min-h-screen bg-gray-50">
      <Header 
        selectedTenant={selectedTenant}
        onTenantChange={setSelectedTenant}
        config={currentConfig}
      />

      {/* Hero Section */}
      <section 
        className="relative text-white py-16"
        style={{
          background: selectedTenant === 'Terras no Paraguay' 
            ? 'linear-gradient(135deg, #f0fdf4, #dcfce7)' 
            : 'linear-gradient(to right, #1e40af, #7c3aed)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{color: selectedTenant === 'Terras no Paraguay' ? '#15803d' : 'white'}}
          >
            {selectedTenant === 'Terras no Paraguay' 
              ? 'Encontre o Imóvel Perfeito no Paraguay' 
              : 'Encontre o Imóvel dos Seus Sonhos'
            }
          </h1>
          
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <SearchSystem 
              onSearch={handleSearch}
              properties={properties}
            />
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Imóveis Disponíveis ({filteredProperties.length} resultados)
          </h2>
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <span>{currentConfig.flag}</span>
            <span>{selectedTenant}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map(property => (
            <PropertyCard
              key={property.id}
              property={property}
              onClick={openPropertyModal}
              formatPrice={formatPrice}
              config={currentConfig}
            />
          ))}
        </div>
      </main>

      {/* Advantages Section (Paraguay only) */}
      {selectedTenant === 'Terras no Paraguay' && (
        <section className="py-16" style={{backgroundColor: '#f0fdf4'}}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4" style={{color: '#15803d'}}>
                Por que Investir no Paraguay?
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paraguayConfig.advantages.map((advantage, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-4xl mb-4">{advantage.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{advantage.title}</h3>
                  <p className="text-gray-700">{advantage.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer 
        selectedTenant={selectedTenant}
        config={currentConfig}
      />

      <PropertyModal 
        property={selectedProperty}
        isOpen={isModalOpen}
        onClose={closeModal}
        formatPrice={formatPrice}
        config={currentConfig}
      />
    </div>
  );
}

export default App;