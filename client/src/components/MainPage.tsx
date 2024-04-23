import {FC} from 'react'
import { Link } from 'react-router-dom'

export const MainPage:FC = () => {
  return (
    <div>
      Home
      Aren't you auth?
      <br/>
      <button>
        <Link to="/registration">Login</Link>
      </button>
    </div>
  )
}