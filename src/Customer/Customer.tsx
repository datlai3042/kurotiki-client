import { memo, useState } from 'react'

//@react router
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'

//@redux-toolkit
import { useSelector } from 'react-redux'
import { RootState } from '../store'

//@components
import CustomerWrapperItem from './Components/CustomerWrapperItem'
import AuthPermission from '../component/Auth/AuthPermission'
import NotFound from '../component/Errors/NotFound'

//@icon
import { BellDot, Key, Lock, Mail, MapPinned, NotebookPen, Plus, ShoppingBag, ShoppingCart, Store } from 'lucide-react'
import { UserRound } from 'lucide-react'
import { UserResponse } from '../types/user.type'
import { useQuery } from '@tanstack/react-query'
import AccountService from '../apis/account.service'
import { Select } from 'antd'
import LeftSide from './Components/LeftSide'

//@const
const link = [
      { path: '/customer/account', text: 'Thông tin tài khoản' },
      { path: '/customer/notification', text: 'Thông báo của tôi' },
      { path: '/customer/order_history', text: 'Quản lí đơn hàng' },
      { path: '/customer/account/update/email', text: 'Cập nhập email' },
      { path: '/customer/account/update/password', text: 'Cập nhập password' },
      { path: '/customer/shop', text: 'Quản lí cửa hàng' },
      { path: '/customer/shop/product-list', text: 'Danh sách sản phẩm' },
      { path: '/customer/register-sell', text: 'Đăng kí bán hàng' },
      { path: '/customer/account/address', text: 'Số địa chỉ' },
      { path: '/customer/account/update/email', text: 'Cập nhập Email' },
      { path: '/customer/account/update/password', text: 'Cập nhập mật khẩu' },
      { path: '/customer/router', text: '' },
]

const select = [
      { value: '/customer/account', label: 'Thông tin tài khoản' },
      { value: '/customer/notification', label: 'Thông báo của tôi' },
      { value: '/customer/order_history', label: 'Quản lí đơn hàng' },
      { value: '/customer/account/update/email', label: 'Cập nhập email' },
      { value: '/customer/account/update/password', label: 'Cập nhập password' },
      { value: '/customer/shop', label: 'Quản lí cửa hàng' },
      { value: '/customer/shop/product-list', label: 'Danh sách sản phẩm' },
      { value: '/customer/register-sell', label: 'Đăng kí bán hàng' },
      { value: '/customer/account/address', label: 'Số địa chỉ' },
]

//@Component
const Customer = () => {
      //@pathname
      let pathName = useLocation()?.pathname
      //@context pathname
      //@connect state redux
      const user = useSelector((state: RootState) => state.authentication.user)
      const auth = Boolean(user)
      const router = useNavigate()
      const getMe = useQuery({
            queryKey: ['getMeQuery'],
            queryFn: () => AccountService.getMeQuery(),
      })
      //@check path
      if (pathName === '/customer') return <NotFound />

      //@filter pathname context
      const textLink = link.find((pathItem) => {
            if (pathName) {
                  if (pathItem.path === pathName) return pathItem
            } else {
                  return <NotFound />
            }
      })

      const isSegmentActive = select.find((se) => se.value === pathName)
      //@element
      return (
            <>
                  <div className=' text-[14px] max-w-[98vw]  w-[1280px] mx-auto min-h-full flex flex-col  pt-[15px] xl:pt-[0px]  pb-[24px] mt-0 '>
                        {/* @header */}

                        {user ? (
                              <div className=' w-full flex gap-[3%] text-[13px]  text-text-theme'>
                                    {/* @navigate pathname */}
                                    <div className='hidden lg:flex flex-col   xl:w-[20%]'>
                                          <div className='hidden lg:block text-[16px] text-[#66666b] p-[20px_0] '>
                                                <Link to={'/'} className='font-bold'>
                                                      Trang chủ
                                                </Link>
                                                <span> {' > '}</span>
                                                <Link className='text-color-main font-bold' to={textLink?.path as string}>
                                                      {textLink?.text}
                                                </Link>
                                          </div>
                                          <LeftSide textLink={textLink} />
                                    </div>
                                    {/*@ Outlet */}

                                    <div className='w-full px-[16px] lg:px-0 lg:w-[75%] flex flex-col flex-1'>
                                          <div className='hidden xl:flex justify-between text-[20px] font-semibold  items-center p-[20px_0]'>
                                                {textLink?.text}

                                               
                                          </div>
                                          {auth ? (
                                                <CustomerWrapperItem>
                                                      <div className='w-full flex flex-col gap-[8px]'>
                                                            <Select
                                                                  value={isSegmentActive?.label || ''}
                                                                  style={{
                                                                        borderRadius: '2px',
                                                                        padding: '0px 6px 0px 6px',
                                                                        height: 35,
                                                                        marginTop: -6,
                                                                  }}
                                                                  className='w-full xl:w-[110px] block md:hidden'
                                                                  options={select}
                                                                  onChange={(value) => {
                                                                        router(value)
                                                                  }}
                                                            />
                                                            <Outlet />
                                                      </div>
                                                </CustomerWrapperItem>
                                          ) : (
                                                <div className='h-[575px] '>
                                                      {getMe.isLoading ? (
                                                            <div className='w-full h-full skeleton__container'></div>
                                                      ) : (
                                                            <AuthPermission />
                                                      )}
                                                </div>
                                          )}
                                    </div>
                              </div>
                        ) : (
                              <div className='flex-1 min-h-[80vh]'>
                                    {getMe.isLoading ? (
                                          <div className='w-full h-full skeleton__container'></div>
                                    ) : (
                                          <div className='h-[80vh]'>
                                                <AuthPermission />
                                          </div>
                                    )}
                              </div>
                        )}
                  </div>
            </>
      )
}

export default memo(Customer)
