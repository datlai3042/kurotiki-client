import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { store } from './store'

import App from './App'
import { PersistGate } from 'redux-persist/integration/react'
import { checkAxiosError } from './utils/handleAxiosError'
import TErrorAxios from './types/axios.response.error'
import { addToast } from './Redux/toast'
import BoxContainerToast from './component/BoxUi/BoxContainerToast'
import { doLogout, doOpenBoxLogin } from './Redux/authenticationSlice'
import ThemeProvider, { ThemeContext } from './component/Context/ThemeContext'

// store.dispatch(addToast({ type: 'ERROR', message: '123', id: '1' }))
// setTimeout(() => {}, 5000)

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
                              // store.dispatch(doOpenBoxLogin())
                              throw error
                        }
                        if (error.response?.status === 401) {
                              if (error.response.data?.detail === 'Đăng nhập thất bại, vui lòng nhập thông tin hợp lệ') {
                                    // store.dispatch(
                                    //       addToast({ type: 'ERROR', message: error.response.data.detail, id: Math.random().toString() }),
                                    // )
                              }

                              if (error.response.data?.detail === 'Token hết hạn') {
                                    // store.dispatch(addToast({ type: 'ERROR', message: 'Token hết hạn', id: Math.random().toString() }))
                              }
                        }
                  }
            },
      }),
      mutationCache: new MutationCache({
            onError: async (error, varibale, context, mutation) => {
                  if (checkAxiosError<TErrorAxios>(error)) {
                        if (
                              error?.response?.status === 403 &&
                              error?.response.data?.message === 'Forbidden' &&
                              (error?.response.data?.detail === 'Token không đúng' ||
                                    error?.response.data?.detail === 'Phiên đăng nhập hết hạn' ||
                                    error?.response.data?.detail === 'Không tìm thấy tài khoản' ||
                                    error?.response.data?.detail === 'Token đã được sử dụng')
                        ) {
                              // store.dispatch(
                              //       addToast({ type: 'ERROR', message: 'Refresh Token không hợp lệ', id: Math.random().toString() }),
                              // )
                              // store.dispatch(doOpenBoxLogin())
                        }
                        if (error.response?.status === 401) {
                              if (error.response.data?.detail === 'Đăng nhập thất bại, vui lòng nhập thông tin hợp lệ') {
                                    // store.dispatch(
                                    //       addToast({ type: 'ERROR', message: error.response.data.detail, id: Math.random().toString() }),
                                    // )
                                    return
                              }

                              if (error.response.data?.detail === 'Token hết hạn' && error.response.config.url === 'v1/api/auth/logout') {
                                    // store.dispatch(doLogout())
                                    // store.dispatch(addToast({ type: 'ERROR', message: 'Token hết hạn', id: Math.random().toString() }))
                              }
                        }
                        if (error.response?.status === 400 && error.response.data) {
                              store.dispatch(addToast({ type: 'ERROR', message: error.response.data.detail, id: Math.random().toString() }))
                              return
                        }
                  }
            },
      }),
})

root.render(
      <Provider store={store}>
            <BrowserRouter>
                  <QueryClientProvider client={client}>
                        <ThemeProvider>
                              <App />
                        </ThemeProvider>
                        <BoxContainerToast />
                        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
                  </QueryClientProvider>
            </BrowserRouter>
      </Provider>,
)
