import { Badge, Bike, Building2, Car, Home, ShoppingBag, TentTree } from 'lucide-react'
import React from 'react'
import { CartProduct, CartProductRef, CartResponse } from '../../types/cart.type'
import BoxMoney from '../../component/BoxUi/BoxMoney'

type TProps = {
      product: CartProduct
      index: number
}

const PaymentItem = (props: TProps) => {
      const { product, index } = props

      const AddressTypeIcon =
            product.cart_address.type === 'Home' ? <Home /> : product.cart_address.type === 'Company' ? <Building2 /> : <TentTree />

      const AddressTypeText =
            product.cart_address.type === 'Home' ? 'Nhà' : product.cart_address.type === 'Company' ? 'Công ty / cơ quan' : 'Nơi ở riêng tư'
      return (
            <div className='w-full h-max relative z-[2] border-[1px] border-[var(--border-color-input)] rounded-lg text-[11px] xl:text-[13px]'>
                  <div className='absolute top-[-25px] left-[12px] h-[50px]  z-[3] px-[8px] text-text-theme  flex items-center gap-[8px]'>
                        <ShoppingBag className='text-green-600'/>
                        <span>Gói {index}:</span>
                  </div>
                  <div className='mt-[30px]  px-[25px] flex flex-col gap-[8px]'>
                        <div className='flex gap-[24px]  py-[24px]'>
                              <img src={product.product_id.product_thumb_image?.secure_url} className='h-full w-[70px]' alt='product' />
                              <span className='text-color-main text-[18px] font-semibold'>x{product.quantity}</span>

                              <div className='flex flex-col gap-[12px] text-[13px]'>
                                    <span>{product.product_id.product_name}</span>
                                    <p className='flex gap-[8px]'>
                                          <span>Giá:</span>
                                          <BoxMoney name='VNĐ' money={product.quantity * product.product_id.product_price} />
                                    </p>
                                    <span>Địa chỉ {product.cart_address.address_text}</span>
                              </div>
                        </div>
                  </div>
            </div>
      )
}

export default PaymentItem
