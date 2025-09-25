import React, { useState } from 'react';
import ImageUpload from './ImageUpload';

const PropertyForm = ({ property, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: property?.title || '',
    description: property?.description || '',
    price: property?.price || '',
    location: property?.location || '',
    area: property?.area || '',
    areaUnit: property?.areaUnit || 'hectares',
    rooms: property?.rooms || '',
    bathrooms: property?.bathrooms || '',
    parking: property?.parking || '',
    type: property?.type || 'farm',
    purpose: property?.purpose || 'sale',
    status: property?.status || 'active',
    features: property?.features?.join(', ') || '',
    tags: property?.tags?.join(', ') || '',
    images: property?.images || [],
    coordinates: property?.coordinates || { lat: '', lng: '' }
  });

  const [loading, setLoading] = useState(false);

  const API_BASE = window.location.hostname === 'localhost' 
    ? 'http://localhost:3001' 
    : process.env.REACT_APP_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCoordinateChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      coordinates: {
        ...prev.coordinates,
        [field]: value
      }
    }));
  };

  const handleImagesUpdate = (images) => {
    setFormData(prev => ({
      ...prev,
      images
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dataToSend = {
      ...formData,
      price: parseFloat(formData.price),
      area: parseFloat(formData.area),
      rooms: formData.rooms ? parseInt(formData.rooms) : null,
      bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
      parking: formData.parking ? parseInt(formData.parking) : null,
      features: formData.features ? formData.features.split(',').map(f => f.trim()).filter(f => f) : [],
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [],
      coordinates: (formData.coordinates.lat && formData.coordinates.lng) ? {
        lat: parseFloat(formData.coordinates.lat),
        lng: parseFloat(formData.coordinates.lng)
      } : null
    };

    try {
      const url = property 
        ? `${API_BASE}/api/properties/${property.id}`
        : `${API_BASE}/api/properties`;

      const method = property ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
        },
        body: JSON.stringify(dataToSend)
      });

      if (response.ok) {
        alert(property ? 'Propriedade atualizada com sucesso!' : 'Propriedade criada com sucesso!');
        onSave();
        onClose();
      } else {
        alert('Erro ao salvar propriedade');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao salvar propriedade');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '12px', 
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#059669', margin: 0 }}>
            {property ? 'Editar Propriedade' : 'Nova Propriedade'}
          </h2>
          <button 
            onClick={onClose}
            style={{
              background: '#6b7280',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Cancelar
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>
              Informações Básicas
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>
                  Título *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>
                  Localização *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="Cidade, Estado - País"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>
                Descrição
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>
              Valores e Medidas
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>
                  Preço (USD) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>
                  Área *
                </label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>
                  Unidade
                </label>
                <select
                  name="areaUnit"
                  value={formData.areaUnit}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value="hectares">Hectares</option>
                  <option value="m²">m²</option>
                  <option value="acres">Acres</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>
                  Tipo *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value="farm">Fazenda</option>
                  <option value="ranch">Estância</option>
                  <option value="house">Casa</option>
                  <option value="apartment">Apartamento</option>
                  <option value="land">Terreno</option>
                </select>
              </div>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>
              Características
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>
                  Quartos
                </label>
                <input
                  type="number"
                  name="rooms"
                  value={formData.rooms}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>
                  Banheiros
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>
                  Vagas
                </label>
                <input
                  type="number"
                  name="parking"
                  value={formData.parking}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value="active">Ativo</option>
                  <option value="sold">Vendido</option>
                  <option value="rented">Alugado</option>
                </select>
              </div>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>
              Localização (Mapa)
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.coordinates.lat}
                  onChange={(e) => handleCoordinateChange('lat', e.target.value)}
                  placeholder="-25.2637"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.coordinates.lng}
                  onChange={(e) => handleCoordinateChange('lng', e.target.value)}
                  placeholder="-57.5759"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>
                  Características (separadas por vírgula)
                </label>
                <input
                  type="text"
                  name="features"
                  value={formData.features}
                  onChange={handleChange}
                  placeholder="Piscina, Churrasqueira, Jardim"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>
                  Tags (separadas por vírgula)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="Luxo, Vista pro mar, Novo"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>
              Imagens
            </h3>
            <ImageUpload 
              images={formData.images}
              onImagesUpdate={handleImagesUpdate}
            />

            <div style={{ marginTop: '32px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: loading ? '#9ca3af' : '#059669',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                {loading ? 'Salvando...' : (property ? 'Atualizar' : 'Criar Propriedade')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyForm;