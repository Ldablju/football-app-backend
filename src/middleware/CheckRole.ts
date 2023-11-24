import { Request, NextFunction, Response } from "express"
import { UserPayload, UserRole } from "../types"
import { userService } from "../services/UserService"
import { ResponseHelper } from "../helpers"

export const CheckRole = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.user as UserPayload
  const user = await userService.GetUser({ id })

  if (!user) {
    return ResponseHelper(res, 400, "User not found", null)
  }

  if (UserRole[user.role] === UserRole.ADMIN) {
    return next()
  } else {
    return res.status(403).json({
      stauts: 403,
      message: "Access denied",
      data: null,
    })
  }
}
