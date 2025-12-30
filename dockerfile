FROM node:20

WORKDIR /app

RUN npm install -g npm@11.7.0

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "run", "preview"]
