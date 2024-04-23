import { createContext } from "react"

export const AuthContext = createContext<TAuthContext>({
  isAuth: false,
  user: null,
  registration: null,
  login: null,
  logout: null
})