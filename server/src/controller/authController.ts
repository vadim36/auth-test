import { Request, Response } from "express"
import { User } from "@prisma/client"
import prisma from "../database"
import {hash} from 'bcrypt'
import { v4 } from "uuid"
import {sign} from 'jsonwebtoken'
import UserDto from "../dto/userDto"
import { config } from "dotenv"

config()

interface Tokens {
  accessToken: string,
  refreshToken: string
}

class AuthController {
  async registration(
    request: Request<{}, {}, User>, 
    response: Response<{ user: UserDto, tokens: Tokens} | string>
  ) {
    try {
      const {username, email, password} = request.body
      
      const candidate = await prisma.user.findUnique({where: { username }})
      if (candidate) throw new Error('Such user already exist')
      
      const hashPassword = await hash(password, 4) 
      const activationLink = v4()

      const user = await prisma.user.create({
        data: {
          username, email, password: hashPassword, activationLink
        }
      })

      const userDto = new UserDto(user)
      const accessToken = sign(JSON.stringify(userDto), process.env.ACCESS_SECRET as string)
      const refreshToken = sign(JSON.stringify(userDto), process.env.REFRESH_SECRET as string)

      const candidateToken = await prisma.refreshToken.findUnique({
        where: {userId: user.userId}
      })
      if (candidateToken) {
        await prisma.refreshToken.update({
          where: {userId: user.userId},
          data: {tokenData: refreshToken}
        })
      } 
      await prisma.refreshToken.create({ data: 
        {userId: user.userId, tokenData: refreshToken}
      })

      const tokens = {
        accessToken, refreshToken
      }

      response.send({user: {...userDto}, tokens})
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

  async activate(request: Request, response: Response) {
    try {} catch (error: unknown) {
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