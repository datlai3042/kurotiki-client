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
            // dispatch(onShowSideBar({ showSideBar: showSideBar }))
            
            return uiSlice ? dispatch(toDoHideSideBar()) : dispatch(toDoShowSideBar())
      }
      return (
            <div className='h-full] flex gap-[16px] items-center content-start text-[13px]  '>
                  {/* <Link className='h-[80%] hidden md:flex items-center px-[8px] bg-blue-200 gap-[4px] rounded-lg text-blue-800' to='/'>
                        <img
                              src='https://salt.tikicdn.com/ts/upload/32/56/db/d919a4fea46f498b5f4708986d82009d.png'
                              alt=''
                              className='w-5 h-5'
                        />
                        <button className='text-sm font-semibold'>Trang Chủ</button>
                  </Link> */}
                  {!getMe.isLoading ? (
                        user ? (
                              <>
                                    <div className='group relative z-[601] hidden md:flex items-center px-2 gap-2 '>
                                          {user ? (
                                                <img
                                                      src={user?.avatar?.secure_url || user.avatar_url_default}
                                                      className='w-[24px] h-[24px] rounded-full'
                                                      alt='avatar'
                                                />
                                          ) : (
                                                <img
                                                      src='https://salt.tikicdn.com/ts/upload/07/d5/94/d7b6a3bd7d57d37ef6e437aa0de4821b.png'
                                                      alt=''
                                                      className='w-[24px] h-[24px]'
                                                />
                                          )}
                                          <button className='text-blue-500 font-semibold'>Tài Khoản</button>
                                          <div className='absolute  top-[20px] z-[601] right-0 hidden group-hover:block'>
                                                <div className='w-full h-full pt-[10px]'>
                                                      <HeaderBoxHover />
                                                </div>
                                          </div>
                                    </div>

                                    <HeaderNotification />
                              </>
                        ) : (
                              <button
                                    className='h-[80%] hidden md:flex items-center px-[8px] bg-color-main gap-[4px] rounded-md text-[#fff]'
                                    onClick={() => setShowBoxLogin(true)}
                              >
                                    <span className='text-sm font-semibold '>Đăng nhập</span>
                                    {showBoxLogin && <AuthWrapper setShowBoxAuth={setShowBoxLogin} />}
                              </button>
                        )
                  ) : (
                        <BoxLoading color='text-text-theme' />
                  )}
                  <HeaderCart />
                  <ButtonDarkMode />

                  {/* <div className='block  cursor-pointer' onClick={onShowSideBarAction}>
                        <svg
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 24 24'
                              strokeWidth={2.5}
                              stroke='currentColor'
                              className='w-8 h-8 lg:w-9 lg:h-9 text-color-main'
                        >
                              <path strokeLinecap='round' strokeLinejoin='round' d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5' />
                        </svg>
                  </div> */}
            </div>
      )
}

export default HeaderActions
