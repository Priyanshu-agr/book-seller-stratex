import express, { Router } from "express";
import validateRequestBody from "../utils/zodValidation";
import * as userController from "../controllers/user.controller"

const router: Router = express.Router();

router.post("/register", userController.userRegister);
router.post("/login",userController.userLogin);

export default router;