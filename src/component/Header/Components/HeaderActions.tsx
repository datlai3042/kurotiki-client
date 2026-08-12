import HeaderBoxHover from './HeaderBoxHover'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../store'
import HeaderCart from './HeaderCart'
import { UserResponse } from '../../../types/user.type'
import ButtonDarkMode from '../../Features/ButtonDarkMode'
import { useState } from 'react'
import AuthWrapper from '../../Auth/AuthWrapper'
import { useQuery } from '@tanstack/react-query'
import AccountService from '../../../apis/account.service'
import BoxLoading from '../../BoxUi/BoxLoading'
import { UserRound, Menu, ChevronDown } from 'lucide-react'
import HeaderNotification from '../HeaderNotification'
import { doOpenBoxLogin } from '../../../Redux/authSlice'

const HeaderActions = () => {
      const user = useSelector((state: RootState) => state.authentication.user) as UserResponse
      const boxLogin = useSelector((state: RootState) => state.auth.isOpenBoxLogin)

      const [showBoxLogin, setShowBoxLogin] = useState(false)
      const dispatch = useDispatch()

      const getMe = useQuery({
            queryKey: ['getMeQuery'],
            queryFn: () => AccountService.getMeQuery(),
      })
      return (
            <div className='flex h-full items-center gap-1 text-[13px]'>
                  {!getMe.isLoading ? (
                        user ? (
                              <>
                                    <div className='group relative z-[900s] hidden lg:block'>
                                          <button
                                                type='button'
                                                className='flex h-10 items-center gap-2 rounded-lg px-2.5 text-text-theme transition hover:bg-color-main hover:text-white'
                                          >
                                                <img
                                                      src={user?.avatar?.secure_url || user.avatar_url_default}
                                                      className='h-7 w-7 rounded-full border border-[#dbe2ec] object-cover'
                                                      alt='avatar'
                                                />
                                                <span className='hidden flex-col items-start leading-[14px] lg:flex'>
                                                      <span className='text-[12px] font-medium'>Tài khoản</span>
                                                      <span className='text-[10px] text-[#78879c] group-hover:text-white'>Của bạn</span>
                                                </span>
                                          </button>
                                          <div className='absolute right-0 top-full z-[601] hidden pt-2 group-hover:block'>
                                                <HeaderBoxHover />
                                          </div>
                                    </div>
                              </>
                        ) : (
                              <button
                                    type='button'
                                    onClick={() => {
                                          dispatch(doOpenBoxLogin())
                                    }}
                                    className='
            group
            flex h-[46px]
            items-center gap-2.5
            rounded-xl
            border border-transparent
            px-2.5
            text-text-theme
            transition-all duration-200

            hover:border-blue-500/20
            hover:bg-blue-500/[0.08]

            active:scale-[0.98]
      '
                              >
                                    {/* Icon */}
                                    <div
                                          className='
                  flex h-9 w-9 shrink-0
                  items-center justify-center
                  rounded-full
                  border border-blue-500/20
                  bg-blue-500/10
                  text-blue-500
                  transition-all duration-200

                  group-hover:border-blue-500/40
                  group-hover:bg-blue-500
                  group-hover:text-white
            '
                                    >
                                          <UserRound size={19} strokeWidth={1.8} />
                                    </div>

                                    {/* Text */}
                                    <div className='hidden min-w-0 flex-col items-start lg:flex'>
                                          <div className='flex items-center gap-1'>
                                                <span className='text-[12px] font-semibold leading-4'>Đăng nhập</span>

                                                <ChevronDown
                                                      size={13}
                                                      strokeWidth={2}
                                                      className='
                              text-slate-400
                              transition-transform duration-200
                              group-hover:translate-y-[1px]
                              group-hover:text-blue-500
                        '
                                                />
                                          </div>

                                          <span className='mt-[1px] text-[10px] leading-3 text-slate-500'>Tài khoản của bạn</span>
                                    </div>
                              </button>
                        )
                  ) : (
                        <div className='flex h-10 w-10 items-center justify-center'>
                              <BoxLoading color='text-text-theme' />
                        </div>
                  )}

                  <HeaderCart />
                  <HeaderNotification />

                  <div className='hidden'>
                        <ButtonDarkMode />
                  </div>
                  <button
                        type='button'
                        className='flex h-10 w-10 items-center justify-center rounded-lg text-text-theme transition hover:bg-slate-100 sm:hidden dark:hover:bg-slate-800'
                        aria-label='Mở menu'
                  >
                        <Menu size={23} strokeWidth={1.7} />
                  </button>

                  {boxLogin && <AuthWrapper setShowBoxAuth={setShowBoxLogin} />}
            </div>
      )
}

export default HeaderActions
