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

interface TAuthContext {
  isAuth: boolean,
  user: UserDto | null,
  registration: (({username, email, password}: RegistrationRequest) => Promise<void | Error>) | null
  login: ((usernameOrEmail: string, password: string) => Promise<void | Error>) | null
  logout: (() => Promise<void | Error>) | null
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