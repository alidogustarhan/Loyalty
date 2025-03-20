# Temel image olarak node'yi kullanıyoruz
FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Çevresel değişkenler
ENV PORT=3001
ENV NODE_ENV=production
ENV JWT_SECRET=$2y$10$O6qAABmxadaLPtJDmSVfxeEPnYDPuxz33zICnuzdl5euBjcQjYlQG
ENV MONGO_URI=mongodb+srv://alitarhan:pinaronline@pinaronline.ajfrb.mongodb.net/?retryWrites=true&w=majority&appName=Pinaronline

EXPOSE 3001

CMD ["npm", "start"]
