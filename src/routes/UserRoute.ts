import express from "express";
import { Authenticate } from "../middleware";
import {
  GetUserByIdController,
  UpdateUserController,
  ActivateUserController,
  SendResetPasswordController,
  ChangePasswordController,
} from "../controllers";

const router = express.Router();

router.get("/activate/:token", ActivateUserController);
router.post("/sendResetPassword", SendResetPasswordController);
router.post("/changePassword", ChangePasswordController);

router.use(Authenticate);

router.get("", GetUserByIdController);

router.patch("/", UpdateUserController);

export { router as UserRoute };
