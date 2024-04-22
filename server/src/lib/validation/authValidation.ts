import {object, string, minLength, maxLength, email} from 'valibot'

export const RegistrationScheme = object({
  username: string('the username must be a string', [
    minLength(3, 'the username must be longer than 3'),
    maxLength(18, 'the username must be less than 18')
  ]),
  email: string('the email must be a string', [
    email<string>('the email must be correct'),
    minLength(3, 'the email must be longer than 3'),
    maxLength(45, 'the email must be less than 45'),
  ]),
  password: string('the password must be a string', [
    minLength(5, 'the password must be longer than 5'),
    maxLength(32, 'the password must be longer than 32')
  ])
})

export const LoginScheme = object({
  usernameOrEmail: string('the id must be a string', [
    minLength(3, 'the id must be longer than 3'),
    maxLength(45, 'the id must be less than 45'),
  ]),
  password: string('the password must be a string', [
    minLength(5, 'the password must be longer than 5'),
    maxLength(32, 'the password must be longer than 32')
  ])
})