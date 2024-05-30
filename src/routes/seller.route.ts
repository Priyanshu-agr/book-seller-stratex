import express, { Router } from "express";
import validateRequestBody from "../utils/zodValidation";
import Seller from "../models/seller.model";
import * as sellerController from "../controllers/seller.controller"

const router: Router = express.Router();

router.post("/register", validateRequestBody(Seller), sellerController.sellerRegister);
router.post("/login",sellerController.sellerLogin);

export default router;