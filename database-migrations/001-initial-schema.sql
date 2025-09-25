-- =====================================================
-- SCHEMA INICIAL - PLATAFORMA IMOBILIÁRIA MULTI-TENANT
-- =====================================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- Para coordenadas geográficas

-- =====================================================
-- TABELA: TENANTS (Clientes da plataforma)
-- =====================================================
CREATE TABLE tenants (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE NOT NULL,
    logo_url VARCHAR(500),
    primary_color VARCHAR(7) DEFAULT '#059669',
    secondary_color VARCHAR(7) DEFAULT '#047857',
    phone VARCHAR(50),
    email VARCHAR(255),
    whatsapp VARCHAR(50),
    address TEXT,
    currency VARCHAR(3) DEFAULT 'USD',
    language VARCHAR(5) DEFAULT 'pt',
    status VARCHAR(20) DEFAULT 'active', -- active, suspended, canceled
    plan VARCHAR(50) DEFAULT 'basic', -- basic, professional, enterprise
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    metadata JSONB -- Configurações customizadas
);

CREATE INDEX idx_tenants_domain ON tenants(domain);
CREATE INDEX idx_tenants_status ON tenants(status);

-- =====================================================
-- TABELA: PROPERTIES (Propriedades/Imóveis)
-- =====================================================
CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    tenant_id VARCHAR(100) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500),
    description TEXT,
    price DECIMAL(15,2),
    price_per_sqm DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Localização
    location VARCHAR(500),
    address TEXT,
    city VARCHAR(255),
    state VARCHAR(255),
    country VARCHAR(100) DEFAULT 'Paraguay',
    postal_code VARCHAR(20),
    coordinates GEOMETRY(Point, 4326), -- Lat/Long usando PostGIS
    neighborhood VARCHAR(255),
    
    -- Características
    area DECIMAL(10,2),
    area_unit VARCHAR(20) DEFAULT 'hectares', -- hectares, m², sqft
    bedrooms INTEGER,
    bathrooms INTEGER,
    parking_spaces INTEGER,
    floor INTEGER,
    total_floors INTEGER,
    
    -- Tipo e Status
    property_type VARCHAR(50) NOT NULL, -- farm, ranch, land, house, apartment, studio
    purpose VARCHAR(20) NOT NULL, -- sale, rent
    status VARCHAR(50) DEFAULT 'disponivel', -- disponivel, vendido, alugado, reservado
    
    -- Mídia
    images TEXT[], -- Array de URLs
    videos TEXT[], -- Array de URLs
    virtual_tour_url VARCHAR(500),
    floor_plan_url VARCHAR(500),
    
    -- Features
    features TEXT[], -- Array de características
    amenities TEXT[], -- Array de comodidades
    tags TEXT[], -- Array de tags
    
    -- SEO
    meta_title VARCHAR(255),
    meta_description TEXT,
    
    -- Métricas
    views INTEGER DEFAULT 0,
    favorites INTEGER DEFAULT 0,
    inquiries INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    
    -- Datas
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    published_at TIMESTAMP,
    sold_at TIMESTAMP,
    
    -- Dados adicionais
    metadata JSONB -- Campos customizados por tenant
);

CREATE INDEX idx_properties_tenant ON properties(tenant_id);
CREATE INDEX idx_properties_type ON properties(property_type);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_created ON properties(created_at DESC);
CREATE INDEX idx_properties_slug ON properties(slug);
CREATE INDEX idx_properties_location ON properties USING GIST(coordinates); -- Índice espacial

-- =====================================================
-- TABELA: ADMIN_USERS (Usuários admin de cada tenant)
-- =====================================================
CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    tenant_id VARCHAR(100) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'admin', -- admin, manager, realtor, viewer
    phone VARCHAR(50),
    avatar_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'active', -- active, inactive, suspended
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    metadata JSONB
);

CREATE INDEX idx_admin_users_tenant ON admin_users(tenant_id);
CREATE INDEX idx_admin_users_email ON admin_users(email);

-- =====================================================
-- TABELA: LEADS (Leads/Contatos)
-- =====================================================
CREATE TABLE leads (
    id SERIAL PRIMARY KEY,
    tenant_id VARCHAR(100) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    property_id INTEGER REFERENCES properties(id) ON DELETE SET NULL,
    
    -- Dados do lead
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    message TEXT,
    
    -- Origem
    source VARCHAR(100), -- website, whatsapp, facebook, google
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    
    -- Status
    status VARCHAR(50) DEFAULT 'new', -- new, contacted, qualified, converted, lost
    priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high
    
    -- Atribuição
    assigned_to INTEGER REFERENCES admin_users(id),
    
    -- Datas
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    contacted_at TIMESTAMP,
    converted_at TIMESTAMP,
    
    metadata JSONB
);

