/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('boards', function(table) {
    table.string('id').primary()
    table.string('user_id').notNullable()
    table.string('title').notNullable()
    table.text('data').notNullable() // JSON string of board data
    table.string('created_at').notNullable() // ISO string
    table.string('updated_at').notNullable() // ISO string
    
    // Foreign key constraint
    table.foreign('user_id').references('id').inTable('user').onDelete('CASCADE')
    
    // Indexes for performance
    table.index('user_id', 'idx_boards_user_id')
    table.index('title', 'idx_boards_title')
    table.index('created_at', 'idx_boards_created_at')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('boards')
};
