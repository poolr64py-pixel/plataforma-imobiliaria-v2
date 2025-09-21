/*
  Warnings:

  - You are about to drop the `Cliente` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Imovel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Lead` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Cliente";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Imovel";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Lead";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "tenants" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "dominio" TEXT NOT NULL,
    "subdominio" TEXT,
    "slug" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "idiomaPadrao" TEXT NOT NULL DEFAULT 'pt-BR',
    "moedaPadrao" TEXT NOT NULL DEFAULT 'BRL',
    "plano" TEXT NOT NULL DEFAULT 'BASICO',
    "configuracoes" TEXT,
    "logoUrl" TEXT,
    "faviconUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "tema_configs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "corPrimaria" TEXT NOT NULL DEFAULT '#3B82F6',
    "corSecundaria" TEXT NOT NULL DEFAULT '#64748B',
    "corDestaque" TEXT NOT NULL DEFAULT '#EF4444',
    "fontePrimaria" TEXT NOT NULL DEFAULT 'Inter',
    "logoClaro" TEXT,
    "logoEscuro" TEXT,
    "cssCustomizado" TEXT,
    "layoutInicial" TEXT NOT NULL DEFAULT 'grid',
    "mostrarPrecos" BOOLEAN NOT NULL DEFAULT true,
    "exibirWatermark" BOOLEAN NOT NULL DEFAULT true,
    "tenantId" TEXT NOT NULL,
    CONSTRAINT "tema_configs_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT,
    "foto" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "tenantId" TEXT NOT NULL,
    CONSTRAINT "usuarios_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "corretores" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "creci" TEXT,
    "especializacao" TEXT,
    "biografia" TEXT,
    "whatsapp" TEXT,
    "instagram" TEXT,
    "linkedin" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "usuarioId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "corretores_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "corretores_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "imoveis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "preco" REAL NOT NULL,
    "moeda" TEXT NOT NULL DEFAULT 'BRL',
    "tipo" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "codigoReferencia" TEXT,
    "slug" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DISPONIVEL',
    "destaque" BOOLEAN NOT NULL DEFAULT false,
    "urgente" BOOLEAN NOT NULL DEFAULT false,
    "visualizacoes" INTEGER NOT NULL DEFAULT 0,
    "dataPublicacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataVencimento" DATETIME,
    "tenantId" TEXT NOT NULL,
    "corretorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "imoveis_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "imoveis_corretorId_fkey" FOREIGN KEY ("corretorId") REFERENCES "corretores" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "enderecos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rua" TEXT NOT NULL,
    "numero" TEXT,
    "complemento" TEXT,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "pais" TEXT NOT NULL DEFAULT 'Brasil',
    "cep" TEXT,
    "coordenadas" TEXT,
    "regiao" TEXT,
    "proximidades" TEXT,
    "imovelId" TEXT NOT NULL,
    CONSTRAINT "enderecos_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "imoveis" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "caracteristicas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quartos" INTEGER NOT NULL DEFAULT 0,
    "suites" INTEGER NOT NULL DEFAULT 0,
    "banheiros" INTEGER NOT NULL DEFAULT 1,
    "areaTotal" REAL NOT NULL,
    "areaPrivativa" REAL,
    "areaConstruida" REAL,
    "vagas" INTEGER NOT NULL DEFAULT 0,
    "vagasCoberta" INTEGER NOT NULL DEFAULT 0,
    "amenidades" TEXT,
    "anoConstricao" INTEGER,
    "conservacao" TEXT,
    "mobiliado" TEXT,
    "iptu" REAL,
    "condominio" REAL,
    "aceitaAnimais" BOOLEAN NOT NULL DEFAULT false,
    "piscinaPrivada" BOOLEAN NOT NULL DEFAULT false,
    "jardimPrivado" BOOLEAN NOT NULL DEFAULT false,
    "imovelId" TEXT NOT NULL,
    CONSTRAINT "caracteristicas_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "imoveis" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "imagens" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "principal" BOOLEAN NOT NULL DEFAULT false,
    "imovelId" TEXT NOT NULL,
    CONSTRAINT "imagens_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "imoveis" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "videos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'youtube',
    "titulo" TEXT,
    "imovelId" TEXT NOT NULL,
    CONSTRAINT "videos_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "imoveis" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "seos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "keywords" TEXT,
    "canonicalURL" TEXT,
    "noIndex" BOOLEAN NOT NULL DEFAULT false,
    "imovelId" TEXT NOT NULL,
    CONSTRAINT "seos_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "imoveis" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "whatsapp" TEXT,
    "mensagem" TEXT,
    "interesse" TEXT NOT NULL,
    "origem" TEXT NOT NULL DEFAULT 'SITE',
    "status" TEXT NOT NULL DEFAULT 'NOVO',
    "valor" REAL,
    "tenantId" TEXT NOT NULL,
    "imovelId" TEXT,
    "corretorId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "leads_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "leads_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "imoveis" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "leads_corretorId_fkey" FOREIGN KEY ("corretorId") REFERENCES "corretores" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "tenants_dominio_key" ON "tenants"("dominio");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_subdominio_key" ON "tenants"("subdominio");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_slug_key" ON "tenants"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "tema_configs_tenantId_key" ON "tema_configs"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "corretores_usuarioId_key" ON "corretores"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "imoveis_codigoReferencia_key" ON "imoveis"("codigoReferencia");

-- CreateIndex
CREATE UNIQUE INDEX "imoveis_slug_key" ON "imoveis"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "enderecos_imovelId_key" ON "enderecos"("imovelId");

-- CreateIndex
CREATE UNIQUE INDEX "caracteristicas_imovelId_key" ON "caracteristicas"("imovelId");

-- CreateIndex
CREATE UNIQUE INDEX "seos_imovelId_key" ON "seos"("imovelId");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_email_key" ON "clientes"("email");
