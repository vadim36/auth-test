import {hash} from 'bcrypt'
import { v4 } from "uuid"
import UserDto from "../dto/userDto"
import prisma from "../database"
import tokenService from './tokenService'

class UserService {
  async registration({username, email, password}: RegistrationRequest):Promise<RegistrationResponse> {
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
    const tokens = tokenService.generateTokens(userDto) 
    await tokenService.saveTokens(user.userId, tokens.refreshToken)

    return {user: {...userDto}, tokens}
  }
}

export default new UserService()