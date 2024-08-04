import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { RootState } from '../../../store'
import { doLogout, doOpenBoxLogin } from '../../../Redux/authenticationSlice'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Auth from '../../../apis/auth.api'
import { UserResponse } from '../../../types/user.type'
import { addOneToastError, addOneToastSuccess } from '../../../Redux/toast'

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
                  dispatch(
                        addOneToastSuccess({
                              toast_item: {
                                    type: 'SUCCESS',
                                    
                                    core: {
                                          
                                           message: 'Đăng xuất thành công'
                                    },
                                    _id: Math.random().toString(),
                                    toast_title: 'Thành công',
                              },
                        }),
                  )

                
                  queryClient.removeQueries({ queryKey: ['v1/api/cart/cart-get-my-cart'] })
                  queryClient.removeQueries({
                        queryKey: ['cart-get-count-product'],
                  })
            },
            onError: (error) => {
                  dispatch(
                        addOneToastError({
                              toast_item: {
                                    type: 'ERROR',
                                    _id: Math.random().toString(),
                                    core: {
                                          message: 'Đăng xuất thành công'
                                    },
                                    toast_title: 'Đã có lỗi xảy ra',
                              },
                        }),
                  )
            },
      })

      const handleLogOut = () => {
            logoutMutation.mutate()
      }

      return (
            <>
                  <ul className='flex flex-col min-w-[250px] bg-white shadow-xl py-2 gap-2 border border-gray-200 rounded z-20'>
                        <li className='flex items-center h-[35px] hover:bg-[#ccc] px-2'>
                              <Link to={'/customer/account'} className='w-full h-full flex items-center'>
                                    {user ? `Tài khoản: ${user?.fullName || user?.nickName || user.email}` : 'Thông tin tài khoản'}
                              </Link>
                        </li>

                        <li className='flex items-center h-[35px] hover:bg-[#ccc] px-2'>
                              <Link to={'/customer/notification'} className='w-full h-full flex items-center'>
                                    Thông báo của tôi
                              </Link>
                        </li>

                        <li className='flex items-center h-[35px] hover:bg-[#ccc] px-2'>
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
