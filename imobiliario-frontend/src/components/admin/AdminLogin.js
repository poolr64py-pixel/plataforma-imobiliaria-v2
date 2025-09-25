import React, { useState } from 'react';

const AdminLogin = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        onLogin(data.user);
      } else {
        setError(data.message || 'Email ou senha incorretos');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #059669, #047857)' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111' }}>🏢 Admin Panel</h1>
          <p style={{ color: '#666', marginTop: '8px' }}>Painel Imobiliário</p>
        </div>

        {error && (
          <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#fee', border: '1px solid #fcc', color: '#c33', borderRadius: '8px' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>📧 Email</label>
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '16px' }}
              placeholder="admin@terrasparaguay.com"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>🔒 Senha</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '16px' }}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '14px', 
              backgroundColor: '#059669', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              fontSize: '16px', 
              fontWeight: '600', 
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? '🔄 Entrando...' : '🚀 Entrar'}
          </button>
        </form>

        <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#fef3c7', border: '1px solid #fde68a', borderRadius: '8px' }}>
          <p style={{ fontSize: '14px', color: '#92400e', margin: 0 }}>
            <strong>Demo:</strong><br/>
            admin@terrasparaguay.com<br/>
            admin123
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;