import React, { memo } from 'react'

import { useEffect } from 'react'
import HeaderActions from './Components/HeaderActions'
import HeaderTagsLocation from './Components/HeaderTagsLocation'
import HeaderLogoToggle from './Components/HeaderLogoToggle'
import HeaderSeacrhInput from './Components/HeaderSearch'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import { UserResponse } from '../../types/user.type'
import { getAddressDefault, renderStringAddressDetailV2 } from '../../utils/address.util'
import { toDoHideSideBar, toDoShowSideBar } from '../../Redux/uiSlice'

function Header() {
      const user = useSelector((state: RootState) => state.authentication.user) as UserResponse
      useEffect(() => {
            window.scrollTo(0, 0)
      }, [])

      const address_default = (user?.user_address && user?.user_address.filter((address) => address.address_default === true)) || ''
      const uiSlice = useSelector((state: RootState) => state.uiSlice.showSideBar)
      const dispatch = useDispatch()
      const onShowSideBarAction = () => {
            // dispatch(onShowSideBar({ showSideBar: showSideBar }))

            return uiSlice ? dispatch(toDoHideSideBar()) : dispatch(toDoShowSideBar())
      }

      return (
            <>
                  <div
                        className={`fixed text-text-theme  top-0 left-0 w-full z-[100] bg-color-section-theme border-b-[1px] border-solid border-[var(--border-color-input)]`}
                  >
                        <div className='h-[65px] md:h-[80px] py-2 px-[10px] gap-[24px]  flex items-center  mx-auto  xl:max-w-[1360px]'>
                              <div className='max-w-[200px] flex items-center'>
                                    <HeaderLogoToggle />
                              </div>
                              <div className='ml-[215px] grow flex-1 xl:flex-auto flex justify-center h-full gap-[12px]'>
                                    <div className='flex w-[35vw] flex-col justify-center '>
                                          <HeaderSeacrhInput />
                                          {/* <HeaderTagsLocation /> */}
                                    </div>
                                    <div className='whitespace-pre flex lg:flex-col justify-center  ml-auto h-full'>
                                          <HeaderActions />
                                          {/**
                                       *     <div
                                                id=''
                                                className='text-[11px] hidden xl:flex items-center   flex-grow-1  justify-space  '
                                                title={`${address_default ? renderStringAddressDetailV2(address_default[0]) : ' ...'}`}
                                          >
                                                <div className=' flex items-center gap-[.2rem]'>
                                                      <img
                                                            src='https://salt.tikicdn.com/ts/upload/88/5c/9d/f5ee506836792eb7775e527ef8350a44.png'
                                                            alt='Location'
                                                            width={20}
                                                            height={2}
                                                            className='mr-[4px]'
                                                      />
                                                      <span>[THIẾT LẬP ĐỊA CHỈ GIAO HÀNG]</span>
                                                </div>

                                                <div className='mx-[6px] text-[11px] '>
                                                      {getAddressDefault(user?.user_address) ? (
                                                            <p className='flex gap-[8px]'>
                                                                  <span>Giao đến</span>
                                                                  <span className='underline  font-bold'>
                                                                        {address_default
                                                                              ? renderStringAddressDetailV2(address_default[0])
                                                                              : ''}
                                                                  </span>
                                                            </p>
                                                      ) : (
                                                            <p className='flex gap-[4px] '>
                                                                  <Link className='underline' to={'/customer/account/address'}>
                                                                        Thiết lập
                                                                  </Link>
                                                            </p>
                                                      )}
                                                </div>
                                          </div>
                                       * 
                                       */}
                                    </div>

                                    {/* <div className='hidden md:flex cursor-pointer  items-center' onClick={onShowSideBarAction}>
                                          <svg
                                                xmlns='http://www.w3.org/2000/svg'
                                                fill='none'
                                                viewBox='0 0 24 24'
                                                strokeWidth={1.5}
                                                stroke='currentColor'
                                                className='w-8 h-8 lg:w-9 lg:h-9'
                                          >
                                                <path
                                                      strokeLinecap='round'
                                                      strokeLinejoin='round'
                                                      d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
                                                />
                                          </svg>
                                    </div> */}
                              </div>
                        </div>
                  </div>
            </>
      )
}

export default memo(Header)
