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
      const initial = user?.email?.charAt(0).toUpperCase() ?? '?'

      return (
            <>
                  <div className='w-[260px] bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden'>
                        {/* Account info */}
                        <Link
                              to={'/customer/account'}
                              className='flex items-center gap-2.5 px-4 py-3.5 border-b border-gray-200  text-text-theme'
                        >
                              <div className='w-[34px] h-[34px] rounded-full bg-indigo-50 flex items-center justify-center shrink-0 text-[13px] font-medium text-indigo-600'>
                                    {initial}
                              </div>
                              <div className='min-w-0 text-color-main font-semibold'>
                                    <p className='text-[11px]  m-0'>Tài khoản</p>
                                    <p className='text-[13px] font-medium mt-0.5 truncate'>{user?.email}</p>
                              </div>
                        </Link>

                        {/* Actions */}
                        <div className='p-1.5'>
                              <Link
                                    to={'/customer/notification'}
                                    className='flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors'
                              >
                                    <Bell size={17} className='text-gray-500' />
                                    <span className='text-[13px] text-gray-900'>Thông báo của tôi</span>
                              </Link>
                              <Link
                                    to={'/customer/order_history'}
                                    className='flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors'
                              >
                                    <ShoppingCart size={17} className='text-gray-500' />
                                    <span className='text-[13px] text-gray-900'>Đơn hàng của tôi</span>
                              </Link>
                        </div>

                        {/* Logout */}
                        <div className='p-1.5 border-t border-gray-200'>
                              <button
                                    onClick={handleLogOut}
                                    className='w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg hover:bg-red-50 transition-colors text-left'
                              >
                                    <LogOut size={17} className='text-red-600' />
                                    <span className='text-[13px] text-red-600'>Đăng xuất</span>
                              </button>
                        </div>
                  </div>
            </>
      )
}

export default HeaderBoxHover
