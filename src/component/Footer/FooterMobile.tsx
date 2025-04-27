import { Select } from 'antd'
import {
      ArrowBigLeft,
      BellDot,
      Home,
      Key,
      Lock,
      LogIn,
      Mail,
      MapPinned,
      NotebookPen,
      ShoppingBag,
      ShoppingCart,
      Store,
      User,
      UserRound,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { RootState } from '../../store'
import { UserResponse } from '../../types/user.type'
import { useMutation } from '@tanstack/react-query'
import Auth from '../../apis/auth.api'
import { doLogout } from '../../Redux/authenticationSlice'
import { addToast } from '../../Redux/toast'
import { createPortal } from 'react-dom'
import { useMediaQuery } from '@mantine/hooks'

interface IProps extends React.HTMLProps<HTMLDivElement> {}

const FooterMobile = ({ ...props }: IProps) => {
      const navigate = useNavigate()
      const [showModalRoute, setShowModalRoute] = useState(false)
      const { pathname } = useLocation()

      useEffect(() => {
            setShowModalRoute(false)
      }, [pathname])
      return (
            <div {...props}>
                  <div className='fixed bottom-0 left-0 right-0 w-full px-[12px] flex justify-between min-h-[45px]   items-center z-[1] border-t-[1px] border-solid border-[var(--border-color-input)] text-text-theme bg-color-section-theme'>
                        <ArrowBigLeft onClick={() => navigate(-1)} />

                        <Link to={'/'}>
                              <Home />
                        </Link>
                        <p className='relative cursor-pointer' onClick={() => setShowModalRoute((prev) => !prev)}>
                              <User />

                              {showModalRoute && <CustomerRouter onClose={() => setShowModalRoute(false)} />}
                        </p>
                  </div>
            </div>
      )
}

const CustomerRouter = ({ onClose }: { onClose: () => void }) => {
      const user = useSelector((state: RootState) => state.authentication.user) as UserResponse
      const dispatch = useDispatch()
      const logoutMutation = useMutation({
            mutationKey: ['logout account'],
            mutationFn: () => Auth.logout(),
            onSuccess: () => {
                  dispatch(doLogout())
                  dispatch(addToast({ type: 'SUCCESS', message: 'Đăng xuất thành công', id: Math.random().toString() }))
            },
            onError: (error) => {
                  dispatch(addToast({ type: 'ERROR', message: 'Đăng xuất không thành công', id: Math.random().toString() }))
            },
      })
      const queryMedia = useMediaQuery(
            '(max-width: 767px)',
            false,

            {
                  getInitialValueInEffect: false,
            },
      )
      const handleLogOut = () => {
            logoutMutation.mutate()
            onClose()
      }

      useEffect(() => {
            if(!queryMedia) {
                  onClose()
            }
      }, [queryMedia])

      useEffect(() => {
            document.body.style.overflow = 'hidden'

            return () => {
                  document.body.style.overflow = 'auto'
            }
      }, [])

      return (
            <>
                  {createPortal(
                        <div
                              onClick={() => onClose()}
                              className='fixed bg-[var(--bg-overlay)] inset-0 flex justify-end  items-end bottom-[43px] z-[9999]'
                        >
                              <div
                                    onClick={(e) => e.stopPropagation()}
                                    className=' w-[75%] m-[8px] rounded-lg  py-[20px] bg-color-section-theme text-text-theme'
                              >
                                    <div
                                          className='ml-[20px] h-[75px] flex items-center gap-[8px] overflow-x-hidden'
                                          title={`Account ${user?.email}` || ''}
                                    >
                                          {user ? (
                                                <>
                                                      <img
                                                            src={user.avatar?.secure_url || user.avatar_url_default || ''}
                                                            alt='user_avatar'
                                                            className='min-w-[30px] lg:min-w-[40px] w-[30px] h-[30px] lg:w-[40px] lg:h-[40px] rounded-full'
                                                      />

                                                      <div className='flex flex-col gap-[1px]'>
                                                            <span>Tài khoản của</span>
                                                            {user && (
                                                                  <span className='truncate w-[170px]'>{`@${
                                                                        user.email.split('@')[0]
                                                                  }`}</span>
                                                            )}
                                                      </div>
                                                </>
                                          ) : (
                                                <div className='flex text-red-700 gap-[15px]'>
                                                      <Lock color='red' />
                                                      <span className='font-bold'>Permission</span>
                                                </div>
                                          )}
                                    </div>
                                    <Link to={'/customer/account'} className={`customer-item-bg flex items-center p-[8px] gap-[24px] `}>
                                          <UserRound style={{ minWidth: 32 }} />
                                          <span>Tài khoản</span>
                                    </Link>

                                    <Link
                                          to={'/customer/notification'}
                                          className={`customer-item-bg flex items-center p-[8px] gap-[24px] `}
                                    >
                                          <BellDot style={{ minWidth: 32 }} />
                                          <span>Thông báo của tôi</span>
                                    </Link>

                                    <Link
                                          to={'/customer/order_history'}
                                          className={`customer-item-bg flex items-center p-[8px] gap-[24px] `}
                                    >
                                          <NotebookPen style={{ minWidth: 32 }} />
                                          <span>Quản lí đơn hàng</span>
                                    </Link>
                                    <Link to={'/customer/shop'} className={`customer-item-bg flex items-center p-[8px] gap-[24px] `}>
                                          <ShoppingCart style={{ minWidth: 32 }} />
                                          <span>Cửa hàng</span>
                                    </Link>
                                    <Link
                                          to={'/customer/register-sell'}
                                          className={`customer-item-bg flex items-center p-[8px] gap-[24px] `}
                                    >
                                          <ShoppingBag style={{ minWidth: 32 }} />
                                          <span>Đăng kí bán sản phẩm</span>
                                    </Link>

                                    {user?.verify_email && (
                                          <Link
                                                to={'/customer/shop/product-list'}
                                                className={`customer-item-bg flex items-center p-[8px] gap-[24px] `}
                                          >
                                                <Store style={{ minWidth: 32 }} />
                                                <span>Sản phẩm của Shop</span>
                                          </Link>
                                    )}
                                    <Link
                                          to={'/customer/shop/product-list'}
                                          className={`customer-item-bg flex items-center p-[8px] gap-[24px] `}
                                    >
                                          <Store style={{ minWidth: 32 }} />
                                          <span>Sản phẩm của Shop</span>
                                    </Link>

                                    <Link
                                          to={'/customer/account/address'}
                                          className={`customer-item-bg flex items-center p-[8px] gap-[24px] `}
                                    >
                                          <MapPinned style={{ minWidth: 32 }} />
                                          <span>Số địa chỉ</span>
                                    </Link>

                                    <Link
                                          to={'/customer/account/update/email'}
                                          className={`customer-item-bg flex items-center p-[8px] gap-[24px] `}
                                    >
                                          <Mail style={{ minWidth: 32 }} />
                                          <span>Cập nhập Email</span>
                                    </Link>

                                    <Link
                                          to={'/customer/account/update/password'}
                                          className={`customer-item-bg flex items-center p-[8px] gap-[24px] `}
                                    >
                                          <Key style={{ minWidth: 32 }} />
                                          <span>Cập nhập mật khẩu</span>
                                    </Link>

                                    <div className={`customer-item-bg flex items-center p-[8px] gap-[24px] `} onClick={handleLogOut}>
                                          <LogIn style={{ minWidth: 32 }} />
                                          <span>Đăng xuất</span>
                                    </div>
                              </div>
                        </div>,
                        document.body,
                  )}
            </>
      )
}

export default FooterMobile
