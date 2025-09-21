/**
 * Serviço de API para integração com backend multi-tenant
 * Tenant: Terras Paraguay
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const TENANT_SLUG = process.env.REACT_APP_TENANT_SLUG || 'terras-paraguay';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.tenantSlug = TENANT_SLUG;
    this.token = localStorage.getItem('auth_token');
  }

  // Headers padrão com tenant
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
      'X-Tenant-Slug': this.tenantSlug
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Método genérico para requests
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      headers: this.getHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // =====================
  // TENANT METHODS
  // =====================

  async getTenantConfig() {
    return this.request('/api/tenants/config');
  }

  async getTenantStats() {
    return this.request('/api/tenants/stats');
  }

  async updateTenantConfig(config) {
    return this.request('/api/tenants/config', {
      method: 'PUT',
      body: JSON.stringify(config)
    });
  }

  // =====================
  // PROPERTY METHODS
  // =====================

  async getProperties(filters = {}) {
    const queryParams = new URLSearchParams();

    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        queryParams.append(key, filters[key]);
      }
    });

    const endpoint = `/api/properties${queryParams.toString() ? `?${queryParams}` : ''}`;
    return this.request(endpoint);
  }

  async getProperty(id) {
    return this.request(`/api/properties/${id}`);
  }

  async createProperty(propertyData) {
    return this.request('/api/properties', {
      method: 'POST',
      body: JSON.stringify(propertyData)
    });
  }

  async updateProperty(id, propertyData) {
    return this.request(`/api/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(propertyData)
    });
  }

  async deleteProperty(id) {
    return this.request(`/api/properties/${id}`, {
      method: 'DELETE'
    });
  }

  async getPropertyStats() {
    return this.request('/api/properties/stats/summary');
  }

  // =====================
  // AUTH METHODS
  // =====================

  async login(email, password) {
    const response = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    if (response.token) {
      this.token = response.token;
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }

    return response;
  }

  async register(userData) {
    const data = {
      ...userData,
      tenant_slug: this.tenantSlug
    };

    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getProfile() {
    return this.request('/api/auth/me');
  }

  async updateProfile(profileData) {
    return this.request('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  async changePassword(currentPassword, newPassword) {
    return this.request('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword
      })
    });
  }

  logout() {
    this.token = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }

  // =====================
  // UTILITY METHODS
  // =====================

  isAuthenticated() {
    return !!this.token;
  }

  getStoredUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // =====================
  // PARAGUAY SPECIFIC
  // =====================

  // Formatação de preços multi-moeda
  formatPrice(price, currency = 'USD') {
    const formatters = {
      USD: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
      }),
      PYG: new Intl.NumberFormat('es-PY', {
        style: 'currency',
        currency: 'PYG',
        minimumFractionDigits: 0
      }),
      BRL: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0
      })
    };

    return formatters[currency]?.format(price) || `${currency} ${price}`;
  }

  // Conversão de moedas (taxas do tenant config)
  async convertCurrency(amount, fromCurrency, toCurrency) {
    const config = await this.getTenantConfig();
    const rates = config.business_config?.currencies_config?.exchange_rates || {};

    if (fromCurrency === toCurrency) return amount;

    const rateKey = `${fromCurrency}_${toCurrency}`;
    const reverseRateKey = `${toCurrency}_${fromCurrency}`;

    if (rates[rateKey]) {
      return amount * rates[rateKey];
    } else if (rates[reverseRateKey]) {
      return amount / rates[reverseRateKey];
    }

    // Fallback para taxas hardcoded
    const fallbackRates = {
      'USD_PYG': 7500,
      'USD_BRL': 5.2,
      'PYG_BRL': 0.00069
    };

    if (fallbackRates[rateKey]) {
      return amount * fallbackRates[rateKey];
    } else if (fallbackRates[reverseRateKey]) {
      return amount / fallbackRates[reverseRateKey];
    }

    return amount; // Sem conversão disponível
  }

  // Gerar link WhatsApp com mensagem customizada
  generateWhatsAppLink(propertyId, message = null) {
    const config = this.getStoredTenantConfig();
    const whatsappNumber = config?.contact_info?.whatsapp || process.env.REACT_APP_WHATSAPP_NUMBER;

    if (!whatsappNumber) return null;

    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    const defaultMessage = message || `Olá! Tenho interesse no imóvel ID: ${propertyId}. Poderia me dar mais informações?`;

    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(defaultMessage)}`;
  }

  // Cache local do tenant config
  cacheKey = 'tenant_config_cache';

  async getTenantConfigCached() {
    const cached = localStorage.getItem(this.cacheKey);
    const cacheTime = localStorage.getItem(`${this.cacheKey}_time`);

    // Cache válido por 1 hora
    if (cached && cacheTime && (Date.now() - parseInt(cacheTime)) < 3600000) {
      return JSON.parse(cached);
    }

    try {
      const config = await this.getTenantConfig();
      localStorage.setItem(this.cacheKey, JSON.stringify(config));
      localStorage.setItem(`${this.cacheKey}_time`, Date.now().toString());
      return config;
    } catch (error) {
      // Se falhar, retornar cache expirado se existir
      return cached ? JSON.parse(cached) : null;
    }
  }

  getStoredTenantConfig() {
    const cached = localStorage.getItem(this.cacheKey);
    return cached ? JSON.parse(cached) : null;
  }
}

// Instância singleton
const apiService = new ApiService();

export default apiService;