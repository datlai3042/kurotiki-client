import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { UserResponse } from '../../types/user.type'
import { CartProduct } from '../../types/cart.type'

type TProps = {
      products?: CartProduct[]
}

const CartUserInfo = (props: TProps) => {
      const { products } = props

      const handleAddressUnique = () => {
            let newSet: string[] = []
            if (products) {
                  products.map((product) => newSet.push(product.cart_address.address_text))
            }

            const addressUnique = new Set(newSet)
            const arrayResult = Array.from(addressUnique)

            // return addressUnique
            return arrayResult
      }

      const user = useSelector((state: RootState) => state.authentication.user) as UserResponse

      return (
            <div className='w-full min-h-[200px] xl:min-h-[150px] h-max bg-color-section-theme text-text-theme flex flex-col p-[8px]  xl:p-[16px] rounded text-[12px] xl:text-[14px]'>
                  {/* <div className='flex justify-between h-[30%] items-center text-[14px] xl:text-[16px]'>
                        <h4>Giao tới</h4>
                        <span>Thay đổi</span>
                  </div> */}
                  <div className='flex flex-col  xl:flex-row  xl:w-max gap-[8px] h-[30%] items-start xl:items-center'>
                        <span className='whitespace-pre'>{user?.fullName || user?.nickName || 'Khách hàng'}: </span>
                        <span className='w-[180px]  break-words xl:w-full xl:break-normal '>{user?.email}</span>
                  </div>

                  <div className='h-[1px]  w-[calc(100%+32px)] ml-[-16px] bg-[var(--border-color-input)] my-[15px]'></div>

                  <div className='flex flex-wrap  flex-col xl:flex-row gap-[8px]'>
                        <span className='w-full'>Địa chỉ nhận hàng ({handleAddressUnique().length})</span>
                        <div className='pl-[10px]'>
                              {products &&
                                    handleAddressUnique().map((address) => (
                                          <div className='relative flex gap-[16px] items-start' key={address}>
                                                <div className='absolute  top-[4px] bg-color-main w-[10px] h-[10px] rounded-full'></div>
                                                <span className='ml-[16px]'>{address}</span>
                                          </div>
                                    ))}
                        </div>
                  </div>
            </div>
      )
}

export default CartUserInfo
