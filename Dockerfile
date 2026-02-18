# Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY prisma ./prisma/
RUN npx prisma generate

COPY . .
RUN npm run build

# Run
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm install prisma@6.1.0 --omit=dev --ignore-scripts

COPY prisma ./prisma/
RUN npx prisma generate

COPY --from=builder /app/dist ./dist

COPY docker-entrypoint.sh ./
RUN tr -d '\r' < docker-entrypoint.sh > docker-entrypoint.sh.tmp && mv docker-entrypoint.sh.tmp docker-entrypoint.sh && chmod +x docker-entrypoint.sh

EXPOSE 3000

CMD ["sh", "./docker-entrypoint.sh"]
