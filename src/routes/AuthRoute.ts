import express from "express"
import {
  ActivateUserController,
  ChangePasswordController,
  SendResetPasswordController,
  SignInController,
  SignUpController,
} from "../controllers"

const router = express.Router()

router.post("/signin", SignInController)
router.post("/signup", SignUpController)

router.get("/activate/:token", ActivateUserController)
router.post("/send-reset-password", SendResetPasswordController)
router.post("/change-password", ChangePasswordController)

export { router as AuthRoute }
