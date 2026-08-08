import React, { useEffect } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { doCloseBoxLogin, doOpenBoxLogin } from '../../../Redux/authSlice'
import { Link, useNavigate } from 'react-router-dom'
import { RootState, store } from '../../../store'
import { useQuery } from '@tanstack/react-query'
import CartService from '../../../apis/cart.service'
import { ShoppingCart } from 'lucide-react'
import { STALE_TIME } from '../../Comment/Comment'

const HeaderCart = () => {
      const user = useSelector((state: RootState) => state.authentication.user)

      const cartQuery = useQuery({
            queryKey: ['cart-get-count-product'],
            queryFn: () => CartService.getCountProductCart(),
            staleTime: STALE_TIME,
            enabled: !!user,
      })

      useEffect(() => {}, [cartQuery.data?.data.metadata.count])

      return (
            <Link
                  className='group relative flex h-10 w-10 items-center justify-center rounded-xl text-blue-600 transition hover:bg-blue-50 dark:hover:bg-blue-500/10'
                  to={'/cart'}
                  aria-label='Giỏ hàng'
            >
                  <ShoppingCart
                        size={21}
                        strokeWidth={1.9}
                        className='transition-transform duration-200 group-hover:scale-105'
                  />

                  {cartQuery.isSuccess && (
                        <div className='absolute right-[1px] top-[1px] flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-color-section-theme bg-red-500 px-1'>
                              <span className='text-[10px] font-bold leading-none text-white'>
                                    {cartQuery.data.data.metadata.count || 0}
                              </span>
                        </div>
                  )}
            </Link>
      )
}

export default HeaderCart