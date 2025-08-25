import React, { memo } from 'react'

import { useEffect } from 'react'
import HeaderActions from './Components/HeaderActions'
import HeaderTagsLocation from './Components/HeaderTagsLocation'
import HeaderLogoToggle from './Components/HeaderLogoToggle'
import HeaderSeacrhInput from './Components/HeaderSearch'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { UserResponse } from '../../types/user.type'
import { getAddressDefault, renderStringAddressDetailV2 } from '../../utils/address.util'

function Header() {
      const user = useSelector((state: RootState) => state.authentication.user) as UserResponse
      useEffect(() => {
            window.scrollTo(0, 0)
      }, [])

      const address_default = (user?.user_address && user?.user_address.filter((address) => address.address_default === true)) || ''

      return (
            <>
                  <div
                        className={`fixed text-text-theme  top-0 left-0 w-full z-[100] bg-color-section-theme border-b-[1px] border-solid border-[var(--border-color-input)]`}
                  >
                        <div className='h-[65px] md:h-[60px] py-2 px-[10px] gap-[24px]  flex items-center  mx-auto  xl:max-w-[1400px]'>
                              <div className='max-w-[200px] flex items-center'>
                                    <HeaderLogoToggle />
                              </div>
                              <div className=' grow flex-1 xl:flex-auto flex justify-center h-full gap-[24px]'>
                                    <div className='flex flex-grow-1 flex-1 flex-col justify-center '>
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
                              </div>
                        </div>
                  </div>
            </>
      )
}

export default memo(Header)
