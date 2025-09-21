import React, { useState, useEffect } from 'react';

const PropertyGallery = ({ properties = [], onPropertyClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Filter to get best properties with images
  const featuredProperties = properties
    .filter(p => p.images && p.images.length > 0)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 6);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || featuredProperties.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredProperties.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [isPlaying, featuredProperties.length]);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredProperties.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredProperties.length) % featuredProperties.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const formatPrice = (price, currency = 'USD') => {
    if (!price) return 'Consultar preço';
    return `${currency} ${price.toLocaleString()}`;
  };

  const getTypeLabel = (type) => {
    const types = {
      'house': '🏡 Casa',
      'apartment': '🏢 Apartamento',
      'farm': '🌾 Fazenda',
      'ranch': '🐄 Estância',
      'land': '🌍 Terreno'
    };
    return types[type] || type;
  };

  if (featuredProperties.length === 0) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
        borderRadius: '16px',
        padding: '24px',
        color: 'white',
        textAlign: 'center',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏠</div>
          <div style={{ fontSize: '18px', fontWeight: '600' }}>Carregando Propriedades...</div>
        </div>
      </div>
    );
  }

  const currentProperty = featuredProperties[currentIndex];

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
      position: 'relative',
      height: '500px'
    }}>
      {/* Main Image Container */}
      <div
        style={{
          position: 'relative',
          height: '300px',
          backgroundImage: `url(${currentProperty.images[0]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          cursor: 'pointer'
        }}
        onClick={() => onPropertyClick && onPropertyClick(currentProperty)}
        onMouseEnter={() => setIsPlaying(false)}
        onMouseLeave={() => setIsPlaying(true)}
      >
        {/* Overlay with Property Info */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
          color: 'white',
          padding: '24px 20px 16px'
        }}>
          <div style={{
            background: 'rgba(5, 150, 105, 0.9)',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '600',
            display: 'inline-block',
            marginBottom: '8px'
          }}>
            {getTypeLabel(currentProperty.type)}
          </div>

          <div style={{
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: '4px',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)'
          }}>
            {formatPrice(currentProperty.price, currentProperty.currency)}
          </div>

          <div style={{
            fontSize: '14px',
            opacity: 0.9,
            textShadow: '0 1px 2px rgba(0,0,0,0.5)'
          }}>
            📍 {currentProperty.location?.split(',')[0]}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            prevImage();
          }}
          style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(0,0,0,0.6)',
            color: 'white',
            border: '2px solid rgba(255,255,255,0.8)',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            cursor: 'pointer',
            fontSize: '30px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(0,0,0,0.8)';
            e.target.style.transform = 'translateY(-50%) scale(1.1)';
            e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(0,0,0,0.6)';
            e.target.style.transform = 'translateY(-50%) scale(1)';
            e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
          }}
        >
          ←
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            nextImage();
          }}
          style={{
            position: 'absolute',
            right: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(0,0,0,0.6)',
            color: 'white',
            border: '2px solid rgba(255,255,255,0.8)',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            cursor: 'pointer',
            fontSize: '30px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(0,0,0,0.8)';
            e.target.style.transform = 'translateY(-50%) scale(1.1)';
            e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(0,0,0,0.6)';
            e.target.style.transform = 'translateY(-50%) scale(1)';
            e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
          }}
        >
          →
        </button>

        {/* Play/Pause Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsPlaying(!isPlaying);
          }}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            border: '2px solid white',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(0,0,0,0.9)';
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(0,0,0,0.7)';
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
          }}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>
      </div>

      {/* Property Details */}
      <div style={{ padding: '20px' }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          marginBottom: '12px',
          color: '#374151',
          lineHeight: '1.3'
        }}>
          {currentProperty.title}
        </h3>

        {/* Property Features */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '16px'
        }}>
          {currentProperty.area && (
            <div style={{
              background: '#f0fdf4',
              color: '#059669',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              📐 {currentProperty.area}{currentProperty.areaUnit || 'm²'}
            </div>
          )}

          {currentProperty.rooms && (
            <div style={{
              background: '#f0fdf4',
              color: '#059669',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              🛏️ {currentProperty.rooms}
            </div>
          )}

          {currentProperty.bathrooms && (
            <div style={{
              background: '#f0fdf4',
              color: '#059669',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              🚿 {currentProperty.bathrooms}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        <div style={{
          display: 'flex',
          gap: '8px',
          justifyContent: 'center'
        }}>
          {featuredProperties.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                border: 'none',
                background: index === currentIndex ? '#059669' : '#d1d5db',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyGallery;