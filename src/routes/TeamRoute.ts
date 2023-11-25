import express from "express"
import {
  GetTeamByIdController,
  GetAllTeamsController,
  CreateTeamController,
  UpdateTeamController,
} from "../controllers"
import { Authenticate, CheckRole } from "../middleware"

const router = express.Router()

router.use(Authenticate)

router.get("/all", GetAllTeamsController)
router.get("/:teamId", GetTeamByIdController)

router.use(CheckRole)

router.patch("/", UpdateTeamController)
router.post("/", CreateTeamController)

export { router as TeamRoute }
