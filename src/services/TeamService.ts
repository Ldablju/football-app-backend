import { CreateTeamInput } from "../types"
import { prisma } from "./Database"

export const teamService = {
  GetTeam: async (userId: string) => {
    return await prisma.team.findUnique({ where: { id: userId } })
  },
  GetTeams: async () => {
    return await prisma.team.findMany()
  },
  CreateTeam: async (data: CreateTeamInput) => {
    return await prisma.team.create({ data })
  },
}
