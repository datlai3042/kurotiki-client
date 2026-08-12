import {
      BellDot,
      Mail,
      MapPinned,
      NotebookPen,
      ShoppingBag,
      ShoppingCart,
      Store,
      UserRound,
      Lock,
      Key,
      Crown,
      Bell,
      Box,
      LockKeyhole,
      MapPin,
      Package,
      Tag,
      ChevronDown,
      User,
      ChevronRight,
} from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { RootState } from '../../store'
import ShopAnalysis from '../Shop/ShopAnalysis'

const LeftSide = ({
      textLink,
}: {
      textLink?:
            | {
                    path: string
                    text: string
                    component?: React.ReactNode
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
      const location = useLocation()

      const menuItems = [
            {
                  label: 'Thông tin tài khoản',
                  path: '/customer/account',
                  icon: <User size={18} />,
            },
            {
                  label: 'Thông báo của tôi',
                  path: '/customer/notification',
                  icon: <Bell size={18} />,
            },
            {
                  label: 'Quản lí đơn hàng',
                  path: '/customer/order_history',
                  icon: <Package size={18} />,
            },
            {
                  label: 'Quản lý cửa hàng',
                  path: '/customer/shop',
                  icon: <Store size={18} />,
                  children: [
                        {
                              label: 'Top lượt bán',
                              path: '/customer/shop/top-buy',
                              icon: <Tag size={15} />,
                        },
                        {
                              label: 'Top lượt xem',
                              path: '/customer/shop/top-view',
                              icon: <Tag size={15} />,
                        },
                        {
                              label: 'Top bình luận',
                              path: '/customer/shop/top-comment',
                              icon: <Tag size={15} />,
                        },
                  ],
            },
            {
                  label: 'Đăng kí bán sản phẩm',
                  path: '/customer/register-sell',
                  icon: <Tag size={18} />,
            },

            ...(user?.verify_email
                  ? [
                          {
                                label: 'Sản phẩm của Shop',
                                path: '/customer/shop/product-list',
                                icon: <Box size={18} />,
                          },
                    ]
                  : []),

            {
                  label: 'Số địa chỉ',
                  path: '/customer/account/address',
                  icon: <MapPin size={18} />,
            },
            {
                  label: 'Cập nhập Email',
                  path: '/customer/account/update/email',
                  icon: <Mail size={18} />,
            },
            {
                  label: 'Cập nhập mật khẩu',
                  path: '/customer/account/update/password',
                  icon: <LockKeyhole size={18} />,
            },
      ]

      const isActive = (path: string) => location.pathname === path
      return (
            <div className='sticky mb-[10px] py-[20px] top-[75px] hidden xl:block   text-text-theme'>
                  <div className=' flex items-center gap-[12px] overflow-x-hidden' title={`Account ${user?.email}` || ''}>
                        {user ? (
                              <>
                                    <div className='w-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-[16px_16px_0px_0px] p-[16px] text-white'>
                                          <div className='flex items-center gap-3'>
                                                <div className='w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold border-2 border-white/40'>
                                                      <img
                                                            src={user.avatar?.secure_url || user.avatar_url_default || ''}
                                                            alt='user_avatar'
                                                            className='min-w-[30px] lg:min-w-[40px] w-[30px] h-[30px] lg:w-[40px] lg:h-[40px] rounded-full'
                                                      />
                                                </div>
                                                <div className='flex flex-col gap-[2px]'>
                                                      <p className='text-xs text-blue-100'>Tài khoản của</p>
                                                      <p className='font-semibold'>
                                                            {user && (
                                                                  <span className='truncate w-[170px]'>{`@${user?.email.split(
                                                                        '@',
                                                                  )[0]}`}</span>
                                                            )}
                                                      </p>
                                                      <span className='inline-flex items-center gap-1 bg-white/20 text-xs px-2 py-0.5 rounded-full mt-1'>
                                                            Thành viên <Crown size={12} />
                                                      </span>
                                                </div>
                                          </div>
                                    </div>
                              </>
                        ) : (
                              <div className='flex text-red-700 gap-[15px]'>
                                    <Lock color='red' />
                                    <span className='font-bold'>Không có quyền truy cập</span>
                              </div>
                        )}
                  </div>
                  <div className='bg-gradient-to-br from-blue-500 to-blue-600 rounded-[0px_0px_16px_16px]'>
                        <nav className='overflow-hidden flex flex-col p-[10px] rounded-2xl border border-[var(--border-color-input)] bg-color-section-theme shadow-sm'>
                              <ul className='p-2 flex flex-col gap-2'>
                                    {menuItems.map((item) => {
                                          const active = isActive(item.path)

                                          return (
                                                <li key={item.path}>
                                                      <Link
                                                            to={item.path}
                                                            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition-all ${
                                                                  active
                                                                        ? 'bg-blue-50 font-medium text-blue-600'
                                                                        : ' hover:bg-gray-50 text-text-theme hover:text-blue-600'
                                                            }`}
                                                      >
                                                            <span
                                                                  className={`flex shrink-0 items-center ${
                                                                        active
                                                                              ? 'text-blue-600 dark:text-[#60A5FA]'
                                                                              : ''
                                                                  }`}
                                                            >
                                                                  {item.icon}
                                                            </span>

                                                            <span className='flex-1 '>{item.label}</span>

                                                            {item.children && (
                                                                  <ChevronDown
                                                                        size={16}
                                                                        className={`transition-transform ${
                                                                              active
                                                                                    ? 'rotate-180 text-blue-500 dark:text-[#60A5FA]'
                                                                                    : 'text-text-theme hover:text-blue-600'
                                                                        }`}
                                                                  />
                                                            )}
                                                      </Link>

                                                      {item.children && (
                                                            <ul className='ml-8 border-l border-[var(--border-color-input)] py-1'>
                                                                  {item.children.map((child) => {
                                                                        const childActive = isActive(child.path)

                                                                        return (
                                                                              <li key={child.path}>
                                                                                    <Link
                                                                                          to={child.path}
                                                                                          className={`flex w-full items-center gap-2 rounded-r-lg px-3 py-2.5 text-sm transition-colors ${
                                                                                                childActive
                                                                                                      ? 'bg-blue-50 font-medium text-blue-600'
                                                                                                      : 'text-text-theme  hover:text-blue-600    '
                                                                                          }`}
                                                                                    >
                                                                                          <span
                                                                                                className={`h-1.5 w-1.5 rounded-full ${
                                                                                                      childActive
                                                                                                            ? 'bg-blue-500'
                                                                                                            : 'bg-gray-300'
                                                                                                }`}
                                                                                          />

                                                                                          <span
                                                                                                className={
                                                                                                      childActive
                                                                                                            ? 'text-blue-500 dark:text-[#60A5FA]'
                                                                                                            : ''
                                                                                                }
                                                                                          >
                                                                                                {child.icon}
                                                                                          </span>

                                                                                          <span>{child.label}</span>
                                                                                    </Link>
                                                                              </li>
                                                                        )
                                                                  })}
                                                            </ul>
                                                      )}
                                                </li>
                                          )
                                    })}
                              </ul>
                        </nav>
                  </div>
                  <div className='mt-5 bg-blue-50 relative rounded-2xl p-4 border border-blue-100'>
                        <p className='font-semibold text-gray-800 text-sm mb-1'>Bạn cần hỗ trợ?</p>
                        <p className='text-xs text-gray-500 mb-3 leading-relaxed w-[60%]'>Đội ngũ Tiki luôn sẵn sàng giúp bạn 24/7</p>
                        <button className='flex items-center gap-1 bg-white border border-blue-200 text-blue-600 text-xs font-medium px-3 py-2 rounded-lg hover:bg-blue-100'>
                              Liên hệ ngay <ChevronRight size={14} />
                        </button>
                        <div className='flex justify-end absolute bottom-[-40px] right-[-20px] w-[150px] h-[170px]'>
                              <img src={'/support-headset.png'} alt='Bảo mật tài khoản' className='w-full' draggable={false} />
                        </div>
                  </div>
            </div>
      )
}

export default LeftSide
