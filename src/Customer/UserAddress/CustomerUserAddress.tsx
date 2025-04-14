import { MapPinOff, Plus, X } from 'lucide-react'
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
            <div className='w-full  py-[8px] flex flex-col gap-[20px] bg-color-section-theme'>
                  <button
                        className=' h-[60px] mx-[10px] flex items-center justify-center gap-[8px] bg-color-section-theme border-[1px] border-dotted border-[var(--border-color-input)]'
                        onClick={() => setOpenFormAddress((prev) => !prev)}
                  >
                        <Plus />
                        <span>{`${openFormAddress ? 'Ẩn Form' : 'Thêm địa chỉ'}`}</span>
                  </button>
                  {openFormAddress && (
                        <Portal>
                              <div className='fixed inset-0 bg-[rgba(0,0,0,.4)] h-screen flex items-center justify-center z-[998]'>
                                    <div className='animate-authBox  min-w-[575px]'>
                                          <FormAddress iconClose={<X />} onClose={setOpenFormAddress} />
                                    </div>
                              </div>
                        </Portal>
                  )}

                  {user.user_address.length === 0 && (
                        <div className='w-full flex flex-col gap-[24px] justify-center items-center py-[50px] bg-color-section-theme'>
                              <header className='w-full h-max flex justify-center gap-[16px] '>
                                    <MapPinOff />
                                    <span>Bạn chưa thêm bất kì địa chỉ nào, nhấn vào "Thêm địa chỉ" để cập nhập nhé</span>
                              </header>
                              <div className='h-[40px]'>
                                    <BoxButton
                                          content={`${openFormAddress ? 'Ẩn Form' : 'Thêm địa chỉ'}`}
                                          onClick={() => setOpenFormAddress((prev) => !prev)}
                                    />
                              </div>
                        </div>
                  )}
                  {user.user_address.length > 0 &&
                        user.user_address.map((address, index) => {
                              return <AddressItem key={address._id} address={address} index={index} />
                        })}
            </div>
      )
}

export default CustomerUserAddress
