import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const Admin = db.define("Admin", {
  id_admin: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    defaultValue: "99999",
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  nama: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  username : {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  password : {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  role : {
    type: DataTypes.STRING,
    defaultValue: "Admin",
  }
}, {
  freezeTableName: true
});

export default Admin