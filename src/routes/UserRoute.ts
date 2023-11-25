import express from "express"
import { Authenticate } from "../middleware"
import { CheckNameController, GetProfileController, UpdateUserController } from "../controllers"

const router = express.Router()

router.use(Authenticate)

router.get("/", GetProfileController)
router.get("/check-name", CheckNameController)
router.patch("/", UpdateUserController)

export { router as UserRoute }
