import $api from "../http";

export default class UserService {
  async getUsers():Promise<IUser[]> {
    return $api.get('/users')
  }
}