FROM node:24-alpine
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 80
CMD node PrepareDB.js && node server.js