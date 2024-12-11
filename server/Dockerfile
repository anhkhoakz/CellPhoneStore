# FROM node:20-bullseye-slim
FROM node:20-bullseye-slim@sha256:d53d277d135f4b383cab9ae0b268447325f08b1216f62d6ce0f46ae005d47192
# FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json /app
COPY pnpm-lock.yaml /app

RUN pnpm install

COPY . /app

COPY . .



# ENV NODE_ENV=production
ENV DB_URL=mongodb://mongo:27017/CellPhoneStore
ENV REDIS_HOST=redis
ENV REDIS_PORT=6379

EXPOSE 8080

CMD ["pnpm", "run", "start"]
