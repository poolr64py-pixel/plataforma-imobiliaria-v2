// templates.js - 3 Templates Visuais para Multi-tenant

export const TEMPLATES = {
  // TEMPLATE 1: MODERNO/MINIMALISTA
  modern: {
    id: 'modern',
    name: 'Moderno',
    description: 'Design clean e minimalista, ideal para imobiliárias urbanas',
    
    layout: {
      headerStyle: 'fixed',
      heroType: 'fullscreen-gradient', // hero com gradiente full
      cardStyle: 'elevated', // cards com sombra elevada
      gridColumns: 3, // 3 colunas no desktop
      spacing: 'wide', // espaçamento generoso
      borderRadius: '12px'
    },
    
    typography: {
      headingFont: 'Inter, sans-serif',
      bodyFont: 'Inter, sans-serif',
      headingWeight: 700,
      bodyWeight: 400
    },
    
    components: {
      propertyCard: {
        imageHeight: '240px',
        showBadges: true,
        badgePosition: 'top-left',
        hoverEffect: 'lift', // levanta no hover
        pricePosition: 'bottom',
        ctaStyle: 'solid'
      },
      
      hero: {
        height: '600px',
        overlayOpacity: 0.3,
        contentAlign: 'center',
        showSearchBar: true,
        searchBarStyle: 'prominent'
      },
      
      filters: {
        style: 'pills', // filtros em formato de pills
        position: 'sticky',
        layout: 'horizontal'
      }
    },
    
    colors: {
      // Cliente define estas cores
      primary: '{{tenant_primary}}',
      secondary: '{{tenant_secondary}}',
      
      // Predefinidas do template
      background: '#FFFFFF',
      surface: '#F9FAFB',
      text: '#1F2937',
      textLight: '#6B7280',
      border: '#E5E7EB'
    }
  },

  // TEMPLATE 2: CLÁSSICO/ELEGANTE
  classic: {
    id: 'classic',
    name: 'Clássico',
    description: 'Sofisticado e tradicional, perfeito para imóveis premium',
    
    layout: {
      headerStyle: 'transparent-sticky',
      heroType: 'split-content', // hero dividido (imagem + texto)
      cardStyle: 'bordered', // cards com borda
      gridColumns: 2, // 2 colunas grandes
      spacing: 'comfortable',
      borderRadius: '8px'
    },
    
    typography: {
      headingFont: 'Playfair Display, serif',
      bodyFont: 'Lato, sans-serif',
      headingWeight: 600,
      bodyWeight: 400
    },
    
    components: {
      propertyCard: {
        imageHeight: '320px',
        showBadges: true,
        badgePosition: 'top-right',
        hoverEffect: 'zoom-image', // zoom só na imagem
        pricePosition: 'top',
        ctaStyle: 'outlined'
      },
      
      hero: {
        height: '500px',
        overlayOpacity: 0.5,
        contentAlign: 'left',
        showSearchBar: true,
        searchBarStyle: 'inline'
      },
      
      filters: {
        style: 'dropdown', // filtros em dropdowns
        position: 'below-hero',
        layout: 'horizontal'
      }
    },
    
    colors: {
      primary: '{{tenant_primary}}',
      secondary: '{{tenant_secondary}}',
      
      background: '#FAFAFA',
      surface: '#FFFFFF',
      text: '#2C2C2C',
      textLight: '#757575',
      border: '#DEDEDE',
      accent: '#D4AF37' // dourado para detalhes
    }
  },

  // TEMPLATE 3: DINÂMICO/JOVEM
  dynamic: {
    id: 'dynamic',
    name: 'Dinâmico',
    description: 'Vibrante e moderno, para imobiliárias inovadoras',
    
    layout: {
      headerStyle: 'solid',
      heroType: 'carousel', // carousel de imagens
      cardStyle: 'flat-colored', // cards com background colorido
      gridColumns: 4, // 4 colunas compactas
      spacing: 'compact',
      borderRadius: '16px'
    },
    
    typography: {
      headingFont: 'Poppins, sans-serif',
      bodyFont: 'Poppins, sans-serif',
      headingWeight: 700,
      bodyWeight: 400
    },
    
    components: {
      propertyCard: {
        imageHeight: '200px',
        showBadges: true,
        badgePosition: 'bottom-left',
        hoverEffect: 'scale', // escala todo o card
        pricePosition: 'overlay', // preço sobre a imagem
        ctaStyle: 'ghost'
      },
      
      hero: {
        height: '700px',
        overlayOpacity: 0.4,
        contentAlign: 'center',
        showSearchBar: true,
        searchBarStyle: 'floating'
      },
      
      filters: {
        style: 'chips', // filtros em chips coloridos
        position: 'floating',
        layout: 'vertical-sidebar'
      }
    },
    
    colors: {
      primary: '{{tenant_primary}}',
      secondary: '{{tenant_secondary}}',
      
      background: '#F8F9FA',
      surface: '#FFFFFF',
      text: '#212529',
      textLight: '#6C757D',
      border: '#DEE2E6',
      gradientStart: '{{tenant_primary}}',
      gradientEnd: '{{tenant_secondary}}'
    }
  }
};

// Função para aplicar template ao tenant
export function applyTemplate(tenantConfig) {
  const template = TEMPLATES[tenantConfig.template || 'modern'];
  
  return {
    ...template,
    colors: {
      ...template.colors,
      primary: tenantConfig.primaryColor,
      secondary: tenantConfig.secondaryColor,
      gradientStart: tenantConfig.primaryColor,
      gradientEnd: tenantConfig.secondaryColor
    }
  };
}

// Exemplo de uso no tenantConfig.js
export const tenantConfigurations = {
  'terrasnoparaguay.com': {
    id: 'terras-paraguay',
    name: 'Terras no Paraguay',
    template: 'modern', // <-- escolhe o template
    primaryColor: '#059669',
    secondaryColor: '#047857',
    phone: '+595 994 718400',
    email: 'contato@terrasnoparaguay.com',
    whatsapp: '+595994718400'
  },
  
  'cliente2.com': {
    id: 'cliente2',
    name: 'Cliente 2 Imóveis',
    template: 'classic', // <-- template diferente
    primaryColor: '#1e40af',
    secondaryColor: '#1e3a8a',
    phone: '+5511999999999',
    email: 'contato@cliente2.com',
    whatsapp: '+5511999999999'
  },
  
  'cliente3.com': {
    id: 'cliente3',
    name: 'Cliente 3 Properties',
    template: 'dynamic', // <-- outro template
    primaryColor: '#dc2626',
    secondaryColor: '#991b1b',
    phone: '+5521988888888',
    email: 'contato@cliente3.com',
    whatsapp: '+5521988888888'
  }
};

export default TEMPLATES;