import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default markers
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const PropertyMap = ({ property, height = 400 }) => {
  // Default coordinates for Paraguay if no coordinates available
  const defaultCoords = { lat: -25.263, lng: -57.575 }; // Asunción

  const coords = property?.coordinates || property?.coordenadas || defaultCoords;

  if (!coords || !coords.lat || !coords.lng) {
    return (
      <div style={{
        height: `${height}px`,
        background: '#f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '8px',
        border: '1px solid #d1d5db',
        color: '#6b7280'
      }}>
        📍 Localização não disponível
      </div>
    );
  }

  return (
    <div style={{ height: `${height}px`, width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
      <MapContainer
        center={[coords.lat, coords.lng]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[coords.lat, coords.lng]}>
          <Popup>
            <div style={{ textAlign: 'center' }}>
              <strong>{property?.title || property?.titulo}</strong><br />
              📍 {property?.location || property?.localizacao}<br />
              💰 {property?.price ? `US$ ${property.price.toLocaleString()}` : 'Consultar preço'}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default PropertyMap;