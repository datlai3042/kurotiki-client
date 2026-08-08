import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { UserResponse } from '../../types/user.type'
import { CartProduct } from '../../types/cart.type'
import { MapPin } from 'lucide-react'

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

            return Array.from(new Set(newSet))
      }

      const user = useSelector((state: RootState) => state.authentication.user) as UserResponse
      const addresses = handleAddressUnique()

      return (
            <div className='w-full overflow-hidden rounded-2xl border border-slate-200/70 bg-color-section-theme text-text-theme shadow-[0_4px_18px_rgba(15,23,42,0.035)] dark:border-white/[0.07]'>
                  <div className='flex items-center justify-between border-b border-slate-200/60 px-4 py-4 dark:border-white/[0.06]'>
                        <div>
                              <h4 className='text-[15px] font-semibold'>Địa chỉ nhận hàng ({addresses.length})</h4>
                              <p className='mt-1 text-[11px] text-slate-400'>
                                    {user?.fullName || user?.nickName || 'Khách hàng'} · {user?.email}
                              </p>
                        </div>
                  </div>

                  <div className='px-4 py-2'>
                        {addresses.map((address, index) => (
                              <div
                                    key={address}
                                    className='flex items-start gap-3 border-b border-slate-200/60 py-3 last:border-b-0 dark:border-white/[0.06]'
                              >
                                    <MapPin size={15} className='mt-[2px] shrink-0 text-blue-500' />

                                    <div className='min-w-0 flex-1'>
                                          <div className='flex items-center gap-2'>
                                                <span className='text-[12px] font-medium text-text-theme'>
                                                      {address}
                                                </span>

                                                {index === 0 && (
                                                      <span className='rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-600 dark:text-blue-400'>
                                                            Mặc định
                                                      </span>
                                                )}
                                          </div>
                                    </div>
                              </div>
                        ))}
                  </div>
            </div>
      )
}

export default CartUserInfo