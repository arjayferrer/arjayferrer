#!/bin/sh
# Starts Tesla's signing proxy (localhost only), then the Express server.
#
# The command-signing private key never lives in git or the image. Provide it as:
#   - env var TESLA_COMMAND_PRIVATE_KEY (the full PEM; literal "\n" is also accepted), or
#   - a Render Secret File at /etc/secrets/private-key.pem
set -eu

KEY_DIR=/run/tesla
SECRET_FILE=/etc/secrets/private-key.pem

if [ -n "${TESLA_COMMAND_PRIVATE_KEY:-}" ] || [ -f "$SECRET_FILE" ]; then
  mkdir -p "$KEY_DIR"
  umask 077

  if [ -n "${TESLA_COMMAND_PRIVATE_KEY:-}" ]; then
    printf '%b\n' "$TESLA_COMMAND_PRIVATE_KEY" > "$KEY_DIR/fleet-key.pem"
  else
    cp "$SECRET_FILE" "$KEY_DIR/fleet-key.pem"
  fi

  # Throwaway TLS identity for the loopback hop node -> proxy. The proxy refuses to
  # start if this is the same key as the signing key, so it is generated separately.
  openssl req -x509 -nodes -newkey ec -pkeyopt ec_paramgen_curve:secp384r1 \
    -pkeyopt ec_param_enc:named_curve -subj '/CN=localhost' \
    -keyout "$KEY_DIR/tls-key.pem" -out "$KEY_DIR/tls-cert.pem" -sha256 -days 3650 \
    -addext "extendedKeyUsage = serverAuth" \
    -addext "keyUsage = digitalSignature, keyAgreement" \
    -addext "subjectAltName = DNS:localhost" 2>/dev/null

  tesla-http-proxy \
    -tls-key "$KEY_DIR/tls-key.pem" -cert "$KEY_DIR/tls-cert.pem" \
    -key-file "$KEY_DIR/fleet-key.pem" \
    -host 127.0.0.1 -port 4443 &

  export TESLA_PROXY_URL=https://localhost:4443
  export TESLA_PROXY_CA="$KEY_DIR/tls-cert.pem"
else
  echo "WARNING: no signing key (TESLA_COMMAND_PRIVATE_KEY or $SECRET_FILE); lock/unlock/climate/honk/flash will fail. Status reads still work." >&2
fi

exec node server.js
