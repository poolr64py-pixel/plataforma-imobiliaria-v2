import React, { useState } from 'react';

const ImageUpload = ({ images = [], onImagesUpdate }) => {
  const [uploading, setUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState(images);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);

    try {
      // Simular upload - em produção, usar serviço real (Cloudinary, AWS S3, etc)
      const uploadedUrls = await Promise.all(
        files.map(async (file) => {
          // Converter para base64 ou usar serviço de upload
          const reader = new FileReader();
          return new Promise((resolve) => {
            reader.onloadend = () => {
              resolve(reader.result);
            };
            reader.readAsDataURL(file);
          });
        })
      );

      const newImages = [...imageUrls, ...uploadedUrls];
      setImageUrls(newImages);
      onImagesUpdate(newImages);
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao fazer upload das imagens');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlAdd = () => {
    const url = prompt('Cole a URL da imagem:');
    if (url) {
      const newImages = [...imageUrls, url];
      setImageUrls(newImages);
      onImagesUpdate(newImages);
    }
  };

  const handleRemove = (index) => {
    const newImages = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newImages);
    onImagesUpdate(newImages);
  };

  const moveImage = (index, direction) => {
    const newImages = [...imageUrls];
    const newIndex = index + direction;
    
    if (newIndex < 0 || newIndex >= newImages.length) return;
    
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    setImageUrls(newImages);
    onImagesUpdate(newImages);
  };

  return (
    <div>
      {/* Upload Buttons */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        <label style={{
          background: '#059669',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          display: 'inline-block'
        }}>
          {uploading ? 'Fazendo upload...' : '📁 Escolher Arquivos'}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            style={{ display: 'none' }}
          />
        </label>

        <button
          type="button"
          onClick={handleUrlAdd}
          style={{
            background: '#3b82f6',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          🔗 Adicionar por URL
        </button>
      </div>

      {/* Image Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '16px'
      }}>
        {imageUrls.map((url, index) => (
          <div
            key={index}
            style={{
              position: 'relative',
              aspectRatio: '1',
              borderRadius: '8px',
              overflow: 'hidden',
              border: '2px solid #e5e7eb'
            }}
          >
            {/* Image */}
            <img
              src={url}
              alt={`Preview ${index + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />

            {/* Overlay com controles */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              opacity: 0,
              transition: 'opacity 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
            onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
            >
              {/* Move Left */}
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => moveImage(index, -1)}
                  style={{
                    background: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    width: '32px',
                    height: '32px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  ←
                </button>
              )}

              {/* Remove */}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                style={{
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                ×
              </button>

              {/* Move Right */}
              {index < imageUrls.length - 1 && (
                <button
                  type="button"
                  onClick={() => moveImage(index, 1)}
                  style={{
                    background: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    width: '32px',
                    height: '32px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  →
                </button>
              )}
            </div>

            {/* Badge de posição */}
            <div style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              {index + 1}
            </div>

            {/* Badge Principal */}
            {index === 0 && (
              <div style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                background: '#059669',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: '600'
              }}>
                PRINCIPAL
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {imageUrls.length === 0 && (
        <div style={{
          border: '2px dashed #d1d5db',
          borderRadius: '8px',
          padding: '40px',
          textAlign: 'center',
          color: '#6b7280'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📷</div>
          <p style={{ margin: 0, fontSize: '14px' }}>
            Nenhuma imagem adicionada. Clique em "Escolher Arquivos" ou "Adicionar por URL"
          </p>
        </div>
      )}

      {/* Info */}
      {imageUrls.length > 0 && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          background: '#f0f9ff',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#1e40af'
        }}>
          💡 A primeira imagem será usada como capa. Use as setas para reordenar.
        </div>
      )}
    </div>
  );
};

export default ImageUpload;