import express from "express";
import { getAdmin, getAdminbyId, createAdmin, deleteAdmin, updateAdmin } from "../controller/Admin.js";

const router = express.Router();
router.get("/admin", getAdmin);
router.get("/admin/:id", getAdminbyId);
router.post("/admin", createAdmin);
router.patch("admin:id", updateAdmin)
router.delete("/admin/:id", deleteAdmin);

export default router;
