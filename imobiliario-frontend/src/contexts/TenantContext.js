import React, { createContext, useContext, useState } from 'react';

const TenantContext = createContext();

const tenants = {
  default: {
    id: 'default',
    nome: 'Terras Paraguay',
    email: 'contato@terrasparaguay.com',
    colors: {
      primary: '#059669',
      secondary: '#047857',
      accent: '#10b981'
    },
    country: 'Paraguay',
    flag: '🇵🇾',
    currency: 'USD'
  },
  'terras-paraguay': {
    id: 'terras-paraguay',
    nome: 'Terras Paraguay',
    email: 'contato@terrasparaguay.com',
    colors: {
      primary: '#059669',
      secondary: '#047857',
      accent: '#10b981'
    },
    country: 'Paraguay',
    flag: '🇵🇾',
    currency: 'USD'
  },
  'imobiliaria-santos': {
    id: 'imobiliaria-santos',
    nome: 'Imobiliária Santos',
    email: 'contato@imobiliariasantos.com.br',
    colors: {
      primary: '#1e40af',
      secondary: '#1e3a8a',
      accent: '#3b82f6'
    },
    country: 'Brasil',
    flag: '🇧🇷',
    currency: 'BRL'
  }
};

export const TenantProvider = ({ children }) => {
  const [currentTenant, setCurrentTenant] = useState(tenants.default);

  const switchTenant = (tenantId) => {
    if (tenants[tenantId]) {
      setCurrentTenant(tenants[tenantId]);
    }
  };

  return (
    <TenantContext.Provider value={{
      tenant: currentTenant,
      tenants: Object.values(tenants),
      switchTenant
    }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within TenantProvider');
  }
  return context;
};