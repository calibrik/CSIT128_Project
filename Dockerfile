FROM node:24-alpine
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 80
ENTRYPOINT ["node", "server.js"]