import React from 'react';

const PropertyDetails = ({ property, onClose, onWhatsAppContact }) => {
  if (!property) return null;

  const {
    title,
    price,
    currency = 'USD',
    location,
    area,
    areaUnit,
    rooms,
    bathrooms,
    parking,
    type,
    purpose,
    description,
    features = [],
    images = [],
    realtor,
    tags = []
  } = property;

  const formatPrice = (price, currency) => {
    if (!price || price === undefined || price === null) {
      return 'Consultar preço';
    }

    let numPrice = price;
    if (typeof price === 'string') {
      numPrice = parseFloat(price.replace(/[^\d.-]/g, ''));
      if (isNaN(numPrice)) return 'Consultar preço';
    }

    if (typeof numPrice !== 'number') {
      return 'Consultar preço';
    }

    if (currency === 'USD') {
      return `US$ ${numPrice.toLocaleString()}`;
    } else if (currency === 'PYG') {
      return `₲ ${numPrice.toLocaleString()}`;
    } else if (currency === 'BRL') {
      return `R$ ${numPrice.toLocaleString()}`;
    }
    return `${currency} ${numPrice.toLocaleString()}`;
  };

  const handleWhatsAppContact = () => {
    if (realtor && realtor.whatsapp) {
      const message = `Olá! Tenho interesse na propriedade: ${title} - ${formatPrice(price, currency)}. Localizada em ${location}. Gostaria de mais informações.`;
      const whatsappUrl = `https://wa.me/${realtor.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      if (onWhatsAppContact) {
        onWhatsAppContact(property);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {/* Images Gallery */}
          {images && images.length > 0 && (
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${title} - ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Price and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">💰 Preço</h3>
              <p className="text-2xl font-bold text-green-600">
                {formatPrice(price, currency)}
              </p>
              {purpose && (
                <p className="text-sm text-gray-600 mt-1">
                  Para {purpose === 'sale' ? 'Venda' : 'Aluguel'}
                </p>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">📍 Localização</h3>
              <p className="text-gray-700">{location}</p>
            </div>
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {area && (
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Área</p>
                <p className="font-semibold">{area} {areaUnit}</p>
              </div>
            )}
            {rooms && (
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Quartos</p>
                <p className="font-semibold">{rooms}</p>
              </div>
            )}
            {bathrooms && (
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Banheiros</p>
                <p className="font-semibold">{bathrooms}</p>
              </div>
            )}
            {parking && (
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Vagas</p>
                <p className="font-semibold">{parking}</p>
              </div>
            )}
          </div>

          {/* Description */}
          {description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">📝 Descrição</h3>
              <p className="text-gray-700 leading-relaxed">{description}</p>
            </div>
          )}

          {/* Features */}
          {features && features.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">✨ Características</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">🏷️ Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Realtor Info */}
          {realtor && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">👤 Corretor</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">{realtor.name}</p>
                  {realtor.email && (
                    <p className="text-gray-600">📧 {realtor.email}</p>
                  )}
                  {realtor.phone && (
                    <p className="text-gray-600">📱 {realtor.phone}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={handleWhatsAppContact}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center"
            >
              <span className="mr-2">📱</span>
              Contatar via WhatsApp
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;