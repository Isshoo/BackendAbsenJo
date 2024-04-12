import express from "express"
import { getKehadiranGuru, createKehadiran, updateKehadiran, getDataHadirBaru } from "../controller/Kehadiran.js"

const router = express.Router();

router.get("/kehadiran/:id", getKehadiranGuru)
router.get("/kehadiran/baru/:id", getDataHadirBaru)
router.post("/kehadiran/", createKehadiran)
router.patch("/kehadiran/:id", updateKehadiran)

export default router;