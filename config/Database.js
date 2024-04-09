import { Sequelize } from "sequelize";
const db = new Sequelize("AbsenJo", "root", "", {
    host:"localhost",
    dialect:"mysql"
})
export default db