import React, { useState, useEffect } from 'react';

const PropertyDetailsEnhanced = ({ property, onClose, onWhatsAppContact }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('details');
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  // Mock images if none provided
  const propertyImages = images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=600&fit=crop'
  ];

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
    if (onWhatsAppContact) {
      onWhatsAppContact(property);
    } else {
      const message = `Olá! Tenho interesse na propriedade: ${title} - ${formatPrice(price, currency)}. Localizada em ${location}. Gostaria de mais informações.`;
      const phoneNumber = '+595971123456';
      const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % propertyImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + propertyImages.length) % propertyImages.length);
  };

  const ImageGallery = () => (
    <div style={{ position: 'relative' }}>
      <div style={{
        width: '100%',
        height: '400px',
        borderRadius: '12px',
        overflow: 'hidden',
        position: 'relative',
        background: '#f3f4f6'
      }}>
        {propertyImages.length > 0 ? (
          <>
            <img
              src={propertyImages[currentImageIndex]}
              alt={`${title} - ${currentImageIndex + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '64px',
              color: 'white'
            }}>
              🏠
            </div>
          </>
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '64px',
            color: 'white'
          }}>
            🏠
          </div>
        )}

        {/* Navigation arrows */}
        {propertyImages.length > 1 && (
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
              ‹
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
              ›
            </button>
          </>
        )}

        {/* Fullscreen button */}
        <button
          onClick={() => setIsFullscreen(true)}
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
            fontSize: '12px'
          }}
        >
          🔍 Ampliar
        </button>

        {/* Image indicators */}
        {propertyImages.length > 1 && (
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '8px'
          }}>
            {propertyImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  border: 'none',
                  background: index === currentImageIndex ? 'white' : 'rgba(255,255,255,0.5)',
                  cursor: 'pointer'
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {propertyImages.length > 1 && (
        <div style={{
          display: 'flex',
          gap: '8px',
          marginTop: '12px',
          overflowX: 'auto',
          padding: '4px 0'
        }}>
          {propertyImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              style={{
                width: '80px',
                height: '60px',
                borderRadius: '6px',
                border: index === currentImageIndex ? '2px solid #059669' : '2px solid transparent',
                overflow: 'hidden',
                cursor: 'pointer',
                background: 'none',
                padding: 0
              }}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                color: 'white'
              }}>
                🏠
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const DetailsTab = () => (
    <div>
      {/* Price and Location */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        marginBottom: '24px'
      }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#059669' }}>💰 Preço</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#059669', margin: 0 }}>
            {formatPrice(price, currency)}
          </p>
          {purpose && (
            <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
              Para {purpose === 'sale' ? 'Venda' : 'Aluguel'}
            </p>
          )}
        </div>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#059669' }}>📍 Localização</h3>
          <p style={{ color: '#374151', fontSize: '16px' }}>{location}</p>
        </div>
      </div>

      {/* Property Details Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {area && (
          <div style={{
            textAlign: 'center',
            padding: '16px',
            background: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📐</div>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Área</p>
            <p style={{ fontWeight: '600', color: '#374151', margin: 0 }}>{area} {areaUnit}</p>
          </div>
        )}
        {rooms && (
          <div style={{
            textAlign: 'center',
            padding: '16px',
            background: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🛏️</div>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Quartos</p>
            <p style={{ fontWeight: '600', color: '#374151', margin: 0 }}>{rooms}</p>
          </div>
        )}
        {bathrooms && (
          <div style={{
            textAlign: 'center',
            padding: '16px',
            background: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🚿</div>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Banheiros</p>
            <p style={{ fontWeight: '600', color: '#374151', margin: 0 }}>{bathrooms}</p>
          </div>
        )}
        {parking && (
          <div style={{
            textAlign: 'center',
            padding: '16px',
            background: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🚗</div>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Vagas</p>
            <p style={{ fontWeight: '600', color: '#374151', margin: 0 }}>{parking}</p>
          </div>
        )}
      </div>

      {/* Description */}
      {description && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#059669' }}>📝 Descrição</h3>
          <p style={{ color: '#374151', lineHeight: '1.6' }}>{description}</p>
        </div>
      )}

      {/* Features */}
      {features && features.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#059669' }}>✨ Características</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '8px'
          }}>
            {features.map((feature, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#10b981', fontSize: '16px' }}>✓</span>
                <span style={{ color: '#374151' }}>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#059669' }}>🏷️ Tags</h3>
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
    </div>
  );

  const LocationTab = () => (
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#059669' }}>📍 Localização</h3>
      <div style={{
        width: '100%',
        height: '300px',
        background: '#f3f4f6',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px'
      }}>
        <div style={{ textAlign: 'center', color: '#6b7280' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>🗺️</div>
          <p>Mapa interativo em desenvolvimento</p>
          <p style={{ fontSize: '14px' }}>Localização: {location}</p>
        </div>
      </div>
      <div style={{
        padding: '16px',
        background: '#f9fafb',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <h4 style={{ fontWeight: '600', marginBottom: '8px' }}>Informações da Região</h4>
        <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
          Esta propriedade está localizada em {location}, uma região estratégica do Paraguay
          com fácil acesso a serviços e infraestrutura de qualidade.
        </p>
      </div>
    </div>
  );

  const ContactTab = () => (
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#059669' }}>👤 Informações de Contato</h3>

      {realtor && (
        <div style={{
          padding: '20px',
          background: '#f9fafb',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          marginBottom: '20px'
        }}>
          <h4 style={{ fontWeight: '600', marginBottom: '12px' }}>Corretor Responsável</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <p style={{ fontWeight: '500', marginBottom: '4px' }}>{realtor.name}</p>
              {realtor.email && (
                <p style={{ color: '#6b7280', marginBottom: '4px' }}>📧 {realtor.email}</p>
              )}
              {realtor.phone && (
                <p style={{ color: '#6b7280', marginBottom: '4px' }}>📱 {realtor.phone}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button
          onClick={handleWhatsAppContact}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: '#10b981',
            color: 'white',
            padding: '16px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600'
          }}
        >
          📱 Contatar via WhatsApp
        </button>

        <button
          onClick={() => {
            const email = 'contato@terrasparaguay.com';
            const subject = `Interesse - ${title}`;
            const body = `Olá!\n\nTenho interesse no imóvel:\n${title}\nPreço: ${formatPrice(price, currency)}\nLocalização: ${location}\n\nAguardo contato.\n\nObrigado!`;
            window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: '#3b82f6',
            color: 'white',
            padding: '16px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600'
          }}
        >
          📧 Enviar Email
        </button>

        <button
          onClick={() => {
            const phoneNumber = '+595971123456';
            window.open(`tel:${phoneNumber}`, '_blank');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: '#6b7280',
            color: 'white',
            padding: '16px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600'
          }}
        >
          📞 Ligar Agora
        </button>
      </div>
    </div>
  );

  // Fullscreen Image Modal
  const FullscreenModal = () => {
    if (!isFullscreen) return null;

    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <button
          onClick={() => setIsFullscreen(false)}
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
        <img
          src={propertyImages[currentImageIndex]}
          alt={`${title} - ${currentImageIndex + 1}`}
          style={{
            maxWidth: '90%',
            maxHeight: '90%',
            objectFit: 'contain'
          }}
        />
        {propertyImages.length > 1 && (
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
              ‹
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
              ›
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <>
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: '16px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          maxWidth: '1000px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header */}
          <div style={{
            padding: '20px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#374151', margin: 0 }}>{title}</h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#6b7280',
                padding: '4px'
              }}
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflow: 'auto' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px',
              padding: '20px'
            }}>
              {/* Left column - Images */}
              <div>
                <ImageGallery />
              </div>

              {/* Right column - Details */}
              <div>
                {/* Tabs */}
                <div style={{
                  display: 'flex',
                  borderBottom: '1px solid #e5e7eb',
                  marginBottom: '20px'
                }}>
                  {[
                    { id: 'details', label: '📋 Detalhes' },
                    { id: 'location', label: '📍 Localização' },
                    { id: 'contact', label: '📞 Contato' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      style={{
                        padding: '12px 16px',
                        border: 'none',
                        background: 'none',
                        borderBottom: activeTab === tab.id ? '2px solid #059669' : '2px solid transparent',
                        color: activeTab === tab.id ? '#059669' : '#6b7280',
                        cursor: 'pointer',
                        fontWeight: activeTab === tab.id ? '600' : '400',
                        fontSize: '14px'
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div style={{ minHeight: '300px' }}>
                  {activeTab === 'details' && <DetailsTab />}
                  {activeTab === 'location' && <LocationTab />}
                  {activeTab === 'contact' && <ContactTab />}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div style={{
            padding: '20px',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            gap: '12px'
          }}>
            <button
              onClick={handleWhatsAppContact}
              style={{
                flex: 1,
                background: '#10b981',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              📱 WhatsApp
            </button>
            <button
              onClick={onClose}
              style={{
                background: '#6b7280',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              Fechar
            </button>
          </div>
        </div>
      </div>

      <FullscreenModal />
    </>
  );
};

export default PropertyDetailsEnhanced;