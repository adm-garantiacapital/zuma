FROM nginx:alpine

# Copiar los archivos compilados de dist/ a nginx
COPY dist/ /usr/share/nginx/html/

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]