import { Request, Response, NextFunction } from "express"
import { ResponseHelper } from "../helpers"
import { CreateTeamInput } from "../types"
import { teamService } from "../services/TeamService"

export const GetTeamByIdController = async (req: Request, res: Response, next: NextFunction) => {
  const { teamId } = req.params

  try {
    const team = await teamService.GetTeam(teamId)

    if (!team) return ResponseHelper(res, 400, "Wrong team id", null)

    return ResponseHelper(res, 200, "Show team by id", team)
  } catch (error) {
    console.log(error)
    return ResponseHelper(res, 500, "Somthing went wrong with server", null)
  }
}
export const GetAllTeamsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teams = await teamService.GetTeams()

    return ResponseHelper(res, 200, "Show all teams", teams)
  } catch (error) {
    console.log(error)
    return ResponseHelper(res, 500, "Somthing went wrong with server", null)
  }
}
export const CreateTeamController = async (req: Request, res: Response, next: NextFunction) => {
  const { name, points, winMatch, drawMatch, lossMatch, stadion, logoUrl }: CreateTeamInput = req.body

  try {
    const newTeam = await teamService.CreateTeam({
      name,
      points,
      winMatch,
      drawMatch,
      lossMatch,
      stadion,
      logoUrl,
    })
    return ResponseHelper(res, 200, "Team created successfully", newTeam)
  } catch (error) {
    console.log(error)
    return ResponseHelper(res, 500, "Somthing went wrong with server", null)
  }
}
export const UpdateTeamController = async (req: Request, res: Response, next: NextFunction) => {}
