import {FC} from 'react'
import { Link } from 'react-router-dom'

export const LoginForm: FC = () => {
  
  
  return (
    <form>
      <input type="text" placeholder='Username/Email...'/>
      <input type="password" placeholder='Password...'/>
      <button>Submit</button>
      Or you already don't have an account?
      <button>
        <Link to="/registration">Registration</Link>
      </button>
    </form>
  )
}