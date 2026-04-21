
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Url = sequelize.define('Url', {

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  shortId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },

  longUrl: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  expiry: {
    type: DataTypes.DATE
  },

  userId: {
    type: DataTypes.INTEGER
  },

  isCustom: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }

});

module.exports = Url;