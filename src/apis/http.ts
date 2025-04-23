import axios, { AxiosError, type AxiosInstance } from 'axios'
import Auth from './auth.api'
import TErrorAxios from '../types/axios.response.error'
import { store } from '../store'
import { addToast } from '../Redux/toast'

let retry = false
let i = 5
export const REACT_BACK_END_URL = process.env.REACT_APP_MODE === 'DEV' ? 'http://localhost:4001' : 'https://api.kurotiki.io.vn'
let refreshTokenPromise: Promise<any> | null = null // this holds any in-progress token refresh requests
console.log({ REACT_BACK_END_URL, mode: process.env.REACT_APP_MODE, vv: process.env.VERSION })
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
                  (res) => res,
                  async (error) => {
                        const originalRequest = error.config

                        if (
                              error.response?.status === 401 &&
                              error.response?.data.message === 'Unauthorized' &&
                              error.response?.data?.detail === 'Token hết hạn' &&
                              !originalRequest.retry
                        ) {
                              originalRequest.retry = true
                              // store.dispatch(addToast({ type: 'ERROR', message: 'Token hết hạn', id: Math.random().toString() }))
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
                                    // store.dispatch(
                                    //       addToast({
                                    //             type: 'SUCCESS',
                                    //             message: 'Lấy thành công đang tiến hàng call lại api',
                                    //             id: Math.random().toString(),
                                    //       }),
                                    // )
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
