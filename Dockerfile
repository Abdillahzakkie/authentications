FROM node:22.8.0 AS build_01
LABEL maintainer="zakariyyaopeyemi@gmail.com"
ENV NODE_ENV production
RUN yarn global add typescript rimraf@5.0.7
COPY package.json yarn.lock /
RUN yarn install --silent --production=true --ignore-engines
COPY . .
RUN yarn run build
CMD exec yarn run start