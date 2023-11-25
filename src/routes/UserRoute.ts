import express from "express"
import { Authenticate, CheckRole } from "../middleware"
import { CheckNameController, DeleteUserController, GetProfileController, UpdateUserController } from "../controllers"

const router = express.Router()

router.use(Authenticate)

router.get("/", GetProfileController)
router.get("/check-name", CheckNameController)
router.patch("/", UpdateUserController)

router.use(CheckRole)

router.delete("/:id", DeleteUserController)

export { router as UserRoute }
