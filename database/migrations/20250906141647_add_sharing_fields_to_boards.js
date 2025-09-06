/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable('boards', function (table) {
    table.string('share_token').unique()
    table.boolean('is_public').defaultTo(false)
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable('boards', function (table) {
    table.dropColumn('share_token')
    table.dropColumn('is_public')
  })
}
