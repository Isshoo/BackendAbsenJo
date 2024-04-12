import { createPengajuan, getPengajuan, getPengajuanbyGuru } from "../controller/Pengajuan.js";
import express from "express"

const router = express.Router();

router.get("/pengajuan", getPengajuan);
router.get("/pengajuan/:idguru", getPengajuanbyGuru);
router.post("/pengajuan", createPengajuan);

export default router;