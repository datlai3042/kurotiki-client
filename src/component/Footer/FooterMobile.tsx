import { useMutation } from '@tanstack/react-query'
import { useMediaQuery } from '@mantine/hooks'
import {
      Bell,
      ChevronRight,
      Grid2X2,
      Home,
      KeyRound,
      LogOut,
      Mail,
      MapPin,
      NotebookPen,
      PackagePlus,
      Store,
      UserRound,
      X,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import Auth from '../../apis/auth.api'
import { doLogout } from '../../Redux/authenticationSlice'
import { addToast } from '../../Redux/toast'
import { RootState } from '../../store'
import { UserResponse } from '../../types/user.type'

interface IProps extends React.HTMLProps<HTMLDivElement> {}

type NavItemProps = {
      to?: string
      active?: boolean
      label: string
      icon: React.ReactNode
      onClick?: () => void
      badge?: string | number
}

const NavItem = ({ to, active, label, icon, onClick, badge }: NavItemProps) => {
      const content = (
            <>
                  <span
                        className={`relative flex h-6 w-6 items-center justify-center transition-colors ${
                              active ? 'text-[#1677ff]' : 'text-slate-500 dark:text-slate-400'
                        }`}
                  >
                        {icon}

                        {badge !== undefined && badge !== null && (
                              <span className='absolute -right-3 -top-2 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold leading-none text-white ring-2 ring-white dark:ring-[#11161d]'>
                                    {badge}
                              </span>
                        )}
                  </span>

                  <span
                        className={`mt-1 text-[10px] font-medium leading-none transition-colors ${
                              active ? 'text-[#1677ff]' : 'text-slate-600 dark:text-slate-400'
                        }`}
                  >
                        {label}
                  </span>

                  <span
                        className={`absolute bottom-0 h-[2px] w-6 rounded-full bg-[#1677ff] transition-opacity ${
                              active ? 'opacity-100' : 'opacity-0'
                        }`}
                  />
            </>
      )

      const className =
            'relative flex min-w-0 flex-1 flex-col items-center justify-center py-2.5 active:scale-[0.97] transition-transform'

      if (to) {
            return (
                  <Link to={to} className={className}>
                        {content}
                  </Link>
            )
      }

      return (
            <button type='button' onClick={onClick} className={className}>
                  {content}
            </button>
      )
}

const FooterMobile = ({ ...props }: IProps) => {
      const [showAccountSheet, setShowAccountSheet] = useState(false)
      const { pathname } = useLocation()

      useEffect(() => {
            setShowAccountSheet(false)
      }, [pathname])

      const isHome = pathname === '/'
      const isCategory = pathname === '/book' || pathname === '/food'
      const isTrading = pathname === '/shop' || pathname.startsWith('/shop/')
      const isNotification = pathname === '/customer/notification'
      const isAccount = pathname.startsWith('/customer/') && !isNotification

      return (
            <div {...props}>
                  <nav className='fixed bottom-0 left-0 right-0 z-[700] md:hidden'>
                        <div className='border-t border-slate-200 bg-white/95 px-1 shadow-[0_-8px_28px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-[#11161d]/95'>
                              <div className='mx-auto flex h-[62px] max-w-[520px] items-stretch'>
                                    <NavItem
                                          to='/'
                                          active={isHome}
                                          label='Trang chủ'
                                          icon={<Home size={21} strokeWidth={1.9} />}
                                    />

                                    <NavItem
                                          to='/book'
                                          active={isCategory}
                                          label='Danh mục'
                                          icon={<Grid2X2 size={21} strokeWidth={1.9} />}
                                    />

                                    <NavItem
                                          to='/shop'
                                          active={isTrading}
                                          label='Tiki Trading'
                                          icon={<Store size={21} strokeWidth={1.9} />}
                                    />

                                    <NavItem
                                          to='/customer/notification'
                                          active={isNotification}
                                          label='Thông báo'
                                          icon={<Bell size={21} strokeWidth={1.9} />}
                                    />

                                    <NavItem
                                          active={showAccountSheet || isAccount}
                                          label='Tài khoản'
                                          icon={<UserRound size={21} strokeWidth={1.9} />}
                                          onClick={() => setShowAccountSheet(true)}
                                    />
                              </div>
                        </div>
                  </nav>

                  {showAccountSheet && <CustomerRouter onClose={() => setShowAccountSheet(false)} />}
            </div>
      )
}

const CustomerRouter = ({ onClose }: { onClose: () => void }) => {
      const user = useSelector((state: RootState) => state.authentication.user) as UserResponse
      const dispatch = useDispatch()

      const queryMedia = useMediaQuery('(max-width: 767px)', false, {
            getInitialValueInEffect: false,
      })

      const logoutMutation = useMutation({
            mutationKey: ['logout account'],
            mutationFn: () => Auth.logout(),
            onSuccess: () => {
                  dispatch(doLogout())
                  dispatch(
                        addToast({
                              type: 'SUCCESS',
                              message: 'Đăng xuất thành công',
                              id: Math.random().toString(),
                        }),
                  )
            },
            onError: () => {
                  dispatch(
                        addToast({
                              type: 'ERROR',
                              message: 'Đăng xuất không thành công',
                              id: Math.random().toString(),
                        }),
                  )
            },
      })

      const handleLogOut = () => {
            logoutMutation.mutate()
            onClose()
      }

      useEffect(() => {
            if (!queryMedia) onClose()
      }, [queryMedia, onClose])

      useEffect(() => {
            const oldOverflow = document.body.style.overflow
            document.body.style.overflow = 'hidden'

            const onKeyDown = (event: KeyboardEvent) => {
                  if (event.key === 'Escape') onClose()
            }

            window.addEventListener('keydown', onKeyDown)

            return () => {
                  document.body.style.overflow = oldOverflow
                  window.removeEventListener('keydown', onKeyDown)
            }
      }, [onClose])

      const menuItemClass =
            'group flex min-h-[46px] w-full items-center gap-3 rounded-xl px-3 text-left text-[13px] font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/80'

      const iconClass = 'text-slate-500 transition-colors group-hover:text-[#1677ff] dark:text-slate-400'

      return createPortal(
            <div className='fixed inset-0 z-[9999] md:hidden'>
                  <button
                        type='button'
                        aria-label='Đóng menu tài khoản'
                        onClick={onClose}
                        className='absolute inset-0 bottom-[62px] bg-black/95 backdrop-blur-[1px]'
                  />

                  <section
                        onClick={(event) => event.stopPropagation()}
                        className='absolute bottom-[62px] left-0 right-0 max-h-[78vh] overflow-hidden rounded-t-[26px] border border-b-0 border-slate-200 bg-white text-slate-900 shadow-[0_-20px_60px_rgba(0,0,0,0.28)] dark:border-slate-700 dark:bg-[#171c23] dark:text-white'
                  >
                        <div className='mx-auto mt-2.5 h-1 w-10 rounded-full bg-slate-300 dark:bg-slate-600' />

                        <div className='flex items-center gap-3 border-b border-slate-200 px-4 pb-4 pt-3 dark:border-slate-700'>
                              {user ? (
                                    <img
                                          src={user.avatar?.secure_url || user.avatar_url_default || ''}
                                          alt='user_avatar'
                                          className='h-11 w-11 shrink-0 rounded-full border border-slate-200 object-cover dark:border-slate-700'
                                    />
                              ) : (
                                    <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300'>
                                          <UserRound size={21} />
                                    </div>
                              )}

                              <div className='min-w-0 flex-1'>
                                    <p className='text-[12px] text-slate-500 dark:text-slate-400'>Tài khoản của</p>
                                    <p className='mt-0.5 truncate text-[15px] font-bold'>
                                          {user ? `@${user.email.split('@')[0]}` : 'Chưa đăng nhập'}
                                    </p>
                              </div>

                              <button
                                    type='button'
                                    onClick={onClose}
                                    className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                                    aria-label='Đóng'
                              >
                                    <X size={18} />
                              </button>
                        </div>

                        <div className='max-h-[calc(78vh-92px)] overflow-y-auto overscroll-contain px-2 py-2'>
                              <Link to='/customer/account' onClick={onClose} className={menuItemClass}>
                                    <UserRound size={19} strokeWidth={1.8} className={iconClass} />
                                    <span className='flex-1'>Tài khoản</span>
                                    <ChevronRight size={17} className='text-slate-400' />
                              </Link>

                              <Link to='/customer/notification' onClick={onClose} className={menuItemClass}>
                                    <Bell size={19} strokeWidth={1.8} className={iconClass} />
                                    <span className='flex-1'>Thông báo của tôi</span>
                                    <ChevronRight size={17} className='text-slate-400' />
                              </Link>

                              <Link to='/customer/order_history' onClick={onClose} className={menuItemClass}>
                                    <NotebookPen size={19} strokeWidth={1.8} className={iconClass} />
                                    <span className='flex-1'>Quản lí đơn hàng</span>
                                    <ChevronRight size={17} className='text-slate-400' />
                              </Link>

                              <Link to='/customer/shop' onClick={onClose} className={menuItemClass}>
                                    <Store size={19} strokeWidth={1.8} className={iconClass} />
                                    <span className='flex-1'>Cửa hàng</span>
                                    <ChevronRight size={17} className='text-slate-400' />
                              </Link>

                              <Link to='/customer/register-sell' onClick={onClose} className={menuItemClass}>
                                    <PackagePlus size={19} strokeWidth={1.8} className={iconClass} />
                                    <span className='flex-1'>Đăng kí bán sản phẩm</span>
                                    <ChevronRight size={17} className='text-slate-400' />
                              </Link>

                              {user?.verify_email && (
                                    <Link to='/customer/shop/product-list' onClick={onClose} className={menuItemClass}>
                                          <Store size={19} strokeWidth={1.8} className={iconClass} />
                                          <span className='flex-1'>Sản phẩm của Shop</span>
                                          <ChevronRight size={17} className='text-slate-400' />
                                    </Link>
                              )}

                              <Link to='/customer/account/address' onClick={onClose} className={menuItemClass}>
                                    <MapPin size={19} strokeWidth={1.8} className={iconClass} />
                                    <span className='flex-1'>Sổ địa chỉ</span>
                                    <ChevronRight size={17} className='text-slate-400' />
                              </Link>

                              <div className='my-1 h-px bg-slate-200 dark:bg-slate-700' />

                              <Link to='/customer/account/update/email' onClick={onClose} className={menuItemClass}>
                                    <Mail size={19} strokeWidth={1.8} className={iconClass} />
                                    <span className='flex-1'>Cập nhật Email</span>
                                    <ChevronRight size={17} className='text-slate-400' />
                              </Link>

                              <Link to='/customer/account/update/password' onClick={onClose} className={menuItemClass}>
                                    <KeyRound size={19} strokeWidth={1.8} className={iconClass} />
                                    <span className='flex-1'>Cập nhật mật khẩu</span>
                                    <ChevronRight size={17} className='text-slate-400' />
                              </Link>

                              {user && (
                                    <>
                                          <div className='my-1 h-px bg-slate-200 dark:bg-slate-700' />

                                          <button
                                                type='button'
                                                onClick={handleLogOut}
                                                disabled={logoutMutation.isPending}
                                                className='flex min-h-[46px] w-full items-center gap-3 rounded-xl px-3 text-left text-[13px] font-semibold text-red-500 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-red-500/10'
                                          >
                                                <LogOut size={19} strokeWidth={1.8} />
                                                <span className='flex-1'>
                                                      {logoutMutation.isPending ? 'Đang đăng xuất...' : 'Đăng xuất'}
                                                </span>
                                          </button>
                                    </>
                              )}
                        </div>
                  </section>
            </div>,
            document.body,
      )
}

export default FooterMobile