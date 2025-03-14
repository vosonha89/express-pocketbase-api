FROM node:22-bullseye as builder
# ENV development | uat | development.local | production
ARG ENV=
RUN echo "Environment to build is $ENV"

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm ci

COPY . .
RUN npm run build

# Docker image for run
FROM node:22-slim
ARG ENV=
ENV NODE_ENV production
USER node
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
COPY package*.json ./
RUN npm ci --production
COPY --from=builder /usr/src/app/.env.${ENV} .env
COPY --from=builder /usr/src/app/build ./dist

EXPOSE 8080
CMD [ "node", "dist/index.js" ]