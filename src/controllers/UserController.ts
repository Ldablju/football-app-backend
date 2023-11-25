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

// export const GetUserByNameController = async (req: Request, res: Response, next: NextFunction) => {
//   const { name } = req.query

//   if (typeof name !== "string") return ResponseHelper(res, 400, "Invalid user name", null)

//   try {
//     const user = await userService.GetUserByName(name)

//     if (!user) return ResponseHelper(res, 401, "User not found", null)

//     const {
//       role,
//       password,
//       email,
//       passwordSalt,
//       isProfileComplete,
//       resetPasswordCode,
//       activationToken,
//       isActivated,
//       ...newData
//     } = user

//     return ResponseHelper(res, 200, "User data send successfully", newData)
//   } catch (error) {
//     console.log(error)
//     return ResponseHelper(res, 500, "Somthing went wrong with server", null)
//   }
// }

export const UpdateUserController = async (req: Request, res: Response, next: NextFunction) => {
  const { name, avatarUrl, description, favoriteTeam }: UpdateUserInput = req.body
  const { id } = req.user as UserPayload
  try {
    const updateUser = await prisma.user.update({
      where: { id: id },
      data: {
        name: name,
        avatarUrl: avatarUrl,
        favoriteTeam: {
          connect: { id: favoriteTeam },
        },
        description: description,
      },
    })

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
