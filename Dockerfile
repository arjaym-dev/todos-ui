ARG NODE_VERSION=22.18.0

# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine

ENV HOST=0.0.0.0

# Set working directory for all build stages.
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "dev" ]