import React, { useState, useEffect, useRef } from 'react';

const SearchSystem = ({ properties, onSearchResults, onFiltersChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    minPrice: '',
    maxPrice: '',
    location: '',
    rooms: '',
    bathrooms: '',
    minArea: '',
    maxArea: '',
    currency: 'USD'
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Previne múltiplas chamadas com useRef
  const previousFiltersRef = useRef(null);

  const applyFilters = () => {
    let filtered = properties;

    if (searchTerm.trim()) {
      filtered = filtered.filter(property =>
        property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filters.type) {
      filtered = filtered.filter(property => property.type === filters.type);
    }

    if (filters.minPrice) {
      filtered = filtered.filter(property => property.price >= parseInt(filters.minPrice));
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(property => property.price <= parseInt(filters.maxPrice));
    }

    if (filters.location) {
      filtered = filtered.filter(property =>
        property.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.rooms) {
      filtered = filtered.filter(property => property.rooms >= parseInt(filters.rooms));
    }

    if (filters.bathrooms) {
      filtered = filtered.filter(property => property.bathrooms >= parseInt(filters.bathrooms));
    }

    if (filters.minArea) {
      filtered = filtered.filter(property => property.area >= parseInt(filters.minArea));
    }

    if (filters.maxArea) {
      filtered = filtered.filter(property => property.area <= parseInt(filters.maxArea));
    }

    return filtered;
  };

  useEffect(() => {
    // Cria string única dos filtros para comparação
    const currentFiltersString = JSON.stringify({ searchTerm, ...filters });
    
    // Só aplica se os filtros mudaram de verdade
    if (previousFiltersRef.current !== currentFiltersString) {
      console.log('🔍 [SEARCH] Filtros mudaram, aplicando...');
      previousFiltersRef.current = currentFiltersString;
      
      const filtered = applyFilters();
      onSearchResults(filtered);
      
      if (onFiltersChange) {
        onFiltersChange({ searchTerm, ...filters });
      }
    }
  }, [searchTerm, filters, properties]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      type: '',
      minPrice: '',
      maxPrice: '',
      location: '',
      rooms: '',
      bathrooms: '',
      minArea: '',
      maxArea: '',
      currency: 'USD'
    });
  };

  return (
    <div style={{
      background: 'white',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
      marginBottom: '24px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#059669', margin: 0 }}>🔍 Buscar Propriedades</h2>
        <button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          style={{
            background: showAdvancedFilters ? '#059669' : '#f3f4f6',
            color: showAdvancedFilters ? 'white' : '#374151',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          {showAdvancedFilters ? '🔽 Menos Filtros' : '🔼 Mais Filtros'}
        </button>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <input
          type="text"
          placeholder="Buscar por título, localização, descrição ou tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '16px',
            outline: 'none'
          }}
        />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
        marginBottom: '16px'
      }}>
        <select
          value={filters.type}
          onChange={(e) => handleFilterChange('type', e.target.value)}
          style={{
            padding: '10px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            outline: 'none'
          }}
        >
          <option value="">🏠 Todos os tipos</option>
          <option value="farm">🌾 Fazenda</option>
          <option value="ranch">🐄 Estância</option>
          <option value="house">🏡 Casa</option>
          <option value="apartment">🏢 Apartamento</option>
          <option value="land">🌍 Terreno</option>
        </select>

        <input
          type="text"
          placeholder="📍 Cidade/Localização"
          value={filters.location}
          onChange={(e) => handleFilterChange('location', e.target.value)}
          style={{
            padding: '10px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            outline: 'none'
          }}
        />

        <select
          value={filters.currency}
          onChange={(e) => handleFilterChange('currency', e.target.value)}
          style={{
            padding: '10px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            outline: 'none'
          }}
        >
          <option value="USD">💵 USD</option>
          <option value="PYG">₲ PYG</option>
          <option value="BRL">🇧🇷 BRL</option>
        </select>
      </div>

      {showAdvancedFilters && (
        <div style={{
          background: '#f9fafb',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '16px'
        }}>
          <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>🎯 Filtros Avançados</h4>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div>
              <label style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>🛏️ Quartos (mín.)</label>
              <select
                value={filters.rooms}
                onChange={(e) => handleFilterChange('rooms', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              >
                <option value="">Qualquer</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>🚿 Banheiros (mín.)</label>
              <select
                value={filters.bathrooms}
                onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              >
                <option value="">Qualquer</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>📐 Área Mín. (m²)</label>
              <input
                type="number"
                placeholder="50"
                value={filters.minArea}
                onChange={(e) => handleFilterChange('minArea', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>📐 Área Máx. (m²)</label>
              <input
                type="number"
                placeholder="500"
                value={filters.maxArea}
                onChange={(e) => handleFilterChange('maxArea', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px'
          }}>
            <div>
              <label style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>💰 Preço Mínimo ({filters.currency})</label>
              <input
                type="number"
                placeholder={filters.currency === 'USD' ? '50000' : filters.currency === 'PYG' ? '300000000' : '250000'}
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>💰 Preço Máximo ({filters.currency})</label>
              <input
                type="number"
                placeholder={filters.currency === 'USD' ? '500000' : filters.currency === 'PYG' ? '3000000000' : '2500000'}
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
        <div style={{ fontSize: '14px', color: '#6b7280' }}>
          💡 Dica: Use os filtros para encontrar exatamente o que procura
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={clearFilters}
            style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            🗑️ Limpar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchSystem;