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

router.get("/getById/:teamId", GetTeamByIdController)
router.get("/getAll", GetAllTeamsController)

router.use(CheckRole)

router.patch("/update", UpdateTeamController)
router.post("/create", CreateTeamController)

export { router as TeamRoute }
