# RED VELVET — Producción Container
FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Instalar dependencias usando binarios precompilados de sharp y sqlite3
COPY package*.json ./
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Directorios de datos y uploads
RUN mkdir -p data uploads/products

EXPOSE 8080

CMD ["node", "server/server.js"]
