import { CreateUser } from "../types"
import { prisma } from "./Database"

export const authService = {
  GetUser: async (email: string) => {
    return await prisma.user.findUnique({ where: { email: email }, include: { favouriteTeam: true } })
  },
  CreateUser: async (data: CreateUser) => {
    return await prisma.user.create({ data })
  },
}
