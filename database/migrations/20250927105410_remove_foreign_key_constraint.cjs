/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable('boards', function (table) {
    // Remove the foreign key constraint to allow proxy users
    // who don't exist in the local user table
    table.dropForeign('user_id')
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable('boards', function (table) {
    // Re-add the foreign key constraint
    table
      .foreign('user_id')
      .references('id')
      .inTable('user')
      .onDelete('CASCADE')
  })
}