CREATE INDEX idx_leads_tenant ON leads(tenant_id);
CREATE INDEX idx_leads_property ON leads(property_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created ON leads(created_at DESC);

-- =====================================================
-- TABELA: FAVORITES (Favoritos dos usuários)
-- =====================================================
CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    tenant_id VARCHAR(100) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    user_session VARCHAR(255), -- Session ID ou user ID
    ip_address INET,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_favorites_tenant ON favorites(tenant_id);
CREATE INDEX idx_favorites_property ON favorites(property_id);
CREATE INDEX idx_favorites_session ON favorites(user_session);

-- =====================================================
-- TABELA: ANALYTICS_EVENTS (Eventos de analytics)
-- =====================================================
CREATE TABLE analytics_events (
    id SERIAL PRIMARY KEY,
    tenant_id VARCHAR(100) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    property_id INTEGER REFERENCES properties(id) ON DELETE SET NULL,
    
    event_type VARCHAR(100) NOT NULL, -- page_view, property_view, contact_click, etc
    user_session VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    
    event_data JSONB, -- Dados adicionais do evento
    
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_analytics_tenant ON analytics_events(tenant_id);
CREATE INDEX idx_analytics_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_created ON analytics_events(created_at DESC);

-- =====================================================
-- TABELA: BLOG_POSTS (Artigos do blog integrado)
-- =====================================================
CREATE TABLE blog_posts (
    id SERIAL PRIMARY KEY,
    tenant_id VARCHAR(100) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) NOT NULL,
    excerpt TEXT,
    content TEXT,
    
    author_id INTEGER REFERENCES admin_users(id),
    category VARCHAR(100),
    tags TEXT[],
    
    -- SEO
    meta_title VARCHAR(255),
    meta_description TEXT,
    featured_image VARCHAR(500),
    og_image VARCHAR(500),
    
    -- Status
    status VARCHAR(20) DEFAULT 'draft', -- draft, published, archived
    
    -- Métricas
    views INTEGER DEFAULT 0,
    
    -- Datas
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    published_at TIMESTAMP,
    
    metadata JSONB
);

CREATE INDEX idx_blog_tenant ON blog_posts(tenant_id);
CREATE INDEX idx_blog_slug ON blog_posts(slug);
CREATE INDEX idx_blog_status ON blog_posts(status);
CREATE INDEX idx_blog_published ON blog_posts(published_at DESC);

-- =====================================================
-- TABELA: SUBSCRIPTIONS (Assinaturas de newsletter)
-- =====================================================
CREATE TABLE subscriptions (
    id SERIAL PRIMARY KEY,
    tenant_id VARCHAR(100) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active', -- active, unsubscribed
    source VARCHAR(100), -- blog, property_page, popup, etc
    created_at TIMESTAMP DEFAULT NOW(),
    unsubscribed_at TIMESTAMP,
    UNIQUE(tenant_id, email)
);

CREATE INDEX idx_subscriptions_tenant ON subscriptions(tenant_id);
CREATE INDEX idx_subscriptions_email ON subscriptions(email);

-- =====================================================
-- FUNCTIONS E TRIGGERS
-- =====================================================

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger em todas as tabelas relevantes
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DADOS INICIAIS (SEED)
-- =====================================================

-- Inserir tenant padrão (Terras Paraguay)
INSERT INTO tenants (id, name, domain, primary_color, secondary_color, phone, email, whatsapp, currency, status, plan)
VALUES (
    'terras-paraguay',
    'Terras no Paraguay',
    'terrasnoparaguay.com',
    '#059669',
    '#047857',
    '+595 994 718400',
    'contato@terrasnoparaguay.com',
    '+595994718400',
    'USD',
    'active',
    'enterprise'
);

-- Inserir usuário admin padrão
-- Senha: admin123 (hash bcrypt)
INSERT INTO admin_users (tenant_id, email, password_hash, name, role)
VALUES (
    'terras-paraguay',
    'admin@terrasnoparaguay.com',
    '$2b$10$rKvVPx8X8vP3qK5Z5n5Z5uYyK5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', -- Trocar por hash real
    'Admin Terras Paraguay',
    'admin'
);

-- =====================================================
-- VIEWS ÚTEIS
-- =====================================================

-- View de propriedades com dados do tenant
CREATE VIEW properties_with_tenant AS
SELECT 
    p.*,
    t.name as tenant_name,
    t.domain as tenant_domain,
    t.phone as tenant_phone,
    t.email as tenant_email
FROM properties p
JOIN tenants t ON p.tenant_id = t.id;

-- View de estatísticas por tenant
CREATE VIEW tenant_stats AS
SELECT 
    t.id as tenant_id,
    t.name as tenant_name,
    COUNT(DISTINCT p.id) as total_properties,
    COUNT(DISTINCT CASE WHEN p.status = 'disponivel' THEN p.id END) as available_properties,
    COUNT(DISTINCT l.id) as total_leads,
    COUNT(DISTINCT l.id) FILTER (WHERE l.created_at > NOW() - INTERVAL '30 days') as leads_last_30_days
FROM tenants t
LEFT JOIN properties p ON t.id = p.tenant_id
LEFT JOIN leads l ON t.id = l.tenant_id
GROUP BY t.id, t.name;

-- =====================================================
-- COMENTÁRIOS PARA DOCUMENTAÇÃO
-- =====================================================

COMMENT ON TABLE tenants IS 'Clientes da plataforma white label';
COMMENT ON TABLE properties IS 'Propriedades/imóveis listados na plataforma';
COMMENT ON TABLE admin_users IS 'Usuários administrativos de cada tenant';
COMMENT ON TABLE leads IS 'Leads/contatos gerados pela plataforma';
COMMENT ON TABLE analytics_events IS 'Eventos de analytics e tracking';
COMMENT ON TABLE blog_posts IS 'Artigos do blog integrado para SEO';

-- =====================================================
-- FIM DO SCHEMA
-- =====================================================