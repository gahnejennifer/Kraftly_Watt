# mock-api/Dockerfile
# Kör bara Express-mock-API:t – inget byggsteg, ingen nginx.
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts
COPY mock-api ./mock-api
EXPOSE 4000
CMD ["node", "mock-api/server.js"]