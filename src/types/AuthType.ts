import { UserPayload } from "./UserType"

export type SignInInput = {
  email: string
  password: string
}

export type SignUpInput = {
  email: string
  password: string
}

export type CreateUser = {
  email: string
  password: string
  passwordSalt: string
  activationToken: string
}

export type UserData = {
  id: string
  name: string | null
  description: string | null
  avatarUrl: string | null
  isProfileComplete: boolean
  favoriteTeamId: string | null
}

export type AuthPayload = UserPayload
