import React, { useState, useEffect } from 'react';
import PropertyForm from './PropertyForm';

const AdminDashboard = ({ user, onLogout }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [stats, setStats] = useState({ total: 0, active: 0, sold: 0 });

  const API_BASE = 'http://localhost:3001';

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/properties`);
      const data = await response.json();
      const propertiesData = data.data || data;
      setProperties(propertiesData);
      
      const active = propertiesData.filter(p => p.purpose === 'sale' || p.status === 'disponivel').length;
const sold = propertiesData.filter(p => p.status === 'vendido' || p.purpose === 'sold').length;
      setStats({ total: propertiesData.length, active, sold });
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar propriedades:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar esta propriedade?')) return;
    try {
      const response = await fetch(`${API_BASE}/api/properties/${id}`, { method: 'DELETE' });
      if (response.ok) {
        alert('Propriedade deletada com sucesso!');
        loadProperties();
      }
    } catch (error) {
      alert('Erro ao deletar propriedade');
    }
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProperty(null);
    loadProperties();
  };

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Carregando...</div>;
  if (showForm) return <PropertyForm property={editingProperty} onClose={handleFormClose} />;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <div style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Painel Admin</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>{user?.email || 'Admin'}</span>
            <button onClick={onLogout} style={{ padding: '8px 16px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Sair</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '14px', color: '#666' }}>Total</h3>
            <p style={{ fontSize: '36px', fontWeight: 'bold' }}>{stats.total}</p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '14px', color: '#666' }}>Disponíveis</h3>
            <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#10b981' }}>{stats.active}</p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '14px', color: '#666' }}>Vendidos</h3>
            <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#3b82f6' }}>{stats.sold}</p>
          </div>
        </div>

        <button onClick={() => { setEditingProperty(null); setShowForm(true); }} style={{ padding: '12px 24px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginBottom: '24px' }}>+ Nova Propriedade</button>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
            <h2>Propriedades Cadastradas</h2>
          </div>
          {properties.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center' }}>Nenhuma propriedade</div>
          ) : (
            <table style={{ width: '100%' }}>
              <thead style={{ backgroundColor: '#f9fafb' }}>
                <tr>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Título</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Preço</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Localização</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {properties.map(p => (
                  <tr key={p.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px' }}>{p.title}</td>
                    <td style={{ padding: '12px' }}>USD {p.price?.toLocaleString()}</td>
                    <td style={{ padding: '12px' }}>{p.location}</td>
                    <td style={{ padding: '12px', display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleEdit(p)} style={{ padding: '6px 12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Editar</button>
                      <button onClick={() => handleDelete(p.id)} style={{ padding: '6px 12px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Deletar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;