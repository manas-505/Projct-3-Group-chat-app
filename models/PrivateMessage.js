const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const PrivateMessage = sequelize.define("PrivateMessage", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  roomId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

/* ✅ relation with User */
User.hasMany(PrivateMessage);
PrivateMessage.belongsTo(User);

module.exports = PrivateMessage;
