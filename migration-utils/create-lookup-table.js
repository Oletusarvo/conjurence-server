/**A helper function to create consistent lookup tables. */
module.exports = function createLookupTable(tbl) {
  tbl.increments('id');
  tbl.string('label', 16).unique();
};
