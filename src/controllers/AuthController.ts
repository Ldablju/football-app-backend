import { Request, Response, NextFunction } from "express"
import { ChangePasswordInput, ResetPasswordInput, SignInInput, SignUpInput } from "../types"
import { GeneratePassword, GenerateSalt, ValidatePassword } from "../utility"
import { GenerateToken } from "../utility"
import { mailTransporter } from "../services/SendMail"
import { SITE_URL, PROTOCOL } from "../config"
import { ResponseHelper } from "../helpers"
import { authService } from "../services/AuthService"
import { prisma } from "../services/Database"
import { userService } from "../services/UserService"

export const SignInController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password }: SignInInput = req.body

    const user = await authService.GetUser(email)

    if (!user) return ResponseHelper(res, 403, "User with this email does exists", null)

    const validation = await ValidatePassword(password, user.password, user.passwordSalt)

    if (!validation) return ResponseHelper(res, 403, "Wrong password", null)

    if (!user.isActivated) return ResponseHelper(res, 403, "User is not activated", null)

    const token = await GenerateToken({
      id: user.id,
    })

    return ResponseHelper(res, 200, "User was logged in", {
      userData: {
        id: user.id,
        name: user.name,
        description: user.description,
        avatarUrl: user.avatarUrl,
        favoriteTeam: user.favouriteTeam,
      },
      token,
    })
  } catch (error) {
    console.log(error)
    return ResponseHelper(res, 500, "Somthing went wrong with server", null)
  }
}
export const SignUpController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password }: SignUpInput = req.body

    const existingUser = await authService.GetUser(email)

    if (existingUser) return ResponseHelper(res, 400, "User with this email already exists", null)

    const salt = await GenerateSalt()
    const hashedPassword = await GeneratePassword(password, salt)
    const activationToken = Math.random().toString(36).substr(2)

    const data = {
      email,
      password: hashedPassword,
      passwordSalt: salt,
      activationToken,
    }

    const newUser = await authService.CreateUser(data)

    if (!newUser) return ResponseHelper(res, 400, "Error while creating user", null)

    await mailTransporter().sendMail({
      from: '"Football App" <admin@server916785.nazwa.pl>',
      to: email,
      subject: "Verify yout account at Football App",
      html: `
        <div style="text-align: center; padding: 20px;">
          <h2>Witaj w Football App!</h2>
          <p>Dziękujemy za rejestrację. Aby aktywować swoje konto, kliknij poniższy link:</p>
          <p><a href="${PROTOCOL}${SITE_URL}/user/activate/${activationToken}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Aktywuj Konto</a></p>
          <p>Jeśli nie rejestrowałeś się w Football App, zignoruj tę wiadomość.</p>
          <p>Dziękujemy!</p>
        </div>
        `,
    })

    return ResponseHelper(res, 200, "User was created successfully", null)
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
