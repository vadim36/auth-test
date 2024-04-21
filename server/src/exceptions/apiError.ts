import { SchemaIssue } from "valibot"

export default class ApiError extends Error {
  constructor (
    public status: number,
    public message: string,
    public errors: (SchemaIssue | string)[] = []
  ) {
    super(message)
  }

  static UnauthtorizedError() {
    return new ApiError(401, 'The user does not auth')
  }

  static BadRequest(message: string, errors: (SchemaIssue | string)[] = []) {
    return new ApiError(400, message, errors)
  }
}