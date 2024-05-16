import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Guru from "./GuruModel.js";

const { DataTypes } = Sequelize;

const Piket = db.define(
    "Piket",
    {
    id_piket: {
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
    tanggal: {
        type: DataTypes.DATE,
    },
    keterangan: {
        type: DataTypes.STRING,
    },
    },
    {
freezeTableName: true,
    }
);

Guru.hasMany(Piket)
Piket.belongsTo(Guru, {foreignKey : "id_guru"})

export default Piket;