FROM node:18-alpine

WORKDIR /app

# Thêm các dependencies cần thiết để build sqlite3
RUN apk add --no-cache python3 make g++ gcc

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"] 