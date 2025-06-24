# Dockerfile
FROM node:22

WORKDIR /app

COPY . .

# Paso 1: definir build ARG
ARG VITE_API_URL

# Paso 2: exponerlo como env var
ENV VITE_API_URL=${VITE_API_URL}

RUN npm install
RUN npm run build

RUN npm install -g serve

EXPOSE 5174

CMD ["serve", "-s", "dist", "-l", "5174"]
