import { Request, Response } from "express"
import userService from "../service/userService"
import { config } from "dotenv"

config()

class AuthController {
  async registration(
    request: Request<{}, {}, RegistrationRequest>,
    response: Response<RegistrationResponse | string>
  ) {
    try {
      const {username, email, password} = request.body
      const userData: RegistrationResponse = await userService.registration({
        username, email, password
      })
      
      response.cookie('refreshToken', userData.tokens.refreshToken, {httpOnly: true})
      return response.send(userData)
    } catch (error: unknown) {
      const {message} = error as Error
      response.status(403).send(message)
    }
  }

  async login(request: Request, response: Response) {
    try {} catch (error: unknown) {
      const {message} = error as Error
      response.status(403).send(message)
    }
  }

  async logout(request: Request, response: Response) {
    try {} catch (error: unknown) {
      const {message} = error as Error
      response.status(403).send(message)
    }
  }

  async activate(request: Request<{link: string}>, response: Response) {
    try {
      const {link} = request.params
      await userService.activate(link)
      return response.redirect(process.env.CLIENT_URL as string)
    } catch (error: unknown) {
      const {message} = error as Error
      response.status(403).send(message)
    }
  }

  async refresh(request: Request, response: Response) {
    try {} catch (error: unknown) {
      const {message} = error as Error
      response.status(403).send(message)
    }
  }
}

export default new AuthController()