import express from "express";
import multer from "multer";
import { uploadCSV } from "../controllers/upload.controller.js";

const router = express.Router();

const upload = multer({
  dest: "uploads/",
});

router.post("/", upload.single("file"), uploadCSV);

export default router;