ARG NODE_VERSION=22.18.0

# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine AS builder 

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Create image build for production

FROM node:${NODE_VERSION}-alpine


WORKDIR /build/todos-ui

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules/
COPY --from=builder /app/public ./public/
COPY --from=builder /app/.next ./.next/



EXPOSE 3000

CMD [ "npx","next","start" ]