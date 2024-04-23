interface AuthResponse {
  user: UserDto,
  tokens: Tokens
}

interface IUser extends UserDto {
  username: string,
  password: string,
  activationLink: string,
  role: string
}

interface RegistrationRequest {
  username: string,
  email: string,
  password: string
}

interface UserDto {
  userId: string,
  email: string
  isActivated: boolean
}

interface Tokens {
  accessToken: string,
  refreshToken: string
}