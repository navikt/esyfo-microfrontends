FROM cgr.dev/chainguard/node:24

WORKDIR /usr/src/app

COPY ./microfrontends/aktivitetskrav/dist ./dist
COPY ./node_modules ./node_modules

ENV HOST=0.0.0.0
ENV PORT=3000

CMD ["./dist/server/entry.mjs"]

EXPOSE $PORT
