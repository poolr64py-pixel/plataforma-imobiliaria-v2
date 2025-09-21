import React, { useState, useEffect } from 'react';

const CRMLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de leads
    setTimeout(() => {
      setLeads([
        {
          id: 1,
          nome: 'João Silva',
          email: 'joao@email.com',
          telefone: '+55 11 99999-9999',
          interesse: 'comprar',
          mensagem: 'Interesse em fazenda para agronegócio',
          data: '2024-01-15',
          status: 'novo'
        },
        {
          id: 2,
          nome: 'Maria Santos',
          email: 'maria@email.com',
          telefone: '+55 11 88888-8888',
          interesse: 'investir',
          mensagem: 'Procuro boas oportunidades de investimento no Paraguay',
          data: '2024-01-14',
          status: 'contatado'
        },
        {
          id: 3,
          nome: 'Carlos Rodriguez',
          email: 'carlos@email.com',
          telefone: '+595 981 777777',
          interesse: 'vender',
          mensagem: 'Tenho uma propriedade para vender',
          data: '2024-01-13',
          status: 'fechado'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'novo': return 'bg-blue-100 text-blue-800';
      case 'contatado': return 'bg-yellow-100 text-yellow-800';
      case 'fechado': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = (leadId, newStatus) => {
    setLeads(prev => prev.map(lead =>
      lead.id === leadId ? { ...lead, status: newStatus } : lead
    ));
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Carregando leads...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">📋 CRM - Gerenciamento de Leads</h2>
        <div className="text-sm text-gray-600">
          Total: {leads.length} leads
        </div>
      </div>

      <div className="grid gap-4">
        {leads.map(lead => (
          <div key={lead.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-lg">{lead.nome}</h3>
                <p className="text-gray-600">{lead.email}</p>
                <p className="text-gray-600">{lead.telefone}</p>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(lead.status)}`}>
                  {lead.status.toUpperCase()}
                </span>
                <p className="text-sm text-gray-500 mt-1">{lead.data}</p>
              </div>
            </div>

            <div className="mb-3">
              <p className="text-sm text-gray-700">
                <strong>Interesse:</strong> {lead.interesse}
              </p>
              <p className="text-sm text-gray-700 mt-1">
                <strong>Mensagem:</strong> {lead.mensagem}
              </p>
            </div>

            <div className="flex space-x-2">
              <select
                value={lead.status}
                onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="novo">Novo</option>
                <option value="contatado">Contatado</option>
                <option value="fechado">Fechado</option>
              </select>

              <button
                onClick={() => window.open(`https://wa.me/${lead.telefone.replace(/[^0-9]/g, '')}`, '_blank')}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
              >
                WhatsApp
              </button>

              <button
                onClick={() => window.open(`mailto:${lead.email}`, '_blank')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                Email
              </button>
            </div>
          </div>
        ))}
      </div>

      {leads.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-4">📝</div>
          <p>Nenhum lead encontrado</p>
        </div>
      )}
    </div>
  );
};

export default CRMLeads;