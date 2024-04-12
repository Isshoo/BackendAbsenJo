import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Guru from "./GuruModel.js";

const { DataTypes } = Sequelize;

const Kehadiran = db.define(
  "Kehadiran",
  {
    id_kehadiran: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    id_guru: {
      type: DataTypes.INTEGER,
    },
    masuk: {
      type: DataTypes.STRING,
    },
    keluar: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);


Guru.hasMany(Kehadiran);
Kehadiran.belongsTo(Guru, { foreignKey: "id_guru" });


export default Kehadiran