import { Request, Response } from "express"
import userService from "../service/userService"
import { config } from "dotenv"
import {Input, parse, ValiError, SchemaIssue, string} from 'valibot'
import {RegistrationScheme, LoginScheme} from '../lib/validation/authValidation'
import ApiError from "../exceptions/apiError"
import prisma from "../database"

config()

export type RegistrationRequest = Input<typeof RegistrationScheme>
type LoginRequest = Input<typeof LoginScheme>

class AuthController {
  async registration(
    request: Request<{}, {}, RegistrationRequest>,
    response: Response<UserResponse | string>,
    next: Function
  ) {
    try {
      const requestingBody: RegistrationRequest = parse(
        RegistrationScheme, {
          username: request.body.username, 
          email: request.body.email, 
          password: request.body.password
        }
      )

      const userData: UserResponse = await userService.registration(requestingBody)
      response.cookie('refreshToken', userData.tokens.refreshToken, {httpOnly: true})
      return response.send(userData)
    } catch (error: unknown) {
      if (error instanceof ValiError) {
        const messages: string[] = error.issues.map((issue: SchemaIssue) => issue.message)
        return next(ApiError.BadRequest('The validation error', messages))
      }
      return next(error as Error)
    }
  }

  async login(
    request: Request<{}, {}, {usernameOrEmail: string, password: string}>, 
    response: Response, 
    next: Function
  ) {
    try {
      const requestingData = parse(LoginScheme, {
        usernameOrEmail: request.body.usernameOrEmail,
        password: request.body.password
      })

      const userData: UserResponse = await userService.login(
        requestingData.usernameOrEmail, requestingData.password
      )
      response.cookie('refreshToken', userData.tokens.refreshToken, {httpOnly: true})
      return response.send(userData)
    } catch (error: unknown) {
      if (error instanceof ValiError) {
        const messages: string[] = error.issues.map((issue: SchemaIssue) => issue.message)
        return next(ApiError.BadRequest('The validation error', messages))
      }
      return next(error as Error)
    }
  }

  async logout(request: Request<{},{},{refreshToken: string}>, response: Response, next: Function) {
    try {
      const refreshToken = parse(string(), request.body.refreshToken)
      await userService.logout(refreshToken)
      response.clearCookie('refreshToken')
      response.status(200).send('ok')
    } catch (error: unknown) {
      if (error instanceof ValiError) {
        const messages: string[] = error.issues.map((issue: SchemaIssue) => issue.message)
        return next(ApiError.BadRequest('The validation error', messages))
      }
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
    try {
      const refreshToken = parse(string(), request.body.refreshToken)
      const userData = await userService.refresh(refreshToken)
      response.cookie('refreshToken', userData.tokens.refreshToken, {httpOnly: true})
      return response.send(userData)
    } catch (error: unknown) {
      next(error as Error)
    }
  }

  async getUsers(request: Request, response: Response, next: Function) {
    try {
      const users = await prisma.user.findMany()
      return response.send(users)
    } catch (error: unknown) {
      return next(error as Error)
    }
  }
}

export default new AuthController()