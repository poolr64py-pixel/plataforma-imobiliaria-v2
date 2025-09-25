import React, { useState } from 'react';

const PropertyForm = ({ property, onClose }) => {
  const [formData, setFormData] = useState({
    title: property?.title || '',
    description: property?.description || '',
    price: property?.price || '',
    location: property?.location || '',
    area: property?.area || '',
    type: property?.type || 'farm',
    status: property?.status || 'disponivel',
    images: property?.images || []
  });

  const [loading, setLoading] = useState(false);
  const API_BASE = 'http://localhost:3001';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = property 
        ? `${API_BASE}/api/properties/${property.id}`
        : `${API_BASE}/api/properties`;
      
      const method = property ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          area: parseFloat(formData.area)
        })
      });

      if (response.ok) {
        alert(property ? 'Propriedade atualizada!' : 'Propriedade criada!');
        onClose();
      } else {
        alert('Erro ao salvar propriedade');
      }
    } catch (error) {
      alert('Erro ao salvar propriedade');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'white', borderRadius: '12px', padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h2>{property ? 'Editar' : 'Nova'} Propriedade</h2>
          <button onClick={onClose} style={{ padding: '8px 16px', backgroundColor: '#e5e7eb', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Voltar</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Título</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Descrição</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="4" style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Preço (USD)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} required style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Área</label>
              <input type="number" name="area" value={formData.area} onChange={handleChange} required style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Localização</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} required style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Tipo</label>
              <select name="type" value={formData.type} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }}>
                <option value="farm">Fazenda</option>
                <option value="ranch">Rancho</option>
                <option value="land">Terreno</option>
                <option value="house">Casa</option>
                <option value="apartment">Apartamento</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Status</label>
              <select name="status" value={formData.status} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }}>
                <option value="disponivel">Disponível</option>
                <option value="vendido">Vendido</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{ padding: '12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '600' }}>
            {loading ? 'Salvando...' : 'Salvar Propriedade'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PropertyForm;