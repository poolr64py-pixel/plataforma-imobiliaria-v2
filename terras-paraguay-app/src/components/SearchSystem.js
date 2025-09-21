// src/components/SearchSystem.js
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Filter, X } from 'lucide-react';

const SearchSystem = ({ 
  onSearch, 
  onFiltersChange, 
  initialFilters = {},
  properties = [],
  className = "" 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    purpose: 'all',
    priceRange: 'all',
    rooms: 'all',
    location: '',
    ...initialFilters
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // Generate search suggestions based on properties
  useEffect(() => {
    if (searchQuery.length > 2) {
      const locationSuggestions = properties
        .map(p => p.location)
        .filter(location => 
          location.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter((location, index, self) => self.indexOf(location) === index)
        .slice(0, 5);

      const titleSuggestions = properties
        .map(p => p.title)
        .filter(title => 
          title.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 3);

      setSuggestions([...locationSuggestions, ...titleSuggestions]);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, properties]);

  const handleSearch = (query = searchQuery) => {
    onSearch?.(query, filters);
    setSuggestions([]);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      type: 'all',
      purpose: 'all',
      priceRange: 'all',
      rooms: 'all',
      location: ''
    };
    setFilters(clearedFilters);
    onFiltersChange?.(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== 'all' && value !== '');

  return (
    <div className={`search-system ${className}`}>
      {/* Main Search Bar */}
      <div className="relative">
        <div className="flex items-center bg-white rounded-lg shadow-md border border-gray-200">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por localização, tipo ou características..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => handleSearch()}
            className="bg-blue-600 text-white px-6 py-3 rounded-r-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            Buscar
          </button>
        </div>

        {/* Search Suggestions */}
        {suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-20">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  setSearchQuery(suggestion);
                  handleSearch(suggestion);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
              >
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{suggestion}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-3 mt-4">
        <select
          value={filters.purpose}
          onChange={(e) => handleFilterChange('purpose', e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          <option value="all">Finalidade</option>
          <option value="sale">Comprar</option>
          <option value="rent">Alugar</option>
          <option value="investment">Investir</option>
        </select>

        <select
          value={filters.type}
          onChange={(e) => handleFilterChange('type', e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          <option value="all">Tipo</option>
          <option value="apartment">Apartamento</option>
          <option value="house">Casa</option>
          <option value="studio">Studio</option>
          <option value="commercial">Comercial</option>
        </select>

        <select
          value={filters.rooms}
          onChange={(e) => handleFilterChange('rooms', e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          <option value="all">Quartos</option>
          <option value="1">1 quarto</option>
          <option value="2">2 quartos</option>
          <option value="3">3 quartos</option>
          <option value="4">4+ quartos</option>
        </select>

        <select
          value={filters.priceRange}
          onChange={(e) => handleFilterChange('priceRange', e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          <option value="all">Faixa de Preço</option>
          <option value="0-300000">Até R$ 300.000</option>
          <option value="300000-500000">R$ 300.000 - R$ 500.000</option>
          <option value="500000-1000000">R$ 500.000 - R$ 1.000.000</option>
          <option value="1000000+">Acima de R$ 1.000.000</option>
        </select>

        <button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          <Filter className="w-4 h-4" />
          Filtros Avançados
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
          >
            <X className="w-4 h-4" />
            Limpar Filtros
          </button>
        )}
      </div>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <div className="bg-gray-50 p-4 rounded-lg mt-4 border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Área Mínima (m²)
              </label>
              <input
                type="number"
                placeholder="Ex: 50"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Área Máxima (m²)
              </label>
              <input
                type="number"
                placeholder="Ex: 200"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vagas de Garagem
              </label>
              <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Qualquer</option>
                <option value="0">Sem vaga</option>
                <option value="1">1 vaga</option>
                <option value="2">2 vagas</option>
                <option value="3+">3+ vagas</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Características Especiais
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                'Piscina', 'Academia', 'Churrasqueira', 'Varanda', 
                'Área Gourmet', 'Portaria 24h', 'Elevador', 'Pet Friendly'
              ].map((feature) => (
                <label key={feature} className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">{feature}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchSystem;