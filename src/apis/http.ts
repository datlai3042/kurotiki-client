import axios, { type AxiosInstance } from 'axios'
import { store } from '../store'
import Auth from './auth.api'
import { addOneToastError, addOneToastSuccess } from '../Redux/toast'
import { url } from 'inspector'

let retry = false
let i = 5
const routerAuth = ['/v1/api/auth/login', '/v1/api/auth/register']
export const REACT_BACK_END_URL = process.env.REACT_APP_MODE === 'DEV' ? process.env.REACT_APP_BASE_URL_LOCAL : 'https://backendtiki.onrender.com'
let refreshTokenPromise: Promise<any> | null = null // this holds any in-progress token refresh requests
class AxiosCustom {
      instance: AxiosInstance

      constructor() {
            this.instance = axios.create({
                  baseURL: REACT_BACK_END_URL,
                  headers: {
                        'Content-Type': 'application/json',
                  },
                  withCredentials: true,
            })

            //request

            this.instance.interceptors.request.use(
                  (config) => {
                        return config
                  },
                  (error) => Promise.reject(error),
            )

            //response
            this.instance.interceptors.response.use(
                  (res) => {
                        if (routerAuth.includes(res.config.url as string)) {
                              localStorage.setItem('isLogin', 'true')
                        }
                        if (res.config.url === '/v1/api/auth/logout') {
                              localStorage.removeItem('isLogin')
                        }
                        return res
                  },
                  async (error) => {
                        const originalRequest = error.config

                        if (
                              error.response?.status === 401 &&
                              error.response?.data.message === 'Unauthorized' &&
                              error.response?.data?.detail === 'Token hết hạn' &&
                              !originalRequest.retry
                        ) {
                              originalRequest.retry = true
                              store.dispatch(
                                    addOneToastError({
                                          toast_item: {
                                                type: 'ERROR',
                                                core: { message: 'Token hết hạn' },
                                                _id: Math.random().toString(),
                                                toast_title: 'Có lỗi xảy ra',
                                          },
                                    }),
                              )
                              if (!refreshTokenPromise) {
                                    refreshTokenPromise = refreshTokenPromise
                                          ? refreshTokenPromise
                                          : Auth.refresh_token()
                                                  .catch((e) => {
                                                        throw e
                                                  })
                                                  .finally(() => (refreshTokenPromise = null))
                              }
                              return refreshTokenPromise!.then((data: any) => {
                                    store.dispatch(
                                          addOneToastSuccess({
                                                toast_item: {
                                                      type: 'SUCCESS',
                                                      core: { message: 'Xác thực thành công, tiến hành gọi lại api' },
                                                      _id: Math.random().toString(),
                                                      toast_title: 'Xử lí thành công',
                                                },
                                          }),
                                    )

                                    if (
                                          error.response.config.url === 'v1/api/account/update-avatar' ||
                                          error.response.config.url === 'v1/api/product/upload-product-thumb' ||
                                          error.response.config.url === 'v1/api/product/upload-product-images-full' ||
                                          error.response.config.url === 'v1/api/product/update-product-thumb' ||
                                          error.response.config.url === 'v1/api/product/update-product-images-full' ||
                                          error.response.config.url === 'v1/api/shop/upload-avatar-shop' ||
                                          error.response.config.url === 'v1/api/product/upload-product-description-image-one' ||
                                          error.response.config.url === 'v1/api/product/delete-product-description-image-one' ||
                                          error.response.config.url === 'v1/api/shop/register-shop'
                                    ) {
                                          error.config.headers['Content-Type'] = 'multipart/form-data'
                                          error.config.timeout = 20000
                                    }
                                    return this.instance(error.response.config)
                              })
                        }

                        return Promise.reject(error)
                  },
            )
      }
}

const axiosCustom = new AxiosCustom().instance

export default axiosCustom
