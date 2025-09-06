#!/bin/sh

# Database Migration Script for CI/CD
# This script handles both auth and custom table migrations
# Environment variables are now handled by knexfile.js with dotenv

set -e # Exit on any error

echo "🚀 Starting database migrations..."

# Run Better-Auth migrations (for user, session, account tables)
echo "🔐 Running Better-Auth migrations..."
bun run auth:migrate

# Run Knex migrations (for custom tables like boards)
echo "🗄️ Running Knex migrations..."
bun run db:migrate

# Check migration status
echo "📊 Migration status:"
bun run db:migrate:status

echo "✅ All migrations completed successfully!"
