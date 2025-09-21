import React, { useState, useEffect } from 'react';
import { Search, MapPin, Bed, Bath, Car, Phone, MessageCircle, Star, TrendingUp, ChevronLeft, ChevronRight, X, Home, Building, TreePine, Square, Mountain, Loader } from 'lucide-react';
import './App.css';

// Configuração da API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const TENANT_SLUG = process.env.REACT_APP_TENANT_SLUG || 'terras-paraguay';

// Serviço de API
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.tenantSlug = TENANT_SLUG;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'X-Tenant-Slug': this.tenantSlug,
      ...options.headers
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getTenantConfig() {
    return this.request(`/api/tenants/config?tenant=${this.tenantSlug}`);
  }

  async getProperties(filters = {}) {
    const queryParams = new URLSearchParams({
      tenant: this.tenantSlug,
      ...filters
    });
    return this.request(`/api/properties?${queryParams}`);
  }

  async getProperty(id) {
    return this.request(`/api/properties/${id}?tenant=${this.tenantSlug}`);
  }

  async getTenantStats() {
    return this.request(`/api/tenants/stats?tenant=${this.tenantSlug}`);
  }
}

const apiService = new ApiService();

// Função para formatação de preços
const formatPrice = (price, currency = 'USD') => {
  const formatters = {
    USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
    PYG: new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG' }),
    BRL: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
  };

  return formatters[currency]?.format(price) || `${currency} ${price.toLocaleString()}`;
};

// Componente de ícone para tipo de propriedade
const PropertyTypeIcon = ({ type, className = "w-5 h-5" }) => {
  const icons = {
    house: Home,
    apartment: Building,
    duplex: Building,
    farm: TreePine,
    ranch: Mountain,
    land: Square,
    commercial: Building,
    warehouse: Building,
    townhouse: Home
  };

  const IconComponent = icons[type] || Home;
  return <IconComponent className={className} />;
};

// Componente de card de propriedade
const PropertyCard = ({ property, onContactClick }) => {
  const formatPropertyType = (type) => {
    const types = {
      house: 'Casa',
      apartment: 'Apartamento',
      duplex: 'Duplex',
      farm: 'Fazenda',
      ranch: 'Estância',
      land: 'Terreno',
      commercial: 'Comercial',
      warehouse: 'Galpão',
      townhouse: 'Sobrado'
    };
    return types[type] || type;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-gray-200 relative">
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          <PropertyTypeIcon type={property.property_type} className="w-16 h-16" />
        </div>
        {property.is_featured && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-sm font-medium">
            <Star className="w-4 h-4 inline mr-1" />
            Destaque
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <PropertyTypeIcon type={property.property_type} className="w-4 h-4 mr-1" />
          <span className="capitalize">{formatPropertyType(property.property_type)}</span>
          <span className="mx-2">•</span>
          <span className="capitalize">{property.purpose === 'sale' ? 'Venda' : 'Aluguel'}</span>
        </div>

        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{property.title}</h3>

        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{property.location.city}, {property.location.state}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600 mb-3 flex-wrap gap-3">
          {property.features.bedrooms && (
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-1" />
              <span>{property.features.bedrooms}</span>
            </div>
          )}
          {property.features.bathrooms && (
            <div className="flex items-center">
              <Bath className="w-4 h-4 mr-1" />
              <span>{property.features.bathrooms}</span>
            </div>
          )}
          {property.features.parking_spaces && (
            <div className="flex items-center">
              <Car className="w-4 h-4 mr-1" />
              <span>{property.features.parking_spaces}</span>
            </div>
          )}
        </div>

        <div className="mb-3">
          <div className="text-xl font-bold text-green-600">
            {formatPrice(property.pricing.sale_price || property.pricing.rent_price, property.pricing.currency_primary)}
          </div>
          {property.pricing.local_prices && (
            <div className="text-sm text-gray-600">
              {property.pricing.local_prices.PYG && (
                <div>{formatPrice(property.pricing.local_prices.PYG, 'PYG')}</div>
              )}
              {property.pricing.local_prices.BRL && (
                <div>{formatPrice(property.pricing.local_prices.BRL, 'BRL')}</div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onContactClick(property)}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors flex items-center justify-center"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            WhatsApp
          </button>
          <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded hover:bg-gray-200 transition-colors flex items-center justify-center">
            <Phone className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente principal
const App = () => {
  const [properties, setProperties] = useState([]);
  const [tenantConfig, setTenantConfig] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [configData, propertiesData, statsData] = await Promise.all([
        apiService.getTenantConfig(),
        apiService.getProperties(),
        apiService.getTenantStats()
      ]);

      setTenantConfig(configData);
      setProperties(propertiesData.properties || propertiesData);
      setStats(statsData);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar dados. Verifique se o backend está rodando.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const filters = {};

      if (searchTerm) filters.search = searchTerm;
      if (propertyTypeFilter) filters.property_type = propertyTypeFilter;
      if (cityFilter) filters.city = cityFilter;

      const data = await apiService.getProperties(filters);
      setProperties(data.properties || data);
    } catch (err) {
      console.error('Erro na busca:', err);
      setError('Erro ao buscar propriedades');
    } finally {
      setLoading(false);
    }
  };

  const handleContactClick = (property) => {
    const message = `Olá! Tenho interesse na propriedade: ${property.title} - ${formatPrice(property.pricing.sale_price || property.pricing.rent_price, property.pricing.currency_primary)}`;
    const whatsappUrl = `https://wa.me/595981123456?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading && !properties.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-gray-600">Carregando propriedades...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <h2 className="text-red-800 font-semibold mb-2">Erro de Conexão</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadData}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {tenantConfig?.name || 'Terras no Paraguay'}
              </h1>
              <p className="text-gray-600">Sua porta de entrada para investimentos no Paraguay</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {properties.length} propriedades
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Filtros */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por título, descrição ou cidade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <select
              value={propertyTypeFilter}
              onChange={(e) => setPropertyTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Todos os tipos</option>
              <option value="house">Casa</option>
              <option value="apartment">Apartamento</option>
              <option value="duplex">Duplex</option>
              <option value="farm">Fazenda</option>
              <option value="ranch">Estância</option>
              <option value="land">Terreno</option>
              <option value="commercial">Comercial</option>
              <option value="warehouse">Galpão</option>
              <option value="townhouse">Sobrado</option>
            </select>

            <input
              type="text"
              placeholder="Cidade"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />

            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <Loader className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Search className="w-4 h-4 mr-2" />
              )}
              Buscar
            </button>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      {stats && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.total_properties}</div>
                <div className="text-sm text-gray-600">Total de Propriedades</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.featured_properties}</div>
                <div className="text-sm text-gray-600">Em Destaque</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Object.keys(stats.cities || {}).length}
                </div>
                <div className="text-sm text-gray-600">Cidades</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Object.keys(stats.property_types || {}).length}
                </div>
                <div className="text-sm text-gray-600">Tipos de Imóveis</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Propriedades */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {properties.length === 0 ? (
          <div className="text-center py-12">
            <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma propriedade encontrada
            </h3>
            <p className="text-gray-600">
              Tente ajustar os filtros de busca.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onContactClick={handleContactClick}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">
              {tenantConfig?.name || 'Terras no Paraguay'}
            </h3>
            <p className="text-gray-300 mb-4">
              Encontre as melhores oportunidades de investimento imobiliário no Paraguay
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => window.open('https://wa.me/595981123456', '_blank')}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded flex items-center transition-colors"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded flex items-center transition-colors">
                <Phone className="w-4 h-4 mr-2" />
                Ligar
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;