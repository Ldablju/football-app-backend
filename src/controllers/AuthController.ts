import { Request, Response, NextFunction } from "express"
import { SignInInput, SignUpInput, UserData } from "../types"
import { prisma } from "../services/Database"
import { GeneratePassword, GenerateSalt, ValidatePassword } from "../utility"
import { GenerateToken } from "../utility"
import { mailTransporter } from "../services/SendMail"
import { SITE_URL, PROTOCOL } from "../config"
import { ResponseHelper } from "../helpers"
import { userService } from "../services/UserService"

export const SignInController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password }: SignInInput = req.body

    const user = await userService.GetUser({ email })

    if (!user) return ResponseHelper(res, 403, "User with this email does exists", null)

    const validation = await ValidatePassword(password, user.password, user.passwordSalt)

    if (!validation) return ResponseHelper(res, 403, "Wrong password", null)

    if (!user.isActivated) return ResponseHelper(res, 403, "User is not activated", null)

    const token = await GenerateToken({
      id: user.id,
    })

    return ResponseHelper(res, 200, "User was logged in", {
      userData: user,
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

    const existingUser = await userService.GetUser({ email })

    if (existingUser) return ResponseHelper(res, 400, "User with this email already exists", null)

    const salt = await GenerateSalt()
    const hashedPassword = await GeneratePassword(password, salt)
    const activationToken = Math.random().toString(36).substr(2)

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        passwordSalt: salt,
        activationToken,
      },
    })

    if (newUser) {
      const { id, email } = newUser

      const sendToken = await mailTransporter().sendMail({
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

      return ResponseHelper(res, 200, "User was created successfully", {
        id,
        email,
      })
    }

    return ResponseHelper(res, 400, "Error while creating user", null)
  } catch (error) {
    console.log(error)
    return ResponseHelper(res, 500, "Somthing went wrong with server", null)
  }
}
