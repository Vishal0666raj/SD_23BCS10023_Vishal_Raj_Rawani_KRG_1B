const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create connection
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

// Test connection
sequelize.authenticate()
  .then(() => console.log("MySQL Connected"))
  .catch(err => console.log(err));

module.exports = sequelize;