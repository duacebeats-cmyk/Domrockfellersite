# ==============================================================================
# DOCKERFILE — DOM ROCKFELLER & ROCKFELLER CARROS (MULTI-STAGE PRODUCTION BUILD)
# ==============================================================================

# Estágio 1: Build do Frontend React
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Estágio 2: Runner de Produção
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

COPY package*.json ./
RUN npm ci --only=production

# Copia código do backend e build compilado do frontend
COPY server ./server
COPY public ./public
COPY --from=builder /app/dist ./dist

# Cria diretório de dados persistentes para SQLite/JSON
RUN mkdir -p /app/server/data

EXPOSE 3001

CMD ["node", "server/index.js"]
