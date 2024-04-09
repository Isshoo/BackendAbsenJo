import express from "express"
import dotenv from "dotenv"
import session from "express-session"
import cors from "cors"
import SequelizeStore from "connect-session-sequelize"
import db from "./config/Database.js"

dotenv.config();
const app = express();
const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({
    db : db,
})

// (async()=>{
//     await db.sync()
// })
app.use(session({
    secret:process.env.SESS_SECRET,
    resave: false,
    saveUninitialized : true,
    store: store,
    cookie:{
        secure:"auto"
    }
}))

app.use(
    cors({
        credentials:true,
        origin: "http://localhost:3000"
    })
)

app.use(express.json())

// store.sync();
app.listen(process.env.APP_PORT,()=>{
    console.log("server up and running")
})