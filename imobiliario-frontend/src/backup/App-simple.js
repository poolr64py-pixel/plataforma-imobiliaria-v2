import React, { useState, useEffect } from 'react';

function App() {
  const [properties, setProperties] = useState([]);
  const [status, setStatus] = useState('Carregando...');
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('App iniciado - testando conexão com backend...');

    // Testar conexão com backend
    fetch('http://localhost:3001/')
      .then(response => response.json())
      .then(data => {
        console.log('Resposta do backend:', data);
        setStatus(data.message || 'Conectado');
      })
      .catch(error => {
        console.error('Erro ao conectar:', error);
        setStatus('Backend offline');
        setError(error.message);
      });

    // Buscar propriedades
    fetch('http://localhost:3001/api/properties')
      .then(response => response.json())
      .then(data => {
        console.log('Propriedades recebidas:', data);
        if (data.success) {
          setProperties(data.data);
        }
      })
      .catch(error => {
        console.error('Erro ao buscar propriedades:', error);
        setError(error.message);
      });
  }, []);

  console.log('Renderizando App - propriedades:', properties.length);

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <header style={{
        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
        color: 'white',
        padding: '30px',
        borderRadius: '12px',
        textAlign: 'center',
        marginBottom: '30px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: 0, fontSize: '2.5em' }}>🌱 Terras Paraguay</h1>
        <p style={{ margin: '10px 0', fontSize: '1.2em' }}>
          Propriedades e investimentos no coração da América do Sul
        </p>
        <div style={{
          background: 'rgba(255,255,255,0.2)',
          padding: '10px',
          borderRadius: '8px',
          marginTop: '15px'
        }}>
          <strong>Status API:</strong> {status}
          {error && <div style={{ color: '#ffc107', marginTop: '5px' }}>Erro: {error}</div>}
        </div>
      </header>

      <main>
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
            <div style={{ padding: '15px', background: '#e8f5e8', borderRadius: '8px' }}>
              <strong>✅ Frontend React</strong><br />
              <span style={{ color: '#666' }}>Porta 3003</span>
            </div>
            <div style={{ padding: '15px', background: '#e8f5e8', borderRadius: '8px' }}>
              <strong>✅ Backend API</strong><br />
              <span style={{ color: '#666' }}>Porta 3001</span>
            </div>
            <div style={{ padding: '15px', background: '#e8f5e8', borderRadius: '8px' }}>
              <strong>✅ JavaScript</strong><br />
              <span style={{ color: '#666' }}>Executando</span>
            </div>
            <div style={{ padding: '15px', background: '#e8f5e8', borderRadius: '8px' }}>
              <strong>📊 Propriedades</strong><br />
              <span style={{ color: '#666' }}>{properties.length} encontradas</span>
            </div>
          </div>
        </section>

        <section style={{
          background: 'white',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#059669', margin: '0 0 20px 0' }}>
            🏡 Propriedades Terras Paraguay ({properties.length})
          </h2>

          {properties.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#666',
              background: '#f8f9fa',
              borderRadius: '8px',
              border: '2px dashed #ddd'
            }}>
              <div style={{ fontSize: '3em', marginBottom: '15px' }}>🔄</div>
              <p>Carregando propriedades do backend...</p>
              <small>Verifique se o backend está rodando na porta 3001</small>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '20px'
            }}>
              {properties.map(property => (
                <div key={property.id} style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '12px',
                  padding: '20px',
                  background: 'white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  <h3 style={{
                    color: '#059669',
                    margin: '0 0 15px 0',
                    fontSize: '1.3em'
                  }}>
                    {property.title}
                  </h3>

                  <div style={{ marginBottom: '15px' }}>
                    <div style={{
                      fontSize: '1.5em',
                      fontWeight: 'bold',
                      color: '#2c3e50',
                      marginBottom: '5px'
                    }}>
                      {property.currency} {property.price?.toLocaleString()}
                    </div>
                    <div style={{ color: '#666', fontSize: '0.9em' }}>
                      📍 {property.location}
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '10px',
                    marginBottom: '15px',
                    fontSize: '0.9em'
                  }}>
                    <div><strong>Tipo:</strong> {property.type}</div>
                    <div><strong>Área:</strong> {property.area} {property.areaUnit}</div>
                    {property.rooms && <div><strong>Quartos:</strong> {property.rooms}</div>}
                    {property.bathrooms && <div><strong>Banheiros:</strong> {property.bathrooms}</div>}
                  </div>

                  <p style={{
                    color: '#666',
                    fontSize: '0.9em',
                    lineHeight: '1.4',
                    marginBottom: '15px'
                  }}>
                    {property.description?.substring(0, 120)}...
                  </p>

                  <div style={{ marginBottom: '15px' }}>
                    {property.tags?.map((tag, index) => (
                      <span key={index} style={{
                        background: '#059669',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.8em',
                        marginRight: '8px',
                        marginBottom: '5px',
                        display: 'inline-block'
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button style={{
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    width: '100%',
                    fontSize: '1em',
                    fontWeight: 'bold'
                  }}>
                    Ver Detalhes
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer style={{
        marginTop: '40px',
        padding: '25px',
        background: 'linear-gradient(135deg, #047857 0%, #059669 100%)',
        color: 'white',
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '1.1em', marginBottom: '10px' }}>
          © 2025 Terras Paraguay - Investimentos Imobiliários
        </div>
        <div style={{ fontSize: '0.9em', opacity: 0.9 }}>
          🌐 Plataforma White Label | Frontend: 3003 | Backend API: 3001
        </div>
        <div style={{ fontSize: '0.9em', marginTop: '5px', opacity: 0.9 }}>
          ✉️ contato@terrasparaguay.com | 📱 +595 971 123456
        </div>
      </footer>
    </div>
  );
}

export default App;