import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { RootState } from '../../../store'
import { doLogout, doOpenBoxLogin } from '../../../Redux/authenticationSlice'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Auth from '../../../apis/auth.api'
import { addToast } from '../../../Redux/toast'
import { UserResponse } from '../../../types/user.type'

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
                  <ul className='flex flex-col min-w-[250px] bg-color-section-theme shadow-xl py-2 gap-2 border border-[var(--border-color-input)] rounded z-20'>
                        <li className='flex items-center h-[35px] hover:bg-color-main px-2'>
                              <Link to={'/customer/account'} className='w-full h-full flex items-center'>
                                    {user ? `Tài khoản: ${user?.fullName || user?.nickName || user.email}` : 'Thông tin tài khoản'}
                              </Link>
                        </li>

                        <li className='flex items-center h-[35px] hover:bg-color-main px-2'>
                              <Link to={'/customer/notification'} className='w-full h-full flex items-center'>
                                    Thông báo của tôi
                              </Link>
                        </li>

                        <li className='flex items-center h-[35px] hover:bg-color-main px-2'>
                              <Link to={'/customer/order_history'} className='w-full h-full flex items-center'>
                                    Đơn hàng của tôi
                              </Link>
                        </li>

                        {user && (
                              <li className='flex items-center h-[35px] px-2 hover:bg-[#ccc] hover:cursor-pointer' onClick={handleLogOut}>
                                    Đăng xuất
                              </li>
                        )}
                        <p className='thongBao'></p>
                  </ul>
            </>
      )
}

export default HeaderBoxHover
