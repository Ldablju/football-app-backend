import { FindUserConfig } from "../types"
import { prisma } from "./Database"
import { User } from "@prisma/client"

export const userService = {
  GetUser: async ({ id, email }: FindUserConfig) => {
    const condition = id ? { id } : email ? { email } : null

    if (!condition) return null

    const user = await prisma.user.findUnique({ where: condition })

    return user ? (({ password, passwordSalt, ...userData }) => userData)(user as User) : null
  },
  GetUserByName: async (name: string) => {
    return await prisma.user.findFirst({ where: { name } })
  },
}
