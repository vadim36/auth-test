import { Request, Response } from "express"
import userService from "../service/userService"
import { config } from "dotenv"
import {Input, parse, ValiError} from 'valibot'
import {RegistrationScheme} from '../lib/validation/authValidation'
import ApiError from "../exceptions/apiError"

config()

export type RegistrationRequest = Input<typeof RegistrationScheme>

class AuthController {
  async registration(
    request: Request<{}, {}, RegistrationRequest>,
    response: Response<RegistrationResponse | string>,
    next: Function
  ) {
    try {
      const {username, email, password} = request.body
      const requestingBody: RegistrationRequest = parse(
        RegistrationScheme, {username, email, password}
      )

      const userData: RegistrationResponse = await userService.registration(requestingBody)
      response.cookie('refreshToken', userData.tokens.refreshToken, {httpOnly: true})
      return response.send(userData)
    } catch (error: unknown) {
      if (error instanceof ValiError) {
        console.log(error.issues)
        return next(ApiError.BadRequest('The validation error', [...error.issues]))
      }
      return next(error as Error)
    }
  }

  async login(request: Request, response: Response, next: Function) {
    try {} catch (error: unknown) {
      next(error as Error)
    }
  }

  async logout(request: Request, response: Response, next: Function) {
    try {} catch (error: unknown) {
      next(error as Error)
    }
  }

  async activate(request: Request<{link: string}>, response: Response, next: Function) {
    try {
      const {link} = request.params
      await userService.activate(link)
      return response.redirect(process.env.CLIENT_URL as string)
    } catch (error: unknown) {
      next(error as Error)
    }
  }

  async refresh(request: Request, response: Response, next: Function) {
    try {} catch (error: unknown) {
      next(error as Error)
    }
  }
}

export default new AuthController()