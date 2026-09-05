# RED VELVET — Producción Container
FROM node:20-alpine AS runner

WORKDIR /app

# Dependencias para compilar módulos nativos si son necesarios
RUN apk add --no-cache python3 make g++ vips-dev

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Crear directorios para persistencia de datos y fotos
RUN mkdir -p data uploads/models uploads/applications

EXPOSE 8000

ENV PORT=8000
ENV NODE_ENV=production

VOLUME ["/app/data", "/app/uploads"]

CMD ["node", "server/server.js"]
