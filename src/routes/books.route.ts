import express, { Router } from "express";
import multer from "multer";
import validateRequestBody from "../utils/zodValidation";
import Book from "../models/book.model";
import * as bookController from "../controllers/book.controller";
import verifyToken from "../middlewares/auth.middleware";

const router: Router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/", verifyToken, bookController.allBooks); // get all books for user
router.get("/seller", verifyToken, bookController.allSellerBooks); // get all books for a specific seller
router.get("/:bookId", verifyToken, bookController.singleBook);
router.post("/", verifyToken, upload.single('book'), bookController.uploadBooks);
router.put("/:bookId", verifyToken, bookController.updateBook);
router.delete(":/bookId",verifyToken,); 

export default router;