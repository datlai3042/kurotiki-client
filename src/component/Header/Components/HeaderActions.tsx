import { Link } from 'react-router-dom'
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
import HeaderNotification from '../HeaderNotification'
import { toDoHideSideBar, toDoShowSideBar } from '../../../Redux/uiSlice'
import { Menu } from 'lucide-react'

const HeaderActions = () => {
      const user = useSelector((state: RootState) => state.authentication.user) as UserResponse
      const [showBoxLogin, setShowBoxLogin] = useState(false)

      const getMe = useQuery({
            queryKey: ['getMeQuery'],
            queryFn: () => AccountService.getMeQuery(),
      })

      const uiSlice = useSelector((state: RootState) => state.uiSlice.showSideBar)
      const dispatch = useDispatch()

      const onShowSideBarAction = () => {
            return uiSlice ? dispatch(toDoHideSideBar()) : dispatch(toDoShowSideBar())
      }

      return (
            <div className='flex h-full items-center gap-1.5 text-[13px] sm:gap-2'>
                  {!getMe.isLoading ? (
                        user ? (
                              <>
                                    <div className='group relative z-[601] hidden md:block'>
                                          <button
                                                type='button'
                                                className='flex h-10 items-center gap-2 rounded-xl px-2.5 text-blue-500 transition hover:bg-blue-50 dark:hover:bg-blue-500/10'
                                          >
                                                <img
                                                      src={user?.avatar?.secure_url || user.avatar_url_default}
                                                      className='h-7 w-7 rounded-full border border-[var(--border-color-input)] object-cover dark:border-slate-700'
                                                      alt='avatar'
                                                />

                                                <span className='font-semibold'>Tài Khoản</span>
                                          </button>

                                          <div className='absolute right-0 top-full z-[601] hidden pt-2 group-hover:block'>
                                                <HeaderBoxHover />
                                          </div>
                                    </div>

                                    <HeaderNotification />
                              </>
                        ) : (
                              <button
                                    className='hidden h-10 items-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 md:flex'
                                    onClick={() => setShowBoxLogin(true)}
                              >
                                    Đăng nhập
                                    {showBoxLogin && <AuthWrapper setShowBoxAuth={setShowBoxLogin} />}
                              </button>
                        )
                  ) : (
                        <div className='flex h-10 w-10 items-center justify-center'>
                              <BoxLoading color='text-text-theme' />
                        </div>
                  )}

                  <HeaderCart />

                  <ButtonDarkMode />

                  <button
                        type='button'
                        onClick={onShowSideBarAction}
                        className='flex h-10 w-10 items-center justify-center rounded-xl text-text-theme transition hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800'
                        aria-label='Mở menu'
                  >
                        <Menu size={25} strokeWidth={1.8} />
                  </button>
            </div>
      )
}

export default HeaderActions