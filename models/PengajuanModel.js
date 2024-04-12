import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Guru from "./GuruModel.js";

const { DataTypes } = Sequelize;

const Pengajuan = db.define(
  "Pengajuan",
  {
    id_pengajuan: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_guru: {
      type: DataTypes.INTEGER,
    },
    jenis: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    tanggal: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    file: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    freezeTableName: true,
  }
);

Guru.hasMany(Pengajuan)
Pengajuan.belongsTo(Guru, {foreignKey : "id_guru"})

export default Pengajuan;