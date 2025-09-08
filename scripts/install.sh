#!/bin/sh

set -e # Exit on any error

rm -rf .nuxt .output data

# Install dependencies
echo "🔍 Installing dependencies..."
bun install

# Check environment variables
echo "🔍 Checking environment variables..."
./scripts/check-env.mjs

echo "🔍 Running migrations..."
npx @better-auth/cli generate -y --config ./modules/0000-auth/lib/auth.server.js
npx @better-auth/cli migrate -y --config ./modules/0000-auth/lib/auth.server.js
npx knex migrate:latest --knexfile knexfile.js

# Build Nuxt application
echo "🔍 Building Nuxt application..."
# Build Nuxt application
bun run build
