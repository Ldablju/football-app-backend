import { Request, Response, NextFunction } from "express"
import { prisma } from "../services/Database"
import { ResponseHelper } from "../helpers"
import { UpdateUserInput, UpdateUserResponse, UserPayload } from "../types"
import { userService } from "../services/UserService"

export const GetProfileController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.user as UserPayload
  try {
    const user = await userService.GetUser({ id })

    if (!user) {
      return ResponseHelper(res, 400, "User not found", null)
    }

    return ResponseHelper(res, 200, "User data sent successfully", user)
  } catch (error) {
    console.log(error)
    return ResponseHelper(res, 500, "Somthing went wrong with server", null)
  }
}

export const CheckNameController = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.query

  if (typeof name !== "string") return ResponseHelper(res, 400, "Invalid user name", null)

  try {
    const user = await prisma.user.findFirst({ where: { name: name } })

    if (user) return ResponseHelper(res, 200, "User found", { exists: true })

    return ResponseHelper(res, 200, "User not exists", { exists: false })
  } catch (error) {
    console.log(error)
    return ResponseHelper(res, 500, "Somthing went wrong with server", null)
  }
}

export const UpdateUserController = async (req: Request, res: Response, next: NextFunction) => {
  const { name, description, favouriteTeam }: UpdateUserInput = req.body
  const { id } = req.user as UserPayload
  try {
    const updateUser = await userService.UpdateUser(id, { name, description, favouriteTeam })

    if (!updateUser) return ResponseHelper(res, 404, "Somthing went wrong with update user", null)

    const { password, passwordSalt, favouriteTeamId, ...userData } = updateUser

    return ResponseHelper(res, 200, "User was updated successfully", userData)
  } catch (error) {
    console.log(error)
    return ResponseHelper(res, 500, "Somthing went wrong with server", null)
  }
}

export const DeleteUserController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params

  try {
    await userService.DeleteUser(id)
    return ResponseHelper(res, 200, "User was deleted succesfully", null)
  } catch (error: any) {
    if (error.code === "P2025") return ResponseHelper(res, 400, "User not found", null)
    return ResponseHelper(res, 500, "Somthing went wrong with server", null)
  }
}
