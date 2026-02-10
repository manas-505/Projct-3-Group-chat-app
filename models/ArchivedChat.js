const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ArchivedChat = sequelize.define("ArchivedChat", {
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  UserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = ArchivedChat;
