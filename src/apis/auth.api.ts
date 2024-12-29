import { addToast } from '../Redux/toast'
import { store } from '../store'
import { TResponseApi } from '../types/axiosResponse'
import { UserResponse } from '../types/user.type'
import axiosCustom from './http'

type TAuthParams = {
      email: string
      password: string
}

class Auth {
      static async login({ email, password }: TAuthParams) {
            return axiosCustom.post<TResponseApi<{ user: UserResponse; access_token: string }>>('/v1/api/auth/login', { email, password })
      }

      static async register({ email, password }: TAuthParams) {

            return axiosCustom.post<TResponseApi<{ user: UserResponse; access_token: string }>>('/v1/api/auth/register', {
                  email,
                  password,
            })
      }

      static async logout() {
            return axiosCustom.post('/v1/api/auth/logout')
      }

      static async refresh_token() {
            // store.dispatch(addToast({ type: 'WARNNING', message: 'Đang gọi để lấy lại access_token', id: Math.random().toString() }))
            return axiosCustom.post<{ metadata: { token: string } }>('/v1/api/auth/rf', {})
      }
}

export default Auth
