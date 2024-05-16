import express from "express";
import { createPiket, updatePiket, getPiket, getPiketById } from "../controller/Piket.js";

const router = express.Router();

router.post("/piket", createPiket);
router.patch("/piket/:id", updatePiket);
router.get("/piket/", getPiket)
router.get("/piket/:id", getPiketById)

export default router;
