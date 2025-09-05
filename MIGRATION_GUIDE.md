# Database Migration Guide

This guide explains different approaches to database migrations for CI/CD environments.

## 🎯 **Current Setup**

We now have **multiple migration approaches** available:

### 1. **Better-Auth Migrations** (Auth tables only)
```bash
pnpm run auth-migrate
```
- Handles: `user`, `session`, `account` tables
- Automatic with better-auth CLI
- **Use for**: Authentication-related schema changes

### 2. **Knex.js Migrations** (Custom tables)
```bash
pnpm run db:migrate
```
- Handles: `boards` and other custom tables
- Version-controlled migrations
- **Use for**: Application-specific tables

### 3. **Manual SQL** (One-off changes)
```bash
sqlite3 .data/auth/default.sqlite < migration.sql
```
- **Use for**: Quick fixes or one-off changes

## 🚀 **CI/CD Integration**

### **GitHub Actions Example**

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
          
      - name: Install dependencies
        run: pnpm install
        
      - name: Run auth migrations
        run: pnpm run auth-migrate
        
      - name: Run database migrations
        run: pnpm run db:migrate
        
      - name: Deploy
        run: pnpm run deploy
```

### **Docker Example**

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Run migrations
RUN pnpm run auth-migrate
RUN pnpm run db:migrate

# Build application
RUN pnpm run build

EXPOSE 3000
CMD ["pnpm", "run", "preview"]
```

## 📋 **Available Commands**

### **Knex.js Commands**
```bash
# Run all pending migrations
pnpm run db:migrate

# Rollback last migration
pnpm run db:migrate:rollback

# Check migration status
pnpm run db:migrate:status

# Create new migration
pnpm run db:make-migration migration_name

# Run seeds
pnpm run db:seed

# Create new seed
pnpm run db:make-seed seed_name
```

### **Better-Auth Commands**
```bash
# Run auth migrations
pnpm run auth-migrate

# Generate auth schema
pnpm run auth-generate
```

## 🔧 **Environment Configuration**

### **Development**
```bash
# Uses SQLite by default
pnpm run db:migrate
```

### **Production**
```bash
# Set environment variables (matching env.example)
export DB_TYPE=postgres
export PGHOST=localhost
export PGPORT=5432
export PGUSER=postgres
export PGPASSWORD=password
export PGDATABASE=job_board

# Run migrations
pnpm run migrate
```

## 📊 **Migration Strategies**

### **Strategy 1: Separate Auth & App Migrations**
```bash
# 1. Run auth migrations first
pnpm run auth-migrate

# 2. Run app migrations
pnpm run db:migrate
```

### **Strategy 2: Combined Migration Script**
Create a script that runs both:

```bash
#!/bin/bash
echo "Running auth migrations..."
pnpm run auth-migrate

echo "Running database migrations..."
pnpm run db:migrate

echo "Migrations complete!"
```

### **Strategy 3: Database-Specific Migrations**

#### **SQLite (Development)**
```bash
pnpm run db:migrate
```

#### **PostgreSQL (Production)**
```bash
DB_TYPE=postgres PGHOST=localhost PGUSER=postgres PGPASSWORD=password PGDATABASE=job_board pnpm run migrate
```

#### **MySQL (Alternative)**
```bash
DB_TYPE=mysql pnpm run migrate
```

## 🛡️ **Best Practices**

### **1. Always Backup Before Migrations**
```bash
# SQLite
cp .data/auth/default.sqlite .data/auth/backup-$(date +%Y%m%d).sqlite

# PostgreSQL
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql
```

### **2. Test Migrations Locally First**
```bash
# Test rollback
pnpm run db:migrate:rollback
pnpm run db:migrate
```

### **3. Use Transactions**
Knex migrations are automatically wrapped in transactions.

### **4. Version Control**
- Always commit migration files
- Never edit existing migrations
- Create new migrations for changes

## 🔄 **Migration Workflow**

### **Adding a New Table**
```bash
# 1. Create migration
pnpm run db:make-migration create_new_table

# 2. Edit the migration file
# 3. Run migration
pnpm run db:migrate

# 4. Commit changes
git add database/migrations/
git commit -m "Add new_table migration"
```

### **Modifying Existing Table**
```bash
# 1. Create new migration
pnpm run db:make-migration modify_boards_table

# 2. Edit migration file
# 3. Test locally
pnpm run db:migrate

# 4. Deploy
```

## 🚨 **Troubleshooting**

### **Migration Fails**
```bash
# Check status
pnpm run db:migrate:status

# Rollback if needed
pnpm run db:migrate:rollback

# Fix migration file
# Re-run
pnpm run db:migrate
```

### **Database Connection Issues**
```bash
# Check environment variables
echo $DB_TYPE
echo $PGHOST
echo $PGUSER
echo $PGDATABASE

# Test connection
npx knex migrate:status --knexfile knexfile.js
```

## 📈 **Advanced Features**

### **Seeds for Development Data**
```bash
# Create seed
pnpm run db:make-seed sample_boards

# Run seeds
pnpm run db:seed
```

### **Multiple Environments**
```bash
# Development
NODE_ENV=development pnpm run db:migrate

# Staging
NODE_ENV=staging pnpm run db:migrate

# Production
NODE_ENV=production pnpm run db:migrate
```

This setup gives you professional-grade database migrations that work seamlessly in CI/CD environments!
