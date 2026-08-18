FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim AS sanitized-node-modules

WORKDIR /usr/src/app

COPY ./node_modules ./node_modules
COPY ./scripts/sanitize-node-modules.mjs ./scripts/sanitize-node-modules.mjs

# Remove build-only esbuild/lefthook binaries from the runtime image to mitigate
# CVE-2026-39821 in Go stdlib idna; can be removed when upstream ships Go >= 1.26.6
# or the runtime packaging is cleaned up structurally.
RUN ["node", "./scripts/sanitize-node-modules.mjs"]

FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim

WORKDIR /usr/src/app

COPY ./microfrontends/meroppfolging/dist ./dist
COPY --from=sanitized-node-modules /usr/src/app/node_modules ./node_modules

ENV HOST=0.0.0.0
ENV PORT=3000

CMD ["./dist/server/entry.mjs"]

EXPOSE $PORT
