import { Sequelize } from "sequelize";
import db from "../config/Database.js";
const {DataTypes} = Sequelize;

const Contoh = db.define("Guru", {
    NIP:{type: DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
}
})