import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { RootState } from '../../../store'
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
      const count = cartQuery.isSuccess ? cartQuery.data.data.metadata.count || 0 : 0

      return (
            <Link
                  className='group relative flex h-10 items-center gap-2 rounded-lg px-2 text-text-theme transition hover:bg-color-main hover:text-white'
                  to='/cart'
                  aria-label='Giỏ hàng'
            >
                  <span className='relative flex h-8 w-8 items-center justify-center text-[#19325c] dark:text-blue-400'>
                        <ShoppingCart size={22} strokeWidth={1.6} />
                        {count > 0 && (
                              <span className='absolute -right-[3px] -top-[3px] flex h-[16px] min-w-[16px] items-center justify-center rounded-full border-2 border-white bg-[#1677ff] px-[3px] text-[9px] font-bold leading-none text-white dark:border-color-section-theme'>
                                    {count > 99 ? '99+' : count}
                              </span>
                        )}
                  </span>
                  <span className='hidden whitespace-nowrap text-[12px] font-medium xl:inline'>Giỏ hàng</span>
            </Link>
      )
}

export default HeaderCart
