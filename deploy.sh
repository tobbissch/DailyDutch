#!/usr/bin/env bash
# DailyDutch deploy helper. See deployment.md section 9.
# Vercel deploys automatically on every push to main; this script only checks, builds and pushes.
set -euo pipefail

cd "$(dirname "$0")"

BRANCH=main
VERCEL_IP_DEFAULT=76.76.21.21
REQUIRED_DIST=(index.html assets sw.js manifest.webmanifest icon-192.png icon-512.png apple-touch-icon.png favicon-32.png)

red() { printf '\033[31m%s\033[0m\n' "$*"; }
green() { printf '\033[32m%s\033[0m\n' "$*"; }
step() { printf '\n\033[1m==> %s\033[0m\n' "$*"; }
die() { red "Error: $*"; exit 1; }

usage() {
  cat <<EOF
Usage: ./deploy.sh <command>

  check                 Install, content check, tests, production build, verify dist/
  push                  check + push $BRANCH to GitHub (Vercel then deploys)
  duckdns-ip [IP]       Point DuckDNS name at IP (default $VERCEL_IP_DEFAULT)
  duckdns-txt "VALUE"   Set DuckDNS TXT record (Vercel ownership verification)
  duckdns-status        Show what the DuckDNS name resolves to
  help                  Show this help

DuckDNS commands need: DUCKDNS_DOMAIN (name only, no .duckdns.org) and DUCKDNS_TOKEN.
EOF
}

check() {
  step "Tools"
  command -v node >/dev/null || die "node not found. Install Node.js 18+."
  command -v npm >/dev/null || die "npm not found."
  command -v git >/dev/null || die "git not found."
  local major
  major=$(node -p 'process.versions.node.split(".")[0]')
  [ "$major" -ge 18 ] || die "Node $major is too old, need 18+."
  echo "node $(node -v), npm $(npm -v)"

  step "Install dependencies (npm ci)"
  npm ci

  step "Tests"
  npm test

  step "Build (content check + type check + vite build)"
  npm run build

  step "Verify dist/"
  local f
  for f in "${REQUIRED_DIST[@]}"; do
    [ -e "dist/$f" ] || die "dist/$f missing"
  done
  echo "dist/ size: $(du -sh dist | cut -f1)"
  green "Check passed. Preview locally with: npm run preview"
}

push() {
  step "Git state"
  local current
  current=$(git rev-parse --abbrev-ref HEAD)
  [ "$current" = "$BRANCH" ] || die "On branch '$current', switch to $BRANCH first."
  if [ -n "$(git status --porcelain)" ]; then
    git status --short
    die "Uncommitted changes. Commit them first (see deployment.md 3.3)."
  fi

  check

  step "Push"
  git fetch origin "$BRANCH" 2>/dev/null || true
  echo "Commits to push:"
  git log --oneline "origin/$BRANCH..HEAD" 2>/dev/null || git log --oneline -5
  read -r -p "Push $BRANCH to $(git remote get-url origin)? Vercel will deploy it live. [y/N] " ok
  [ "$ok" = "y" ] || [ "$ok" = "Y" ] || die "Aborted."
  git push -u origin "$BRANCH"
  green "Pushed. Watch the deployment: Vercel dashboard -> project -> Deployments."
}

need_duckdns() {
  [ -n "${DUCKDNS_DOMAIN:-}" ] || die "Set DUCKDNS_DOMAIN, e.g. export DUCKDNS_DOMAIN=dailydutch"
  [ -n "${DUCKDNS_TOKEN:-}" ] || die "Set DUCKDNS_TOKEN (from duckdns.org, keep secret)"
  case "$DUCKDNS_DOMAIN" in *.*) die "DUCKDNS_DOMAIN must be the name only, without .duckdns.org" ;; esac
}

duckdns_call() {
  # $1 = extra query string. Token stays out of the printed output.
  local res
  res=$(curl -fsS "https://www.duckdns.org/update?domains=${DUCKDNS_DOMAIN}&token=${DUCKDNS_TOKEN}&verbose=true$1") \
    || die "Request to DuckDNS failed."
  echo "$res"
  [ "$(echo "$res" | head -n1)" = "OK" ] || die "DuckDNS answered KO. Check DUCKDNS_DOMAIN and DUCKDNS_TOKEN."
}

duckdns_ip() {
  need_duckdns
  local ip="${1:-$VERCEL_IP_DEFAULT}"
  step "Point $DUCKDNS_DOMAIN.duckdns.org -> $ip"
  duckdns_call "&ip=${ip}"
  green "Done. Check in a few minutes: ./deploy.sh duckdns-status"
}

duckdns_txt() {
  need_duckdns
  [ -n "${1:-}" ] || die "Usage: ./deploy.sh duckdns-txt \"VALUE\""
  step "Set TXT for $DUCKDNS_DOMAIN.duckdns.org"
  local value
  value=$(node -p 'encodeURIComponent(process.argv[1])' "$1")
  duckdns_call "&txt=${value}"
  green "Done. Then click Refresh/Verify in Vercel -> Settings -> Domains."
}

duckdns_status() {
  [ -n "${DUCKDNS_DOMAIN:-}" ] || die "Set DUCKDNS_DOMAIN, e.g. export DUCKDNS_DOMAIN=dailydutch"
  local host="$DUCKDNS_DOMAIN.duckdns.org"
  step "$host"
  echo "A:   $(dig +short "$host" A | tr '\n' ' ')"
  echo "TXT: $(dig +short "$host" TXT | tr '\n' ' ')"
  echo "TXT _vercel: $(dig +short "_vercel.$host" TXT | tr '\n' ' ')"
  echo "HTTPS: $(curl -sS -o /dev/null -w '%{http_code}' "https://$host/" || echo failed)"
}

case "${1:-help}" in
  check) check ;;
  push) push ;;
  duckdns-ip) duckdns_ip "${2:-}" ;;
  duckdns-txt) duckdns_txt "${2:-}" ;;
  duckdns-status) duckdns_status ;;
  help | -h | --help) usage ;;
  *) usage; exit 1 ;;
esac
