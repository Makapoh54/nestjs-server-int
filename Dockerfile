FROM node:22-alpine as builder

USER node

RUN mkdir /home/node/app

COPY --chown=node:node package*.json /home/node/app/

WORKDIR /home/node/app

RUN npm ci

COPY --chown=node:node . /home/node/app/

RUN npm run build \
  && npm prune --production

FROM node:22-alpine as baseImage

ENV NODE_ENV production

COPY --from=builder /home/node/app/package*.json /home/node/app/
COPY --from=builder /home/node/app/node_modules/ /home/node/app/node_modules/
COPY --from=builder /home/node/app/dist/ /home/node/app/dist/
COPY --from=builder /home/node/app/src/ /home/node/app/src/

WORKDIR /home/node/app
RUN mkdir -p /www/default/

COPY ./.env.dev /home/node/app/.env

CMD ["node", "dist/main"]