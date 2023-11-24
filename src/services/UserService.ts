import { FindUserConfig } from "../types"
import { prisma } from "./Database"

const options = {
  id: true,
  name: true,
  email: false,
  role: true,
  password: false,
  passwordSalt: false,
  description: true,
  isProfileComplete: true,
  resetPasswordCode: false,
  activationToken: false,
  avatarUrl: true,
  isActivated: true,
  favoriteTeamId: false,
  favoriteTeam: true,
}

export const userService = {
  GetUser: async (config: FindUserConfig) => {
    const { id, email } = config
    if (email) {
      return await prisma.user.findUnique({
        where: { email: email },
        select: options,
      })
    }
    if (id) {
      return await prisma.user.findUnique({
        where: { id: id },
        select: options,
      })
    }
    return null
  },
}
