const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const PrivateMessage = sequelize.define("PrivateMessage", {
  roomId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = PrivateMessage;
