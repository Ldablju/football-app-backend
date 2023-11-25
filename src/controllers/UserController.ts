import { Request, Response, NextFunction } from "express"
import { prisma } from "../services/Database"
import { ResponseHelper } from "../helpers"
import { DeleteUser, UpdateUserInput, UpdateUserResponse, UserPayload } from "../types"
import { userService } from "../services/UserService"

export const GetProfileController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.user as UserPayload
  try {
    const user = await userService.GetUser({ id })

    if (!user) {
      return ResponseHelper(res, 400, "User not found", null)
    }

    return ResponseHelper(res, 200, "User data send successfully", user)
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

    if (user) return ResponseHelper(res, 200, "User found", { exists: false })

    return ResponseHelper(res, 200, "User not exists", { exists: true })
  } catch (error) {
    console.log(error)
    return ResponseHelper(res, 500, "Somthing went wrong with server", null)
  }
}

export const UpdateUserController = async (req: Request, res: Response, next: NextFunction) => {
  const { name, avatarUrl, description, favoriteTeam }: UpdateUserInput = req.body
  const { id } = req.user as UserPayload
  try {
    const updateUser = await userService.UpdateUser(id, { name, avatarUrl, description, favoriteTeam })

    if (!updateUser) return ResponseHelper(res, 404, "Somthing went wrong with update user", null)

    const data: UpdateUserResponse = {
      id: updateUser.id,
      name: updateUser.name,
      description: updateUser.description,
      favoriteTeamId: updateUser.favoriteTeamId,
    }

    return ResponseHelper(res, 200, "User was updated successfully", data)
  } catch (error) {
    console.log(error)
    return ResponseHelper(res, 500, "Somthing went wrong with server", null)
  }
}

export const DeleteUserController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params

  try {
    const deleteUser = await userService.DeleteUser(id)

    console.log(deleteUser)

    return ResponseHelper(res, 200, "User was deleted succesfully", null)
  } catch (error) {
    console.log(error)
    return ResponseHelper(res, 500, "Somthing went wrong with server", null)
  }
}
