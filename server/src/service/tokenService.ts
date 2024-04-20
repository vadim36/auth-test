import UserDto from "../dto/userDto"
import {config} from 'dotenv'
import {sign} from 'jsonwebtoken'
import prisma from "../database"

config()

class TokenService {
  generateTokens(payload: UserDto):Tokens {
    const accessToken = sign(JSON.stringify(payload), process.env.ACCESS_SECRET as string)
    const refreshToken = sign(JSON.stringify(payload), process.env.REFRESH_SECRET as string)
  
    return {
      accessToken, refreshToken
    }
  }

  async saveTokens(userId: string, refreshToken: string) {
    const candidateToken = await prisma.refreshToken.findUnique({where: {userId}})
    if (candidateToken) {
      return await prisma.refreshToken.update({
        where: { userId },
        data: { tokenData: refreshToken }
      })
    }
    return await prisma.refreshToken.create({
      data: {userId, tokenData: refreshToken }
    })
  }
}

export default new TokenService()