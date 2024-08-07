import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { fetchUser } from '../../Redux/authenticationSlice'
import { RootState } from '../../store'
import useGetMe from '../../hooks/me/useGetMe'

const pathPrivate = ['/cart']

const AuthenticationContext = () => {
      const dispatch = useDispatch()
      const router = useLocation()

      const user = useSelector((state: RootState) => state.authentication.user)

      const cartRouter = router.pathname.startsWith('/cart')
      const customerRouter = router.pathname.startsWith('/customer')
      const updateProductRouter = router.pathname.startsWith('/product/update')
      const payment = router.pathname.startsWith('/payment')

      const routerAuthentication = cartRouter || customerRouter || updateProductRouter || payment
      const enableAPI = !user && routerAuthentication

      const getMe = useGetMe()

      useEffect(() => {
            if (getMe.isSuccess) {
                  const { user } = getMe.data.data.metadata
                  console.log({ user })
                  dispatch(fetchUser({ user }))
            }

            if (getMe.isError) {
                  console.log({ user: getMe.data?.data.metadata })

                  dispatch(fetchUser({ user: undefined }))
            }
      }, [getMe.isSuccess, getMe.isError, dispatch, getMe.data, router])

      return <></>
}

export default AuthenticationContext
