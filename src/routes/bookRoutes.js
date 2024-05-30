import express from "express";
import booksController from "../controller/booksController.js";

const router = express.Router();

router.get("/borrow", booksController.borrow);

export default router;