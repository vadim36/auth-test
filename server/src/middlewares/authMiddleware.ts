import { Request, Response } from "express"
import ApiError from "../exceptions/apiError"
import tokenService from "../service/tokenService"
import { JwtPayload } from "jsonwebtoken"

export default async function (
  request: Request,
  response: Response, 
  next: Function
) {
  try {
    const authorizationHeader: string | undefined = request.headers?.authorization
    const accessToken: string | undefined = authorizationHeader?.split(' ')[1]
    const userPayload: JwtPayload | string | null = tokenService
      .validateAccessToken(accessToken ?? '')

    if (!authorizationHeader || !accessToken || !userPayload) {
      next(ApiError.UnauthtorizedError())
    }

    next()
  } catch (error: unknown) {
    next(ApiError.BadRequest((error as Error).message))
  }
}