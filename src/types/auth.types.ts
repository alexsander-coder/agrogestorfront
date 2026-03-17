export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface RecoverPasswordRequest {
  email: string
  telefone: string
}

export interface AuthResponse {
  access_token: string
  user: {
    id: string
    name: string
    email: string
  }
}

export interface JwtPayload {

  sub: string
  name: string
  email: string
  role: "ADMIN" | "USER"

  iat: number
  exp: number

}

export interface AuthSession {

  token: string
  user: JwtPayload

}