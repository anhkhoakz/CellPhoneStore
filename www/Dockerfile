FROM node:20-bullseye-slim@sha256:d53d277d135f4b383cab9ae0b268447325f08b1216f62d6ce0f46ae005d47192 AS development
# FROM node:20-alpine AS development

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

EXPOSE 3000

RUN pnpm build

CMD ["pnpm", "start"]
