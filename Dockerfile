ARG NODE_VERSION=22.18.0
ARG NEXT_PUBLIC_REQUEST_BASE_QUERY_DEV
ARG NEXT_PUBLIC_REQUEST_BASE_QUERY_PROD

# Build Stage
# Use node image for base image for all stages.

FROM node:${NODE_VERSION}-alpine AS builder 

WORKDIR /app

COPY package*.json ./

# Env
ENV HOST=0.0.0.0
ENV NEXT_PUBLIC_REQUEST_BASE_QUERY_DEV=http://localhost:3000/api
ENV NEXT_PUBLIC_REQUEST_BASE_QUERY_PROD=http://3.0.97.40/api

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