#!/bin/bash

# Database Seeding Script
# Runs database seeds to populate tables with sample data

echo "🌱 Running database seeds..."

# Check if we're in the right directory
if [ ! -f "knexfile.js" ]; then
    echo "❌ Error: knexfile.js not found. Please run this script from the project root."
    exit 1
fi

# Load environment variables
if [ -f ".env" ]; then
    echo "📄 Loading environment variables from .env file..."
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "⚠️  Warning: .env file not found. Using system environment variables."
fi

# Run seeds
echo "🌱 Seeding database..."
npx knex seed:run

if [ $? -eq 0 ]; then
    echo "✅ Database seeding completed successfully!"
else
    echo "❌ Database seeding failed!"
    exit 1
fi
