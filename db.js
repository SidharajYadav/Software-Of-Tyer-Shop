const knex = require('knex');

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: './tire-shop.sqlite'
  },
  useNullAsDefault: true
});

function setupDatabase() {
  db.schema.hasTable('customers').then((exists) => {
    if (!exists) {
      return db.schema.createTable('customers', (table) => {
        table.increments('id').primary();
        table.string('name');
        table.string('contactNumber');
        table.string('city');
        table.timestamps(true, true); // adds created_at and updated_at columns
      });
    }
  });

  db.schema.hasTable('tires').then((exists) => {
    if (!exists) {
      return db.schema.createTable('tires', (table) => {
        table.increments('id').primary();
        table.string('brand'); // change 'name' to 'brand' to avoid conflict with UI display
        table.string('size');
        table.integer('quantity');
        table.float('price');
        table.timestamps(true, true); // adds created_at and updated_at columns
      });
    }
  });

  db.schema.hasTable('sales').then((exists) => {
    if (!exists) {
      return db.schema.createTable('sales', (table) => {
        table.increments('id').primary();
        table.integer('customerId').references('id').inTable('customers');
        table.integer('tireId').references('id').inTable('tires');
        table.integer('quantity');
        table.float('totalPrice');
        table.timestamp('date').defaultTo(db.fn.now());
      });
    }
  });
}

function getTires() {
  return db('tires').select('id', 'brand', 'size', 'quantity', 'price');
}

function updateTireStock(tireId, newQuantity) {
  return db('tires')
    .where('id', tireId)
    .update('quantity', newQuantity);
}

module.exports = { setupDatabase, db, getTires, updateTireStock };
