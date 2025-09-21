import React, { useState, useEffect } from 'react';

const HeroGallery = ({ properties = [], onPropertyClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  console.log('🎯 HeroGallery - COMPONENT RENDERIZANDO!');
  console.log('🎯 HeroGallery - properties received:', properties);
  console.log('🎯 HeroGallery - properties length:', properties.length);

  // Filter to get featured properties (with or without images)
  const featuredProperties = properties
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 5);

  console.log('HeroGallery - featuredProperties:', featuredProperties);
  console.log('HeroGallery - featuredProperties length:', featuredProperties.length);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || featuredProperties.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredProperties.length);
    }, 6000); // Change image every 6 seconds

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
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '16px',
        padding: '24px',
        color: 'white',
        textAlign: 'center',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)'
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
      background: 'rgba(255,255,255,0.1)',
      borderRadius: '16px',
      overflow: 'hidden',
      position: 'relative',
      height: '400px',
      width: '100%',
      maxWidth: '300px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.2)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
    }}>
      {/* Main Image Container */}
      <div
        style={{
          position: 'relative',
          height: '250px',
          backgroundImage: currentProperty.images && currentProperty.images.length > 0
            ? `url(${currentProperty.images[0]})`
            : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClick={() => onPropertyClick && onPropertyClick(currentProperty)}
        onMouseEnter={() => setIsPlaying(false)}
        onMouseLeave={() => setIsPlaying(true)}
      >
        {/* Property Icon Placeholder */}
        {(!currentProperty.images || currentProperty.images.length === 0) && (
          <div style={{
            fontSize: '64px',
            color: 'white',
            textShadow: '0 4px 8px rgba(0,0,0,0.3)'
          }}>
            🏠
          </div>
        )}
        {/* Property Badge */}
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
          textTransform: 'uppercase',
          boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)'
        }}>
          ⭐ Destaque
        </div>

        {/* Property Type */}
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'rgba(5, 150, 105, 0.9)',
          color: 'white',
          padding: '6px 12px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '600',
          backdropFilter: 'blur(10px)'
        }}>
          {getTypeLabel(currentProperty.type)}
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
            width: '45px',
            height: '45px',
            cursor: 'pointer',
            fontSize: '24px',
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
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(0,0,0,0.6)';
            e.target.style.transform = 'translateY(-50%) scale(1)';
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
            width: '45px',
            height: '45px',
            cursor: 'pointer',
            fontSize: '24px',
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
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(0,0,0,0.6)';
            e.target.style.transform = 'translateY(-50%) scale(1)';
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
            bottom: '16px',
            right: '16px',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            border: '2px solid white',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(0,0,0,0.9)';
            e.target.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(0,0,0,0.7)';
            e.target.style.transform = 'scale(1)';
          }}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>

        {/* Property Info Overlay */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
          color: 'white',
          padding: '32px 20px 20px'
        }}>
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '8px',
            textShadow: '0 2px 4px rgba(0,0,0,0.7)'
          }}>
            {formatPrice(currentProperty.price, currentProperty.currency)}
          </div>

          <div style={{
            fontSize: '14px',
            opacity: 0.9,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            textShadow: '0 1px 2px rgba(0,0,0,0.7)'
          }}>
            📍 {currentProperty.location?.split(',')[0]}
          </div>
        </div>
      </div>

      {/* Thumbnails Section */}
      <div style={{
        padding: '20px',
        background: 'rgba(255,255,255,0.05)'
      }}>
        <h4 style={{
          color: 'white',
          margin: '0 0 12px 0',
          fontSize: '16px',
          fontWeight: '600',
          textAlign: 'center'
        }}>
          {currentProperty.title}
        </h4>

        {/* Property Features */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '16px',
          flexWrap: 'wrap'
        }}>
          {currentProperty.area && (
            <div style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: '500'
            }}>
              📐 {currentProperty.area}{currentProperty.areaUnit || 'm²'}
            </div>
          )}

          {currentProperty.rooms && (
            <div style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: '500'
            }}>
              🛏️ {currentProperty.rooms}
            </div>
          )}

          {currentProperty.bathrooms && (
            <div style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: '500'
            }}>
              🚿 {currentProperty.bathrooms}
            </div>
          )}
        </div>

        {/* Dots Navigation */}
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
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                border: 'none',
                background: index === currentIndex ? 'white' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: index === currentIndex ? '0 0 8px rgba(255,255,255,0.6)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (index !== currentIndex) {
                  e.target.style.background = 'rgba(255,255,255,0.8)';
                }
              }}
              onMouseLeave={(e) => {
                if (index !== currentIndex) {
                  e.target.style.background = 'rgba(255,255,255,0.5)';
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroGallery;