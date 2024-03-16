# Node.js 21 sürümüne dayalı temel imaj
FROM node:21

# Çalışma dizinini /app olarak ayarla
WORKDIR /app

# package.json ve package-lock.json dosyalarını /app dizinine kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm install

# Uygulama kodunu /app dizinine kopyala
COPY . .

# Uygulamayı başlatmak için npm start komutunu kullan
CMD ["npm", "start"]
