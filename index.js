import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import fileupload from "express-fileupload";
import db from "./config/Database.js";
import SequelizeStore from "connect-session-sequelize";
import Gururoute from "./routes/Gururoute.js"
import KepsekRoute from "./routes/Kepsekroute.js"
import AdminRoute from "./routes/Adminroute.js";
import AuthRoute from "./routes/Authroute.js";
import PengajuanRoute from "./routes/PengajuanRoute.js";
import KehadiranRoute from "./routes/Kehadiranroute.js";
import PiketRoute from "./routes/Piketroute.js";


dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
  db: db,
});

(async()=>{
    await db.sync();
})();

store.sync();


app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      secure: "auto",
    },
  })
);

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use(fileupload());
app.use(express.static("public"));
app.use(express.json());
app.use(Gururoute);
app.use(KepsekRoute);
app.use(AdminRoute);
app.use(AuthRoute);
app.use(PengajuanRoute);
app.use(KehadiranRoute);
app.use(PiketRoute);

app.listen(process.env.APP_PORT, () => {
  console.log("Server Running");
});