const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Message = sequelize.define("Message", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

// Relation
User.hasMany(Message);
Message.belongsTo(User);

module.exports = Message;
