import express from "express";
import membersController from "../controller/membersController.js";

const router = express.Router();

router.get("/list", membersController.getAllMembers);

export default router;
