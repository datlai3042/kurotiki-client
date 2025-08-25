import { BellDot, Mail, MapPinned, NotebookPen, ShoppingBag, ShoppingCart, Store, UserRound, Lock, Key } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { RootState } from '../../store'

const LeftSide = ({
      textLink,
}: {
      textLink?:
            | {
                    path: string
                    text: string
              }
            | undefined
}) => {
      const user = useSelector((state: RootState) => state.authentication.user)
      const [_, setSectionActive] = useState('/customer/account')
      const containerRef = useRef<HTMLDivElement | null>(null)

      //@active pathname
      const handleActive = (pathName: string) => {
            setSectionActive(pathName)
      }

      useEffect(() => {
            if (containerRef.current) {
                  const pos = containerRef.current.getBoundingClientRect()
                  const viewportHeight = window.innerHeight
                  const calc = viewportHeight - pos.top
                  containerRef.current.style.height = `${calc - 20}px`
            }
      }, [])

      return (
            <div ref={containerRef} className='sticky mb-[10px] top-[75px] hidden xl:block   text-text-theme'>
                  <div className='h-[75px] flex items-center gap-[8px] overflow-x-hidden' title={`Account ${user?.email}` || ''}>
                        {user ? (
                              <>
                                    <img
                                          src={user.avatar?.secure_url || user.avatar_url_default || ''}
                                          alt='user_avatar'
                                          className='min-w-[30px] lg:min-w-[40px] w-[30px] h-[30px] lg:w-[40px] lg:h-[40px] rounded-full'
                                    />

                                    <div className='flex flex-col gap-[1px]'>
                                          <span>Tài khoản của</span>
                                          {user && <span className='truncate w-[170px]'>{`@${user?.email.split('@')[0]}`}</span>}
                                    </div>
                              </>
                        ) : (
                              <div className='flex text-red-700 gap-[15px]'>
                                    <Lock color='red' />
                                    <span className='font-bold'>Không có quyền truy cập</span>
                              </div>
                        )}
                  </div>
                  <div className='flex flex-col gap-[6px]'>
                        <Link
                              to={'/customer/account'}
                              className={`customer-item-bg flex items-center p-[8px] gap-[24px] ${
                                    textLink?.path === '/customer/account' ? 'isActive' : ''
                              }
`}
                              onClick={(e) => handleActive('/customer/account')}
                        >
                              <UserRound />
                              <span>Thông tin tài khoản</span>
                        </Link>

                        <Link
                              to={'/customer/notification'}
                              className={`customer-item-bg flex items-center p-[8px] gap-[24px] ${
                                    textLink?.path === '/customer/notification' ? 'isActive' : ''
                              }
`}
                              onClick={(e) => handleActive('/customer/notification')}
                        >
                              <BellDot />

                              <span>Thông báo của tôi</span>
                        </Link>

                        <Link
                              to={'/customer/order_history'}
                              className={`customer-item-bg flex items-center p-[8px] gap-[24px] ${
                                    textLink?.path === '/customer/order_history' ? 'isActive' : ''
                              }
`}
                              onClick={(e) => handleActive('/customer/order_history')}
                        >
                              <NotebookPen />

                              <span>Quản lí đơn hàng</span>
                        </Link>

                        <Link
                              to={'/customer/shop'}
                              className={`customer-item-bg flex items-center p-[8px] gap-[24px] ${
                                    textLink?.path === '/customer/shop' ? 'isActive' : ''
                              }
`}
                              onClick={(e) => handleActive('/customer/shop')}
                        >
                              <ShoppingCart />

                              <span>Quản lý của hàng</span>
                        </Link>

                        <Link
                              to={'/customer/register-sell'}
                              className={`customer-item-bg flex items-center p-[8px] gap-[24px] ${
                                    textLink?.path === '/customer/register-sell' ? 'isActive' : ''
                              }
`}
                              onClick={(e) => handleActive('/customer/register-sell')}
                        >
                              <ShoppingBag />

                              <span>Đăng kí bán sản phẩm</span>
                        </Link>

                        {user?.verify_email && (
                              <Link
                                    to={'/customer/shop/product-list'}
                                    className={`customer-item-bg flex items-center p-[8px] gap-[24px] ${
                                          textLink?.path === '/customer/shop/product-list' ? 'isActive' : ''
                                    }
`}
                                    onClick={(e) => handleActive('/customer/shop/product-list')}
                              >
                                    <Store />

                                    <span>Sản phẩm của Shop</span>
                              </Link>
                        )}

                        <Link
                              to={'/customer/account/address'}
                              className={`customer-item-bg flex items-center p-[8px] gap-[24px] ${
                                    textLink?.path === '/customer/account/address' ? 'isActive' : ''
                              }
`}
                              onClick={(e) => handleActive('/customer/account/address')}
                        >
                              <MapPinned />

                              <span>Số địa chỉ</span>
                        </Link>

                        <Link
                              to={'/customer/account/update/email'}
                              className={`customer-item-bg flex items-center p-[8px] gap-[24px] ${
                                    textLink?.path === '/customer/account/update/email' ? 'isActive' : ''
                              }
`}
                              onClick={(e) => handleActive('/customer/account/update/email')}
                        >
                              <Mail />
                              <span>Cập nhập Email</span>
                        </Link>

                        <Link
                              to={'/customer/account/update/password'}
                              className={`customer-item-bg flex items-center p-[8px] gap-[24px] ${
                                    textLink?.path === '/customer/account/update/password' ? 'isActive' : ''
                              }
`}
                              onClick={(e) => handleActive('/customer/account/update/password')}
                        >
                              <Key />
                              <span>Cập nhập mật khẩu</span>
                        </Link>
                  </div>
            </div>
      )
}

export default LeftSide
