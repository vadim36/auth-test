import { User } from "@prisma/client"

export default class UserDto {
  userId: string
  email: string
  isActivated: boolean

  constructor(model: User) {
    this.userId = model.userId
    this.email = model.email
    this.isActivated = model.isActivated
  }
}