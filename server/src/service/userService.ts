import {hash} from 'bcrypt'
import { v4 } from "uuid"
import UserDto from "../dto/userDto"
import prisma from "../database"
import tokenService from './tokenService'
import mailService from './mailService'
import { config } from 'dotenv'
import ApiError from '../exceptions/apiError'
import type { RegistrationRequest } from '../controller/authController'

config()

class UserService {
  async registration({username, email, password}: RegistrationRequest):Promise<RegistrationResponse> {
    const candidate = await prisma.user.findUnique({where: { username }})
    if (candidate) throw ApiError.BadRequest('Such user already exist')
    
    const hashPassword = await hash(password, 4) 
    const activationLink = v4()

    const user = await prisma.user.create({
      data: {
        username, email, password: hashPassword, activationLink
      }
    })

    await mailService.sendActivationMail(
      user.email,
      `${process.env.API_URL}/auth/activate/${activationLink}`
    )

    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens(userDto) 
    await tokenService.saveTokens(user.userId, tokens.refreshToken)

    return {user: {...userDto}, tokens}
  }

  async activate(activationLink: string) {
    const user = await prisma.user.findFirst({
      where: {activationLink}
    })
    if (!user) throw ApiError.BadRequest('Such user does not exist')
    await prisma.user.update({
      where: {userId: user.userId},
      data: { isActivated: true }  
    })
  }
}

export default new UserService()