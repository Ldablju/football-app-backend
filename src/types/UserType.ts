export interface UserPayload {
  id: string
}

export type FindUserConfig = {
  id?: string
  email?: string
}

export type UpdateUserInput = {
  name: string
  avatarUrl: string
  description: string
  favoriteTeam: string
}

export type UpdateUserResponse = {
  id: string
  name: string | null
  description: string | null
  favoriteTeamId: string | null
}

export type ResetPasswordInput = {
  email: string
}

export type ChangePasswordInput = {
  restartPasswordCode: string
  newPassword: string
}

export enum UserRole {
  ADMIN,
  USER,
  MODERATOR,
}