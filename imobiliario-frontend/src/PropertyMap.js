import React from 'react';

const PropertyMap = ({ property }) => {
  const { coordinates, location } = property || {};

  if (!coordinates) {
    return (
      <div className="bg-gray-100 h-64 flex items-center justify-center rounded-lg">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">🗺️</div>
          <p>Mapa não disponível</p>
        </div>
      </div>
    );
  }

  // Usar OpenStreetMap como alternativa gratuita ao Google Maps
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${coordinates.lng - 0.01},${coordinates.lat - 0.01},${coordinates.lng + 0.01},${coordinates.lat + 0.01}&layer=mapnik&marker=${coordinates.lat},${coordinates.lng}`;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-gray-50 border-b">
        <h3 className="font-bold text-lg">📍 Localização</h3>
        <p className="text-gray-600">{location}</p>
      </div>

      <div className="h-64">
        <iframe
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Mapa de ${location}`}
        ></iframe>
      </div>

      <div className="p-4 bg-gray-50 border-t">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Lat: {coordinates.lat}</span>
          <span>Lng: {coordinates.lng}</span>
        </div>
        <button
          onClick={() => window.open(`https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`, '_blank')}
          className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm w-full"
        >
          Abrir no Google Maps
        </button>
      </div>
    </div>
  );
};

export default PropertyMap;