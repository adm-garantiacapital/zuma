# Imagen base oficial de Node
FROM node:22

WORKDIR /app

COPY . .

RUN npm install && npm run build

# Usar "serve" para servir app
RUN npm install -g serve

EXPOSE 5174

CMD ["serve", "-s", "dist", "-l", "5174"]
