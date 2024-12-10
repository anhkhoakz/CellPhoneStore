FROM node:20-bullseye-slim
# FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json /app
COPY pnpm-lock.yaml /app

RUN pnpm install

COPY . .

# ENV NODE_ENV=production
ENV MONGO_URI=mongodb://mongo:27017/midtermNodejs
ENV REDIS_HOST=redis
ENV REDIS_PORT=6379

EXPOSE 8080

CMD ["pnpm", "run", "start"]
