import React, { createContext, useContext, useState } from 'react';

const translations = {
  pt: {
    specialistTitle: 'Especialista em Imóveis',
    contact: 'Contato',
    loading: 'Carregando...',
    available: 'Disponível',
    bedrooms: 'quartos',
    bathrooms: 'banheiros',
    viewDetails: 'Ver Detalhes',
    whatsappMessage: 'Tenho interesse nesta propriedade',
    name: 'Nome',
    email: 'Email',
    phone: 'Telefone',
    interest: 'Interesse',
    buy: 'Comprar',
    sell: 'Vender',
    rent: 'Alugar',
    invest: 'Investir',
    evaluate: 'Avaliar',
    message: 'Mensagem',
    send: 'Enviar',
    sending: 'Enviando...',
    successMessage: 'Mensagem enviada com sucesso!',
    errorMessage: 'Erro ao enviar mensagem',
    results: 'resultados',
    noResults: 'Nenhum resultado encontrado'
  },
  en: {
    specialistTitle: 'Real Estate Specialist',
    contact: 'Contact',
    loading: 'Loading...',
    available: 'Available',
    bedrooms: 'bedrooms',
    bathrooms: 'bathrooms',
    viewDetails: 'View Details',
    whatsappMessage: 'I am interested in this property',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    interest: 'Interest',
    buy: 'Buy',
    sell: 'Sell',
    rent: 'Rent',
    invest: 'Invest',
    evaluate: 'Evaluate',
    message: 'Message',
    send: 'Send',
    sending: 'Sending...',
    successMessage: 'Message sent successfully!',
    errorMessage: 'Error sending message',
    results: 'results',
    noResults: 'No results found'
  }
};

const LocalizationContext = createContext();

export const LocalizationProvider = ({ children }) => {
  const [language, setLanguage] = useState('pt');

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LocalizationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useTranslation must be used within LocalizationProvider');
  }
  return context;
};

export const LanguageSelector = ({ className }) => {
  const { language, setLanguage } = useTranslation();

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      className={`bg-white border border-gray-300 rounded px-2 py-1 text-sm ${className}`}
    >
      <option value="pt">🇧🇷 PT</option>
      <option value="en">🇺🇸 EN</option>
    </select>
  );
};

export const PriceFormatter = ({ price, currency = 'USD' }) => {
  if (!price) return <span className="text-gray-500">Consultar preço</span>;

  return (
    <div className="text-2xl font-bold text-green-600">
      {currency} ${price.toLocaleString()}
    </div>
  );
};

export const ExchangeRateInfo = ({ className }) => {
  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
      <h3 className="font-bold text-blue-800 mb-2">💱 Informações de Câmbio</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div>
          <strong>USD → BRL:</strong> R$ 5.20
        </div>
        <div>
          <strong>USD → PYG:</strong> ₲ 7,300
        </div>
        <div>
          <strong>Atualizado:</strong> Hoje
        </div>
      </div>
    </div>
  );
};