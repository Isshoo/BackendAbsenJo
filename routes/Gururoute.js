import express from "express"
import {
  getGuru,
  getGuruById,
  createGuru,
  deleteGuru,
  updateGuru
} from "../controller/Guru.js";

const router = express.Router()
router.get("/guru/", getGuru)
router.get("/guru/:id", getGuruById)
router.post("/guru/", createGuru)
router.patch("/guru/:id", updateGuru)
router.delete("/guru/:id", deleteGuru)

export default router