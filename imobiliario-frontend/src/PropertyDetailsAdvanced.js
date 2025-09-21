import React, { useState, useEffect } from 'react';
import PropertyMap from './components/PropertyMap';
import PropertySEO from './components/PropertySEO';

const PropertyDetailsAdvanced = ({ property, onClose, onWhatsAppContact }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState('details');


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
    purpose,
    description,
    features = [],
    images = [],
    realtor,
    tags = [],
    coordinates
  } = property;


  const formatPrice = (price) => {
    if (!price || price === undefined || price === null) {
      return 'Consultar preço';
    }

    let numPrice = price;
    if (typeof price === 'string') {
      numPrice = parseFloat(price.replace(/[^\\d.-]/g, ''));
      if (isNaN(numPrice)) return 'Consultar preço';
    }

    if (typeof numPrice !== 'number') {
      return 'Consultar preço';
    }

    return `US$ ${numPrice.toLocaleString()}`;
  };

  const handleWhatsAppContact = () => {
    if (realtor && realtor.whatsapp) {
      const message = `Olá! Tenho interesse na propriedade: ${title} - ${formatPrice(price)}. Localizada em ${location}. Gostaria de mais informações.`;
      const whatsappUrl = `https://wa.me/${realtor.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      if (onWhatsAppContact) {
        onWhatsAppContact(property);
      }
    }
  };

  const nextImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const openFullscreen = () => {
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  const ImageGallery = () => (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '400px',
      background: images.length > 0 ? `url(${images[currentImageIndex]})` : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      borderRadius: '12px',
      marginBottom: '20px',
      overflow: 'hidden'
    }}>
      {images.length === 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: 'white',
          fontSize: '64px'
        }}>
          🏠
        </div>
      )}

      {images.length > 0 && (
        <>
          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  cursor: 'pointer',
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ←
              </button>
              <button
                onClick={nextImage}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  cursor: 'pointer',
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                →
              </button>
            </>
          )}

          {/* Fullscreen Button */}
          <button
            onClick={openFullscreen}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(0,0,0,0.5)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 12px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🔍 Ampliar
          </button>

          {/* Image Counter */}
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px'
          }}>
            {currentImageIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );

  const FullscreenGallery = () => {
    if (!isFullscreen) return null;

    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.95)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          position: 'relative',
          maxWidth: '90vw',
          maxHeight: '90vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img
            src={images[currentImageIndex]}
            alt={`${title} - ${currentImageIndex + 1}`}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain'
            }}
          />

          {/* Close Button */}
          <button
            onClick={closeFullscreen}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              fontSize: '20px'
            }}
          >
            ×
          </button>

          {/* Navigation in Fullscreen */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                style={{
                  position: 'absolute',
                  left: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '50px',
                  height: '50px',
                  cursor: 'pointer',
                  fontSize: '24px'
                }}
              >
                ←
              </button>
              <button
                onClick={nextImage}
                style={{
                  position: 'absolute',
                  right: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '50px',
                  height: '50px',
                  cursor: 'pointer',
                  fontSize: '24px'
                }}
              >
                →
              </button>
            </>
          )}

          {/* Image Counter in Fullscreen */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '14px'
          }}>
            {currentImageIndex + 1} / {images.length}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <PropertySEO property={property} />
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: '16px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          maxWidth: '1200px',
          width: '100%',
          maxHeight: '95vh',
          overflowY: 'auto',
          position: 'relative'
        }}>
          {/* Header */}
          <div style={{
            position: 'sticky',
            top: 0,
            background: 'white',
            borderBottom: '1px solid #e5e7eb',
            padding: '24px',
            borderRadius: '16px 16px 0 0',
            zIndex: 10
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '16px'
            }}>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#059669', margin: '0 0 8px 0' }}>
                  {title}
                </h2>
                <p style={{ color: '#6b7280', fontSize: '16px', margin: 0 }}>
                  📍 {location}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={onClose}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '28px',
                    cursor: 'pointer',
                    color: '#6b7280',
                    padding: '4px'
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {['details', 'location', 'contact'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '8px',
                    background: activeTab === tab ? '#059669' : '#f3f4f6',
                    color: activeTab === tab ? 'white' : '#374151',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  {tab === 'details' && '📋 Detalhes'}
                  {tab === 'location' && '📍 Localização'}
                  {tab === 'contact' && '📞 Contato'}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: '24px' }}>
            {activeTab === 'details' && (
              <>
                {/* Image Gallery */}
                <ImageGallery />


                {/* Price and Details */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr',
                  gap: '24px',
                  marginBottom: '32px'
                }}>
                  {/* Price Section */}
                  <div style={{
                    background: '#f0fdf4',
                    padding: '24px',
                    borderRadius: '16px',
                    border: '2px solid #bbf7d0'
                  }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#059669' }}>
                      💰 Preço
                    </h3>
                    <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#059669', marginBottom: '12px' }}>
                      {formatPrice(price)}
                    </div>


                    {purpose && (
                      <div style={{
                        background: '#059669',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: '500',
                        display: 'inline-block'
                      }}>
                        Para {purpose === 'sale' ? 'Venda' : 'Aluguel'}
                      </div>
                    )}
                  </div>

                  {/* Property Specs */}
                  <div style={{
                    background: '#fafafa',
                    padding: '24px',
                    borderRadius: '16px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>
                      📊 Especificações
                    </h3>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                      gap: '16px'
                    }}>
                      {area && (
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '24px', marginBottom: '4px' }}>📐</div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>Área</div>
                          <div style={{ fontWeight: '600', color: '#374151' }}>{area} {areaUnit}</div>
                        </div>
                      )}
                      {rooms && (
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '24px', marginBottom: '4px' }}>🛏️</div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>Quartos</div>
                          <div style={{ fontWeight: '600', color: '#374151' }}>{rooms}</div>
                        </div>
                      )}
                      {bathrooms && (
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '24px', marginBottom: '4px' }}>🚿</div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>Banheiros</div>
                          <div style={{ fontWeight: '600', color: '#374151' }}>{bathrooms}</div>
                        </div>
                      )}
                      {parking && (
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '24px', marginBottom: '4px' }}>🚗</div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>Vagas</div>
                          <div style={{ fontWeight: '600', color: '#374151' }}>{parking}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                {description && (
                  <div style={{
                    background: 'white',
                    padding: '24px',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    marginBottom: '24px'
                  }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>
                      📝 Descrição
                    </h3>
                    <p style={{ color: '#6b7280', lineHeight: '1.7', fontSize: '16px', margin: 0 }}>
                      {description}
                    </p>
                  </div>
                )}

                {/* Features */}
                {features && features.length > 0 && (
                  <div style={{
                    background: 'white',
                    padding: '24px',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    marginBottom: '24px'
                  }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>
                      ✨ Características
                    </h3>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                      gap: '12px'
                    }}>
                      {features.map((feature, index) => (
                        <div
                          key={index}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px'
                          }}
                        >
                          <span style={{ color: '#10b981', fontSize: '16px' }}>✓</span>
                          <span style={{ color: '#374151' }}>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {tags && tags.length > 0 && (
                  <div style={{
                    background: 'white',
                    padding: '24px',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    marginBottom: '24px'
                  }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>
                      🏷️ Tags
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {tags.map((tag, index) => (
                        <span
                          key={index}
                          style={{
                            background: '#dbeafe',
                            color: '#1e40af',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '14px',
                            fontWeight: '500'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'location' && (
              <div style={{
                background: 'white',
                padding: '24px',
                borderRadius: '12px',
                border: '1px solid #e5e7eb'
              }}>
                <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px', color: '#374151' }}>
                  📍 Localização
                </h3>

                <div style={{
                  background: '#f8fafc',
                  padding: '20px',
                  borderRadius: '12px',
                  marginBottom: '20px'
                }}>
                  <div style={{ fontSize: '18px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    {location}
                  </div>
                  {coordinates && (
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      Coordenadas: {coordinates.lat}, {coordinates.lng}
                    </div>
                  )}
                </div>

                {/* Mapa Interativo */}
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>
                    🗺️ Mapa Interativo
                  </h4>
                  <PropertyMap property={property} height={400} />
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div style={{
                background: 'white',
                padding: '24px',
                borderRadius: '12px',
                border: '1px solid #e5e7eb'
              }}>
                <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px', color: '#374151' }}>
                  👤 Corretor Responsável
                </h3>

                {realtor && (
                  <div style={{
                    background: '#f8fafc',
                    padding: '24px',
                    borderRadius: '12px',
                    marginBottom: '24px'
                  }}>
                    <div style={{ fontSize: '20px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                      {realtor.name}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {realtor.email && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>📧</span>
                          <a href={`mailto:${realtor.email}`} style={{ color: '#059669', textDecoration: 'none' }}>
                            {realtor.email}
                          </a>
                        </div>
                      )}
                      {realtor.phone && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>📱</span>
                          <span style={{ color: '#374151' }}>{realtor.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Contact Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button
                    onClick={handleWhatsAppContact}
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      padding: '16px 24px',
                      borderRadius: '12px',
                      border: 'none',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>📱</span>
                    Contatar via WhatsApp
                  </button>

                  <button
                    onClick={() => {
                      const message = `Estou interessado no imóvel: ${title} - ${formatPrice(price)} em ${location}`;
                      navigator.clipboard.writeText(message);
                      alert('Informações copiadas para a área de transferência!');
                    }}
                    style={{
                      background: '#3b82f6',
                      color: 'white',
                      padding: '16px 24px',
                      borderRadius: '12px',
                      border: 'none',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>📋</span>
                    Copiar Informações
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '32px',
              padding: '20px 0'
            }}>
              <button
                onClick={onClose}
                style={{
                  background: '#6b7280',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Fechar
              </button>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => {
                    // Add to favorites logic
                    alert('Adicionado aos favoritos!');
                  }}
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  ❤️ Favoritar
                </button>

                <button
                  onClick={handleWhatsAppContact}
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  📱 Contatar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Gallery */}
      <FullscreenGallery />
    </>
  );
};

export default PropertyDetailsAdvanced;