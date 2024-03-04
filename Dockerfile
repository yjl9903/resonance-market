FROM node:20.10.0

ENV NITRO_PORT=8080 NITRO_PRESET=node-server

EXPOSE 8080

WORKDIR /resonance-market

COPY . .

RUN npm i -g pnpm && pnpm install && pnpm build

CMD node .output/server/index.mjs
