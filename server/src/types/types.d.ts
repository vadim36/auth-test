interface Tokens {
  accessToken: string,
  refreshToken: string
}

type RegistrationResponse = {
  user: UserDto,
  tokens: Tokens
}