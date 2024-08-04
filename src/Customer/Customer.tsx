import { memo, useState } from 'react'

//@react router
import { Link, Outlet, useLocation, useNavigate, useRoutes } from 'react-router-dom'

//@redux-toolkit
import { useSelector } from 'react-redux'
import { RootState } from '../store'

//@components
import CustomerWrapperItem from './Components/CustomerWrapperItem'
import AuthPermission from '../component/Auth/AuthPermission'
import NotFound from '../component/Errors/NotFound'

//@icon
import { BellDot, Key, Lock, Mail, MapPinned, NotebookPen, ShoppingBag, ShoppingCart, Store } from 'lucide-react'
import { UserRound } from 'lucide-react'
import { UserResponse } from '../types/user.type'

//@const
const link = [
      { path: '/customer/account', text: 'Thông tin tài khoản' },
      { path: '/customer/notification', text: 'Thông báo của tôi' },
      { path: '/customer/order_history', text: 'Quản lí đơn hàng' },
      { path: '/customer/account/update/email', text: 'Cập nhập email' },
      { path: '/customer/account/update/password', text: 'Cập nhập password' },
      { path: '/customer/shop', text: 'Shops' },
      { path: '/customer/shop/product-list', text: 'Danh sách sản phẩm' },
      { path: '/customer/register-sell', text: 'Đăng kí bán hàng' },
      { path: '/customer/account/address', text: 'Số địa chỉ' },
      { path: '/customer/account/update/email', text: 'Cập nhập Email' },
      { path: '/customer/account/update/password', text: 'Cập nhập mật khẩu' },
      { path: '/customer/router', text: '' },
]

//@Component
const Customer = () => {
      //@pathname
      let pathName = useLocation()?.pathname
      //@context pathname
      const [_, setSectionActive] = useState('/customer/account')
      //@connect state redux
      const user = useSelector((state: RootState) => state.authentication.user)
      const isLoading = useSelector((state: RootState) => state.authentication.isLoading)

      const auth = Boolean(user)

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

      //@active pathname
      const handleActive = (pathName: string) => {
            setSectionActive(pathName)
      }


      if(isLoading) return null


      //@element
      return (
            <>
                  <div className='px-[14px] text-[14px] w-full min-h-full flex flex-col gap-[20px]  pt-[15px] xl:pt-[0px] mt-0 xl:mt-[10px]'>
                        {/* @header */}
                        <div className='hidden lg:block mb-[1px]'>
                              <Link to={'/'}>Trang chủ</Link>
                              <span> {' > '}</span>
                              <Link className='' to={textLink?.path as string}>
                                    {textLink?.text}
                              </Link>
                        </div>

                        {user ? (
                              <div className=' w-full flex gap-[1%] min-h-[450px]  h-[auto] '>
                                    {/* @navigate pathname */}
                                    <div className='sticky top-0 hidden xl:block h-screen  xl:w-[24%]'>
                                          <div
                                                className='h-[75px] flex items-center gap-[8px] overflow-x-hidden'
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
                                                                        <span className='truncate w-[170px]'>{`@${user?.email.split(
                                                                              '@',
                                                                        )[0]}`}</span>
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
                                          <Link
                                                to={'/customer/account'}
                                                className={`customer-item-bg flex items-center p-[8px] gap-[24px] ${
                                                      textLink?.path === '/customer/account' ? 'isActive' : ''
                                                }
`}
                                                onClick={(e) => handleActive('/customer/account')}
                                          >
                                                <UserRound />
                                                <span>Account</span>
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

                                                <span>Shop</span>
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

                                    {/*@ Outlet */}
                                    <div className='w-full xl:w-[75%]'>
                                          <div className='hidden xl:flex h-[36px] m-[20px_0px_6px_0px] text-[20px]  items-center'>
                                                {textLink?.text}
                                          </div>
                                          {auth ? (
                                                <CustomerWrapperItem>
                                                      <Outlet />
                                                </CustomerWrapperItem>
                                          ) : (
                                                <AuthPermission />
                                          )}
                                    </div>
                              </div>
                        ) : (
                              <AuthPermission />
                        )}
                  </div>
            </>
      )
}

export default memo(Customer)
