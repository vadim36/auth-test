import {ChangeEvent, FC, useState} from 'react'
import { Link } from 'react-router-dom'

export const RegistrationForm:FC = () => {
  const [formData, setFormData] = useState<RegistrationRequest>({
    username: '',
    email: '',
    password: ''
  })
  
  return (
    <form>
      <input type="text" placeholder='Username...' 
        value={formData.username} 
        onChange={(event: ChangeEvent<HTMLInputElement>) => setFormData({
          ...formData,
          username: event.target.value
        })}
      />
      <input type="text" placeholder='Email...'
        value={formData.email} 
        onChange={(event: ChangeEvent<HTMLInputElement>) => setFormData({
          ...formData,
          email: event.target.value
        })}
      />
      <input type="password" placeholder='Password...'
        value={formData.password} 
        onChange={(event: ChangeEvent<HTMLInputElement>) => setFormData({
          ...formData,
          password: event.target.value
        })}
      />
      <button>Submit</button>
      Or you already have an account?
      <button>
        <Link to="/login">Login</Link>
      </button>
    </form>
  )
}