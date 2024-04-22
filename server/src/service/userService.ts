import {hash, compare} from 'bcrypt'
import { v4 } from "uuid"
import UserDto from "../dto/userDto"
import prisma from "../database"
import tokenService from './tokenService'
import mailService from './mailService'
import { config } from 'dotenv'
import ApiError from '../exceptions/apiError'
import type { RegistrationRequest } from '../controller/authController'
import { RefreshToken, User } from '@prisma/client'

config()

class UserService {
  async registration({username, email, password}: RegistrationRequest):Promise<UserResponse> {
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

  async login(usernameOrEmail: string, password: string):Promise<UserResponse>  {
    const candidate = await prisma.user.findFirst({
      where: { 
        OR: [
          {username: usernameOrEmail},
          {email: usernameOrEmail}
        ]
      }
    })

    if (!candidate) throw ApiError.BadRequest('Such user does not exist')
    const isPasswordEquals:boolean = await compare(password, candidate.password)
    if (!isPasswordEquals) throw ApiError.BadRequest('The passwords do not equal')
    
    const userDto = new UserDto(candidate)
    const tokens: Tokens = tokenService.generateTokens(userDto)
    await tokenService.saveTokens(userDto.userId, tokens.refreshToken)

    return {user: userDto, tokens}
  }

  async logout(refreshToken: string):Promise<RefreshToken> {
    const candidateToken = await prisma.refreshToken.findUnique({
      where: {tokenData: refreshToken}
    })
    if (!candidateToken) throw ApiError.BadRequest('Such user does not exist')
    return await tokenService.removeToken(candidateToken.tokenData)
  }

  async activate(activationLink: string):Promise<User | ApiError> {
    const user = await prisma.user.findFirst({
      where: {activationLink}
    })
    if (!user) throw ApiError.BadRequest('Such user does not exist')
    return await prisma.user.update({
      where: {userId: user.userId},
      data: { isActivated: true }  
    })
  }

  async refresh(refreshToken: string):Promise<UserResponse> {
    if (!refreshToken) throw ApiError.UnauthtorizedError()
    const userPayload = tokenService.validateRefreshToken(refreshToken)
    const tokenFromDb = await tokenService.findToken(refreshToken)
    if (!userPayload || !tokenFromDb) throw ApiError.UnauthtorizedError()
    
    const user = await prisma.user.findUnique({where: {userId: tokenFromDb.userId}})
    const userDto = new UserDto(user!)
    
    const tokens: Tokens = tokenService.generateTokens(userDto)
    await tokenService.saveTokens(userDto.userId, tokens.refreshToken)
    return {user: userDto, tokens}
  }
}

export default new UserService()