# Tesla's official command-signing proxy, pinned to a release tag.
FROM golang:1.24-bookworm AS proxy-build
RUN go install github.com/teslamotors/vehicle-command/cmd/tesla-http-proxy@v0.4.1

FROM node:22-bookworm-slim
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*
COPY --from=proxy-build /go/bin/tesla-http-proxy /usr/local/bin/tesla-http-proxy

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN chmod +x docker-entrypoint.sh

# Render sets PORT; server.js reads it.
ENTRYPOINT ["./docker-entrypoint.sh"]
