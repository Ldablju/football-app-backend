import { Response } from "express"

export const ResponseHelper = (res: Response, status: number, message: string, data: object | null) => {
  return res.status(status).json({ status, message, data })
}
