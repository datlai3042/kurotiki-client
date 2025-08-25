import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { RootState } from '../../../store'
import { doLogout, doOpenBoxLogin } from '../../../Redux/authenticationSlice'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Auth from '../../../apis/auth.api'
import { addToast } from '../../../Redux/toast'
import { UserResponse } from '../../../types/user.type'
import { Bell, LogOut, ShoppingCart, User } from 'lucide-react'

function HeaderBoxHover() {
      const navigate = useNavigate()
      const user = useSelector((state: RootState) => state.authentication.user) as UserResponse
      const dispatch = useDispatch()
      const queryClient = useQueryClient()

      const logoutMutation = useMutation({
            mutationKey: ['logout account'],
            mutationFn: () => Auth.logout(),
            onSuccess: () => {
                  dispatch(doLogout())
                  dispatch(addToast({ type: 'SUCCESS', message: 'Đăng xuất thành công', id: Math.random().toString() }))
                  queryClient.removeQueries({ queryKey: ['v1/api/cart/cart-get-my-cart'] })
                  queryClient.removeQueries({
                        queryKey: ['cart-get-count-product'],
                  })
            },
            onError: (error) => {
                  dispatch(addToast({ type: 'ERROR', message: 'Đăng xuất không thành công', id: Math.random().toString() }))
            },
      })

      const handleLogOut = () => {
            logoutMutation.mutate()
      }

      return (
            <>
                  <ul className=' min-w-[250px] bg-color-section-theme shadow-xl gap-2 border border-[var(--border-color-input)] text-text-theme rounded z-20'>
                        <li className='flex items-center hover:bg-color-main hover:text-[#fff] px-2 py-3'>
                              <Link to={'/customer/account'} className='w-full h-full flex gap-[8px] items-center'>
                                    <User size={20} />
                                    {user ? `Tài khoản: ${user?.fullName || user?.nickName || user.email}` : 'Thông tin tài khoản'}
                              </Link>
                        </li>

                        <li className='flex  items-center hover:bg-color-main hover:text-[#fff] px-2 py-3'>
                              <Link to={'/customer/notification'} className='w-full h-full flex  gap-[8px] items-center'>
                                    <Bell size={20} />
                                    Thông báo của tôi
                              </Link>
                        </li>

                        <li className='flex items-center hover:bg-color-main hover:text-[#fff] px-2 py-3'>
                              <Link to={'/customer/order_history'} className='w-full h-full flex gap-[8px] items-center'>
                                    <ShoppingCart size={20} />
                                    Đơn hàng của tôi
                              </Link>
                        </li>

                        {user && (
                              <li
                                    className='flex gap-[8px] items-center px-2 py-3  hover:bg-color-main hover:text-[#fff] hover:cursor-pointer'
                                    onClick={handleLogOut}
                              >
                                    <LogOut size={20}/>
                                    Đăng xuất
                              </li>
                        )}
                        <p className='thongBao'></p>
                  </ul>
            </>
      )
}

export default HeaderBoxHover
