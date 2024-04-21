import { Request, Response } from "express"
import ApiError from "../exceptions/apiError"

export default function (
  error: Error, request: Request, response: Response, next: Function
) {
  console.log(error)
  if (error instanceof ApiError) {
    return response.status(error.status).json({
      message: error.message,
      errors: error.errors
    })
  }
  return response.status(500).send('Unexpected error')
}