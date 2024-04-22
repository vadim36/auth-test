interface Tokens {
  accessToken: string,
  refreshToken: string
}

type UserResponse = {
  user: UserDto,
  tokens: Tokens
}