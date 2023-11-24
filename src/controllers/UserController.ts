import { Request, Response, NextFunction } from "express"
import { prisma } from "../services/Database"
import { ResponseHelper } from "../helpers"
import { mailTransporter } from "../services/SendMail"
import { SITE_URL, PROTOCOL } from "../config"
import { GeneratePassword, GenerateSalt } from "../utility"
import { ChangePasswordInput, ResetPasswordInput, UpdateUserInput, UpdateUserResponse, UserPayload } from "../types"
import { userService } from "../services/UserService"

export const GetUserByIdController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.user as UserPayload
  try {
    const user = await userService.GetUser({ id })

    if (!user) {
      return ResponseHelper(res, 400, "User not found", null)
    }

    return ResponseHelper(res, 200, "User data send successfully", user)
  } catch (error) {
    console.log(error)
    return ResponseHelper(res, 500, "Somthing went wrong with server", null)
  }
}

export const ActivateUserController = async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.params

  try {
    const isActivated = await prisma.user.findFirst({ where: { activationToken: token } })

    if (!isActivated) return ResponseHelper(res, 400, "Unavailable activation token", null)

    if (isActivated.isActivated) return ResponseHelper(res, 401, "User is already activated", null)

    const getUser = await prisma.user.updateMany({
      where: { activationToken: token },
      data: { isActivated: true },
    })

    if (getUser.count > 0) return ResponseHelper(res, 200, "User has been activated", null)
  } catch (error) {
    console.log(error)
    return ResponseHelper(res, 500, "Somthing went wrong with server", null)
  }
}

export const UpdateUserController = async (req: Request, res: Response, next: NextFunction) => {
  const { name, avatarUrl, description, favoriteTeam }: UpdateUserInput = req.body
  const { id } = req.user as UserPayload
  try {
    const updateUser = await prisma.user.update({
      where: { id: id },
      data: {
        name: name,
        avatarUrl: avatarUrl,
        favoriteTeam: {
          connect: { id: favoriteTeam },
        },
        description: description,
      },
    })

    if (!updateUser) return ResponseHelper(res, 404, "Somthing went wrong with update user", null)

    const data: UpdateUserResponse = {
      id: updateUser.id,
      name: updateUser.name,
      description: updateUser.description,
      favoriteTeamId: updateUser.favoriteTeamId,
    }

    return ResponseHelper(res, 200, "User was updated successfully", data)
  } catch (error) {
    console.log(error)
    return ResponseHelper(res, 500, "Somthing went wrong with server", null)
  }
}

export const SendResetPasswordController = async (req: Request, res: Response, next: NextFunction) => {
  const { email }: ResetPasswordInput = req.body

  try {
    const user = await userService.GetUser({ email })

    if (!user) return ResponseHelper(res, 400, "Wrong email address", null)

    const resetPasswordCode = Math.random().toString(36).substr(2)
    await prisma.user.update({ where: { email: email }, data: { resetPasswordCode: resetPasswordCode } })

    await mailTransporter().sendMail({
      from: '"Football App" <admin@server916785.nazwa.pl>',
      to: email,
      subject: "Reset your password",
      html: `
        <div style="text-align: center; padding: 20px;">
          <h2>Witaj, ${user.name}!</h2>
          <p>Wygląda na to, że zapomniałes hasła do swojego konta Football App. Nic straconego, utwórz swoje nowe hasło klikając w poniższy link:</p>
          <p><a href="${PROTOCOL}${SITE_URL}/user/resetPassword/${resetPasswordCode}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Aktywuj Konto</a></p>
          <p>W przypadku jakichkolwiek problemów pamiętaj, że zespół Football App będzie zawsze do Twojej dyspozycji.</p>
          <p>Życzymy Ci miłego dnia!</p>
        </div>
        `,
    })

    return ResponseHelper(res, 200, "Reset link was sent successfully", null)
  } catch (error) {
    console.log(error)
    return ResponseHelper(res, 500, "Somthing went wrong with server", null)
  }
}

export const ChangePasswordController = async (req: Request, res: Response, next: NextFunction) => {
  const { restartPasswordCode, newPassword }: ChangePasswordInput = req.body

  try {
    const salt = await GenerateSalt()

    const hashedPassword = await GeneratePassword(newPassword, salt)

    const user = await prisma.user.updateMany({
      where: { resetPasswordCode: restartPasswordCode },
      data: { password: hashedPassword, passwordSalt: salt, resetPasswordCode: null },
    })

    if (!user) return ResponseHelper(res, 400, "Wrong restart code", null)

    return ResponseHelper(res, 200, "Password was reset successfully", null)
  } catch (error) {
    console.log(error)
    return ResponseHelper(res, 500, "Somthing went wrong with server", null)
  }
}
