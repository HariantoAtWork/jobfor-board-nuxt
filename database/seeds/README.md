# Database Seeds

This directory contains database seed files that populate your database with initial or sample data for development and testing.

## What are Seeds?

Database seeds are different from migrations:
- **Migrations**: Create/modify database structure (tables, columns, indexes)
- **Seeds**: Insert initial data into those tables

## Available Seeds

### 01_sample_boards.cjs
Creates sample job application boards with realistic data:
- Software Engineer Applications board with cards in different stages
- DevOps Engineer Applications board
- Includes sample cards with notes, job links, and company information
- Uses sample user ID for testing

### 02_shared_boards.cjs
Creates sample shared boards for testing public sharing functionality:
- Public job board example with share token
- Demonstrates how boards can be shared publicly
- Only runs in development environment (skipped in production)

## Usage

### Run All Seeds
```bash
# Using the provided script
./scripts/seed.sh

# Or directly with knex
npx knex seed:run
```

### Run Specific Seed
```bash
npx knex seed:run --specific=01_sample_boards.cjs
```

### Fresh Database with Seeds
```bash
# Reset database and run all seeds
npx knex migrate:rollback --all
npx knex migrate:latest
npx knex seed:run
```

## Seed File Structure

Each seed file exports a `seed` function that:
1. Deletes existing data (optional)
2. Inserts new sample data
3. Returns a Promise

Example:
```javascript
exports.seed = async function (knex) {
  await knex('table_name').del()
  await knex('table_name').insert(sampleData)
}
```

## Development vs Production

- Seeds are typically used for development and testing
- Some seeds (like shared boards) skip execution in production
- Always be careful when running seeds in production environments

## Creating New Seeds

1. Create a new `.cjs` file in this directory
2. Use the naming convention: `XX_description.cjs` (where XX is a number for ordering)
3. Export a `seed` function that returns a Promise
4. Test your seed with `npx knex seed:run --specific=your_file.cjs`

## Notes

- Seeds run in alphabetical order by filename
- Use the `01_`, `02_` prefix to control execution order
- Always handle foreign key constraints properly
- Consider data dependencies between tables
