interface Tokens {
  accessToken: string,
  refreshToken: string
}

type RegistrationResponse = {
  user: UserDto,
  tokens: Tokens
}

interface RegistrationRequest {
  username: string,
  email: string,
  password: string
}