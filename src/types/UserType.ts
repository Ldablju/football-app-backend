export interface UserPayload {
  id: string
}

export type FindUserConfig = {
  id?: string
  email?: string
}

export type UpdateUserInput = {
  name: string
  description?: string
  favouriteTeam?: string
}

export type UpdateUserResponse = {
  id: string
  name: string | null
  description: string | null
  favouriteTeamId: string | null
}

export enum UserRole {
  ADMIN,
  USER,
  MODERATOR,
}
