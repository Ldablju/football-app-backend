import express from "express";
import { SignInController, SignUpController } from "../controllers";

const router = express.Router();

router.post("/signin", SignInController);

router.post("/signup", SignUpController);

export { router as AuthRoute };
