import { ChevronRight, MapPinOff, Plus, X } from 'lucide-react'
import React, { useState } from 'react'
import BoxButton from '../../component/BoxUi/BoxButton'
import FormAddress from '../../forms/FormAddress'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { UserResponse } from '../../types/user.type'
import AddressItem from './AddressItem'
import Portal from '../../component/Portal'

const CustomerUserAddress = () => {
      const [openFormAddress, setOpenFormAddress] = useState<boolean>(false)

      const user = useSelector((state: RootState) => state.authentication.user) as UserResponse

      return (
            <div className='w-full   flex flex-col gap-[20px] '>
                  <button
                        type='button'
                        onClick={() => setOpenFormAddress((prev) => !prev)}
                        className='
            group
            flex
            w-full
            items-center
            justify-between
            rounded-xl
            border
            border-dashed
            border-blue-500/30
            bg-blue-500/[0.04]
            px-4
            py-3
            text-left
            transition
            hover:border-blue-500/60
            hover:bg-blue-500/[0.08]
      '
                  >
                        <div className='flex items-center gap-3'>
                              <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 transition group-hover:bg-blue-500 group-hover:text-white'>
                                    <Plus size={18} />
                              </div>

                              <div>
                                    <p className='text-sm font-semibold text-text-theme'>
                                          {openFormAddress ? 'Ẩn biểu mẫu địa chỉ' : 'Thêm địa chỉ mới'}
                                    </p>

                                    <p className='mt-0.5 text-[11px] text-slate-500'>
                                          {openFormAddress ? 'Thu gọn phần nhập thông tin' : 'Thêm địa chỉ nhận hàng mới vào tài khoản'}
                                    </p>
                              </div>
                        </div>

                        <ChevronRight size={18} className={`text-slate-400 transition ${openFormAddress ? 'rotate-90' : ''}`} />
                  </button>
                  {openFormAddress && (
                        <Portal>
                              <div className='fixed inset-0 bg-[var(--bg-overlay)] h-screen flex items-center justify-center z-[998]'>
                                    <div className='animate-authBox bg-color-section-theme  min-w-[575px]'>
                                          <FormAddress iconClose={<X />} onClose={setOpenFormAddress} />
                                    </div>
                              </div>
                        </Portal>
                  )}

                 
                  {user.user_address.length > 0 &&
                        user.user_address.map((address, index) => {
                              return <AddressItem key={address._id} address={address} index={index} />
                        })}
            </div>
      )
}

export default CustomerUserAddress
