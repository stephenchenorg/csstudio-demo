// This is based schema, welcome to change it
export interface User {
  id: number
}

export interface SessionUser {
  id: number
}

export interface UserToken {
  token: string
  token_type: string
  expired_at: string
  refresh_expired_at: string
}
