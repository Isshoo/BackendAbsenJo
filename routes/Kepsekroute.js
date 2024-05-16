import express from "express";
import { getKepsek, getKepsekbyId, createKepsek, deleteKepsek, updateKepsek } from "../controller/Kepsek.js";

const router = express.Router();
router.get("/kepsek/", getKepsek);
router.get("/kepsek/:id", getKepsekbyId);
router.post("/kepsek/", createKepsek);
router.patch("/kepsek/:id", updateKepsek)
router.delete("/kepsek/:id", deleteKepsek);

export default router;
