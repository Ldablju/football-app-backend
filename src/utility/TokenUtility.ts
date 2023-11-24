import jwt from "jsonwebtoken"
import { Request } from "express"

import { SECRET } from "../config"
import { AuthPayload } from "../types"

export const GenerateToken = async (payload: AuthPayload) => {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" })
}

export const ValidateToken = async (req: Request) => {
  const token = req.headers["authorization"]

  if (token) {
    try {
      const payload = jwt.verify(token.replace("Bearer ", ""), SECRET) as AuthPayload
      req.user = payload
      return true
    } catch (error) {
      return false
    }
  }

  return false
}
