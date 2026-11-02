#!/bin/bash
# ==============================================================================
# SCRIPT DE DEPLOY E ATUALIZAÇÃO AUTOMÁTICA — DOM ROCKFELLER
# Uso no VPS: bash deploy.sh
# ==============================================================================

set -e

echo "🚀 Iniciando Deploy da Plataforma Dom RockFeller..."

# 1. Obter últimas atualizações do repositório Git
if [ -d ".git" ]; then
  echo "📥 Puxando código mais recente..."
  git pull origin main || git pull origin master
fi

# 2. Instalar dependências
echo "📦 Instalando dependências do Node.js..."
npm ci --legacy-peer-deps

# 3. Gerar build de produção do frontend
echo "🔨 Compilando frontend React para produção..."
npm run build

# 4. Executar suíte de testes de segurança
echo "🛡️ Executando testes automatizados de segurança..."
npm test

# 5. Criar diretório de logs se não existir
mkdir -p logs

# 6. Reiniciar processo com PM2
echo "🔄 Reiniciando serviço no PM2..."
if command -v pm2 &> /dev/null; then
  pm2 reload ecosystem.config.cjs --env production || pm2 start ecosystem.config.cjs --env production
  pm2 save
  echo "✅ Aplicação reiniciada com sucesso no PM2!"
else
  echo "⚠️ PM2 não detectado globalmente. Instalando PM2..."
  sudo npm install -g pm2
  pm2 start ecosystem.config.cjs --env production
  pm2 save
fi

echo "=========================================================="
echo "🎉 DEPLOY CONCLUÍDO COM SUCESSO!"
echo "🌐 Site rodando localmente na porta 3001 e integrado ao Nginx!"
echo "=========================================================="
