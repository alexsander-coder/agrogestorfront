import { api } from "./api"

interface LoginDTO {
  email: string
  password: string
}

interface RegisterDTO {
  name: string
  email: string
  password: string
}

interface RecoverDTO {
  email: string
  telefone: string
}

export const AuthService = {

  async login(data: LoginDTO) {

    const response = await api.post("/auth/login", data)

    return response.data

  },

  async register(data: RegisterDTO) {

    const response = await api.post("/auth/register", data)

    return response.data

  },

  async recoverPassword(data: RecoverDTO) {

    const response = await api.post("/auth/recover", data)

    return response.data

  }

}