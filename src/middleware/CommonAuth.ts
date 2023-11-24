import { Request, NextFunction, Response } from "express"
import { AuthPayload } from "../types"
import { ValidateToken } from "../utility"

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload
    }
  }
}

export const Authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const token = await ValidateToken(req)
  if (token) {
    return next()
  } else {
    return res.status(403).json({
      stauts: 403,
      message: "User not authorized",
      data: null,
    })
  }
}
