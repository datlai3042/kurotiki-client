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
                  <div className={`fixed lg:static top-0 left-0 w-full z-[600] bg-white shadow-xl xl:shadow-none`}>
                        <div className='h-[75px] lg:h-[90px] py-2 px-[10px]  bg-white flex items-center gap-3 lg:gap-0 mx-auto sm:max-w-[1024px] xl:max-w-[1400px]'>
                              <div className='basis-[14%] flex items-center'>
                                    <HeaderLogoToggle />
                              </div>
                              <div className=' grow flex-1 xl:flex-auto flex h-full gap-[24px]'>
                                    <div className='grow flex flex-col w-full'>
                                          <HeaderSeacrhInput />
                                          <HeaderTagsLocation />
                                    </div>
                                    <div className='basis-[10%] flex lg:flex-col lg:justify-between xl:basis-[45%] ml-0 xl:ml-[20px] h-full'>
                                          <HeaderActions />
                                          {user && (
                                                <div
                                                      id=''
                                                      className='hidden xl:flex items-center  text-[14px] text-[#000] max-w-[380px] truncate  '
                                                      title={`${
                                                            address_default ? renderStringAddressDetailV2(address_default[0]) : ' ...'
                                                      }`}
                                                >
                                                      <img
                                                            src='https://salt.tikicdn.com/ts/upload/88/5c/9d/f5ee506836792eb7775e527ef8350a44.png'
                                                            alt='Location'
                                                            width={20}
                                                            height={2}
                                                            className='mr-[4px]'
                                                      />
                                                      <div className='text-[11px] text-slate-500'>
                                                            {getAddressDefault(user?.user_address) ? (
                                                                  <p className='flex gap-[8px]'>
                                                                        <span>Giao đến</span>
                                                                        <span className='underline text-slate-800 font-bold'>
                                                                              {address_default
                                                                                    ? renderStringAddressDetailV2(address_default[0])
                                                                                    : ''}
                                                                        </span>
                                                                  </p>
                                                            ) : (
                                                                  <p className='flex gap-[4px] text-[10px]'>
                                                                        <span>[BẠN CHƯA THIẾT LẬP ĐỊA CHỈ GIAO HÀNG MẶC ĐỊNH]</span>
                                                                        <Link className='underline' to={'/customer/account/address'}>
                                                                              Thiết lập
                                                                        </Link>
                                                                  </p>
                                                            )}
                                                      </div>
                                                </div>
                                          )}
                                    </div>
                              </div>
                        </div>
                  </div>
            </>
      )
}

export default memo(Header)
