import express from "express";
const router = express.Router();
import { emailExtract, form, download } from "../Controller/emailExtract.controller.js";
import { domainValidation } from "../Middleware/emailExtract.validation.js";

router.get("/", form);
router.post("/emailExtract", domainValidation, emailExtract);
router.post("/download", download);

export default router;
