import { FC, useState } from "react"
import { LoginForm } from "./components/LoginForm"
import { Routes, Route } from "react-router-dom"
import { MainPage } from "./components/MainPage"
import { RegistrationForm } from "./components/RegisterationForm"
import { AuthContext } from "./context"
import { parse } from "valibot"
import { LoginScheme, RegistrationScheme } from "./lib/validation/authValidation"
import AuthService from "./service/AuthService"
import { AxiosResponse } from "axios"

const App: FC = () => {
  const [isAuth, setIsAuth] = useState<boolean>(false)
  const [currentUser, setCurrentUser] = useState<UserDto | null>(null)
  
  async function registration(
    {username, email, password}: RegistrationRequest
  ):Promise<void | Error> {
    try {
      const validData = parse(RegistrationScheme, {username, email, password})
      const response: AxiosResponse<AuthResponse> | Error = await AuthService
        .registration(validData)
      
      localStorage.setItem('accessToken', response.data.tokens.accessToken)
      setIsAuth(true)
      setCurrentUser(response.data.user)
    } catch (error: unknown) {
      console.log(error as Error)
    }
  }

  async function login(usernameOrEmail: string, password: string): Promise<void | Error>  {
    try {
      const validData = parse(LoginScheme, {usernameOrEmail, password})
      const response: AxiosResponse<AuthResponse> | Error = await AuthService
        .login(validData.usernameOrEmail, validData.password)

      localStorage.setItem('accessToken', response.data.tokens.accessToken) 
      setIsAuth(true)
      setCurrentUser(response.data.user)
    } catch (error: unknown) {
      console.log(error as Error)
    }
  }

  async function logout():Promise<void> {
    try {
      await AuthService.logout()
      localStorage.removeItem('accessToken')
      setIsAuth(false)
      setCurrentUser(null)
    } catch (error: unknown) {
      console.log(error as Error)
    }
  }

  return (
    <AuthContext.Provider value={{
      isAuth, user: currentUser, registration, login, logout
    }}>
      <Routes>
        <Route path="/login" element={<LoginForm/>} />
        <Route path="/registration" element={<RegistrationForm/>} />
        <Route path="*" element={<MainPage/>}/>
      </Routes>
    </AuthContext.Provider>
  )
}

export default App
