# Stage 1: build the React/Vite frontend
FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: production image — Express + built assets only
FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --omit=dev
COPY server.js .
COPY server/ ./server/
COPY public/ ./public/
COPY --from=builder /usr/src/app/dist ./dist

ENV PORT=2200
EXPOSE 2200
CMD ["node", "server.js"]
