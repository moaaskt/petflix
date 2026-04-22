FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Porta padrão do Vite é 5173
EXPOSE 5173

# O "--host" é essencial para o Docker conseguir repassar a porta
CMD ["npm", "run", "dev", "--", "--host"]