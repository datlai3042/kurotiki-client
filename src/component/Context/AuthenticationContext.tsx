import React, { useEffect } from 'react'
import Payment from '../../pages/payment/Payment'
import Cart from '../Cart/Cart'
import { Route, Routes, useLocation } from 'react-router-dom'
import Customer from '../../Customer/Customer'
import CustomerAccount from '../../Customer/Components/CustomerAccount'
import CustomerUpdateEmail from '../../Customer/Account/Update/CustomerUpdateEmail'
import CustomerUpdatePassword from '../../Customer/Account/Update/CustomerUpdatePassword'
import CustomerNotification from '../../Customer/Components/CustomerNotification'
import CustomerOrderHistory from '../../Customer/Components/CustomerOrderHistory'
import ShopWrapper from '../../Customer/Shop/ShopWrapper'
import ShopProductList from '../../Customer/Shop/ShopProductList'
import CustomerUserAddress from '../../Customer/UserAddress/CustomerUserAddress'
import RegisterSell from '../../Customer/Sell/RegisterSell'
import CustomerRouter from '../../Customer/Components/CustomerRouter'
import PermisionProductUpdate from '../../Customer/Sell/Category/Book/PermissionProductUpdate'
import QueryParams from '../../QueryParams'
import { useQuery } from '@tanstack/react-query'
import AccountService from '../../apis/account.service'
import { fetchUser } from '../../Redux/authenticationSlice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'

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
      const enableAPI = routerAuthentication

      const getMe = useQuery({
            queryKey: ['getMeQuery'],
            queryFn: () => AccountService.getMeQuery(),
            enabled: enableAPI
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

      return <></>
}

export default AuthenticationContext
