import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from './store'

import App from './App'
import { doLogout, doOpenBoxLogin } from './Redux/authenticationSlice'
import TErrorAxios from './types/axios.response.error'
import { checkAxiosError } from './utils/handleAxiosError'
import { addOneToastError } from './Redux/toast'
import ToastProvider from './component/toast/ToastProvider'


const rootELement = document.getElementById('root')
if (!rootELement) throw new Error('Root is invaild')
const root = ReactDOM.createRoot(rootELement)

const client = new QueryClient({
      defaultOptions: {
            queries: {
                  refetchOnWindowFocus: false,
                  retry: 0,
            },
      },
      queryCache: new QueryCache({
            onError: (error) => {
                  if (checkAxiosError<TErrorAxios>(error)) {
                        if (
                              window.location.origin !== 'https://tikiclone-v2024.onrender.com' &&
                              error?.response?.status === 403 &&
                              error?.response.data?.message === 'Forbidden' &&
                              (error?.response.data?.detail === 'Token không đúng' ||
                                    error?.response.data?.detail === 'Phiên đăng nhập hết hạn' ||
                                    error?.response.data?.detail === 'Không tìm thấy tài khoản' ||
                                    error?.response.data?.detail === 'Token đã được sử dụng')
                        ) {
                              store.dispatch(
                                    addOneToastError({
                                          toast_item: {
                                                type: 'ERROR',
                                                core: { message: 'Refresh Token không hợp lệ' },
                                                _id: Math.random().toString(),
                                                toast_title: 'Có lỗi xảy ra'

                                          },
                                    }),
                              )
                              store.dispatch(doOpenBoxLogin())
                              throw error
                        }
                        if (error.response?.status === 401) {
                              if (error.response.data?.detail === 'Đăng nhập thất bại, vui lòng nhập thông tin hợp lệ') {
                                    store.dispatch(
                                          addOneToastError({
                                                toast_item: {
                                                      type: 'ERROR',
                                                      core: { message: error.response.data.detail },
                                                      _id: Math.random().toString(),
                                                      toast_title: 'Có lỗi xảy ra'
                                                },
                                          }),
                                    )
                              }

                              if (error.response.data?.detail === 'Token hết hạn') {
                                    store.dispatch(
                                          addOneToastError({
                                                toast_item: {
                                                      type: 'ERROR',
                                                      core: { message: 'Token hết hạn' },
                                                      _id: Math.random().toString(),
                                                      toast_title: 'Có lỗi xảy ra'
                                                },
                                          }),
                                    )
                              }
                        }
                  }
            },
      }),
      mutationCache: new MutationCache({
            onError: async (error, varibale, context, mutation) => {
                  console.log({ error, mutation, varibale, context })
                  if (checkAxiosError<TErrorAxios>(error)) {
                        console.log({ mute: error })
                        if (
                              error?.response?.status === 403 &&
                              error?.response.data?.message === 'Forbidden' &&
                              (error?.response.data?.detail === 'Token không đúng' ||
                                    error?.response.data?.detail === 'Phiên đăng nhập hết hạn' ||
                                    error?.response.data?.detail === 'Không tìm thấy tài khoản' ||
                                    error?.response.data?.detail === 'Token đã được sử dụng')
                        ) {

                              store.dispatch(
                                    addOneToastError({
                                          toast_item: {
                                                type: 'ERROR',
                                                core: { message: 'Refresh Token không hợp lệ' },
                                                _id: Math.random().toString(),
                                                toast_title: 'Có lỗi xảy ra'

                                          },
                                    }),
                              )
                              store.dispatch(doOpenBoxLogin())
                        }
                        if (error.response?.status === 401) {
                              if (error.response.data?.detail === 'Đăng nhập thất bại, vui lòng nhập thông tin hợp lệ') {
                                    store.dispatch(
                                          addOneToastError({
                                                toast_item: {
                                                      type: 'ERROR',
                                                      core: { message: error.response.data.detail },
                                                      _id: Math.random().toString(),
                                                      toast_title: 'Có lỗi xảy ra'
                                                },
                                          }),
                                    )
                                    return
                              }

                              if (error.response.data?.detail === 'Token hết hạn' && error.response.config.url === 'v1/api/auth/logout') {
                                    store.dispatch(doLogout())
                                    store.dispatch(
                                          addOneToastError({
                                                toast_item: {
                                                      type: 'ERROR',
                                                      core: { message: 'Token hết hạn' },
                                                      _id: Math.random().toString(),
                                                      toast_title: 'Có lỗi xảy ra'
                                                },
                                          }),
                                    )
                              }
                              }
                        }
                  }
            },
      ),
})

root.render(
      <Provider store={store}>
            <BrowserRouter>
                  <QueryClientProvider client={client}>
                        <App />
                        <ToastProvider />
                        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
                  </QueryClientProvider>
            </BrowserRouter>
      </Provider>,
)
