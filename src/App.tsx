import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import AuthWrapper from './component/Auth/AuthWrapper'
import AuthenticationContext from './component/Context/AuthenticationContext'
import FooterMobile from './component/Footer/FooterMobile'
import ScrollToAnchor from './component/Header/Components/ScrollArchor'
import RouterController from './component/Routes/RouterController'
import './index.css'
import './overrider.antd.css'
import { RootState } from './store'
import { useQuery } from '@tanstack/react-query'
import AccountService from './apis/account.service'
import { fetchUser } from './Redux/authenticationSlice'
import { SocketProvider } from './Socket/Socket.provider'
function App() {
      const boxLogin = useSelector((state: RootState) => state.auth.isOpenBoxLogin)
      const [, setShowBoxAuth] = useState(true)
      const location = useLocation().pathname

      useEffect(() => {
            window.scrollTo({
                  top: 0,
                  left: 0,
            })
      }, [location])

      useEffect(() => {}, [boxLogin])
      const dispatch = useDispatch()
      const router = useLocation()
      

      const user = useSelector((state: RootState) => state.authentication.user)
      const cartRouter = router.pathname.startsWith('/cart')
      const customerRouter = router.pathname.startsWith('/customer')
      const updateProductRouter = router.pathname.startsWith('/product/update')
      const payment = router.pathname.startsWith('/payment')

      const routerAuthentication = cartRouter || customerRouter || updateProductRouter || payment
      const enableAPI = routerAuthentication

      const getMe = useQuery({
            queryKey: ['getMeQuery'],
            queryFn: () => AccountService.getMeQuery(),
      })

      useEffect(() => {
            if (getMe.isSuccess) {
                  const { user } = getMe.data.data.metadata
                  dispatch(fetchUser({ user }))
            }

            if (getMe.isError) {
                  dispatch(fetchUser({ user: undefined }))
            }
      }, [getMe.isSuccess, getMe.isError, dispatch, getMe.data, router])
      return (
            <div className=' min-h-screen  w-full min-w-full bg-color-gap-empty '>
                  <div id='main w-full ' className='min-h-screen flex flex-col'>
                        <SocketProvider>
                              <AuthenticationContext />
                              <RouterController />
                              <FooterMobile className='block lg:hidden' />
                              <ScrollToAnchor />
                        </SocketProvider>
                  </div>

                  {boxLogin && <AuthWrapper setShowBoxAuth={setShowBoxAuth} />}
            </div>
      )
}

export default App
