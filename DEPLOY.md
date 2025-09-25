\# Deploy Hetzner - Guia Rápido



\## Servidor Hetzner



1\. Criar VPS Ubuntu 22.04

2\. Conectar via SSH

3\. Instalar Node.js 18+, PostgreSQL 14+, Nginx



\## Backend

```bash

git clone <repo>

cd backend

npm install

cp .env.example .env

\# Configurar DATABASE\_URL

npm start

