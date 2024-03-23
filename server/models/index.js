// models/index.js

const Sequelize = require('sequelize');
const sequelize = new Sequelize('vendor', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Define your Joining model
db.Joining = require('./joining')(sequelize, Sequelize);

module.exports = db;
