module.exports = function createUuidColumn(tbl, name = 'id') {
  return tbl.uuid(name).primary().defaultTo(knex.fn.uuid());
};
