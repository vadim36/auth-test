import { AxiosResponse } from "axios";
import $api from "../http";

export default class AuthService {
  async registration({
    username, email, password
  }: RegistrationRequest):Promise<AxiosResponse<AuthResponse>> {
    return await $api.post('/registration', { username, email, password })
  }

  async login(
    usernameOrEmail: string, password: string
  ):Promise<AxiosResponse<AuthResponse>> {
    return await $api.post('/login', {usernameOrEmail, password})
  }

  async logout():Promise<void> {
    return await $api.post('/logout')
  }
}