#!/bin/sh

set -e # Exit on any error

# Check environment variables
./scripts/check-env.mjs

# Install dependencies
echo "🔍 Installing dependencies..."
bun install

# Generate database schema: Better-Auth
echo "🔍 Generating database schema: Better-Auth..."
bun run auth:generate

# Run database migrations: Better-Auth
echo "🔍 Running database migrations: Better-Auth..."
bun run auth:migrate

# Run database migrations: Knex
echo "🔍 Running database migrations: Knex..."
# Run database migrations: Knex
bun run db:migrate

# Build Nuxt application
echo "🔍 Building Nuxt application..."
# Build Nuxt application
bun run build

# Run Nuxt application
echo "🔍 Running Nuxt application..."
# Run Nuxt application
bun run start
