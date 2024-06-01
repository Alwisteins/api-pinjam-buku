import express from "express";
import booksController from "../controller/booksController.js";

const router = express.Router();

router.post("/borrow", booksController.borrowBook);
router.post("/return", booksController.returnBook);
router.get("/list", booksController.getAvailableBooks);

export default router;
