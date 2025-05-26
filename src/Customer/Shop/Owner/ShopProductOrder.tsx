import React from 'react'
import { OrderItem } from '../../../types/order.type'
import { convertDateToStringFull } from '../../../utils/date.utils'
import { converNumberToMoney } from '../../../utils/money.utils'
import { CartProduct, CartResponse } from '../../../types/cart.type'

type TProps = {
      CartHistory: CartProduct
}

const ShopProductOrder = (props: TProps) => {
      const { CartHistory } = props

      return (
            <div className=' bg-color-section-theme   rounded-lg'>
                  {/* {CartHistory.map((product) => ( */}
                  <div className='flex gap-[40px] p-[24px]'>
                        <img src={CartHistory.product_id.product_thumb_image?.secure_url} className='w-[200px] ' alt='product' />

                        <div className='flex flex-col gap-[12px]'>
                              <span>Tên sản phẩm: {CartHistory.product_id.product_name}</span>
                              <span>
                                    Giá sản phẩm: {converNumberToMoney({ money: CartHistory.product_id.product_price, replace: 'VNĐ' })}
                              </span>
                              <span>Số lượng: {CartHistory.quantity}</span>
                              <span>
                                    Tổng tiền đơn hàng:{' '}
                                    {converNumberToMoney({
                                          money: CartHistory.quantity * CartHistory.product_id.product_price,
                                          replace: 'VNĐ',
                                    })}
                              </span>
                              <span>Thời gian thanh toán: {convertDateToStringFull(CartHistory.cart_date)}</span>
                        </div>
                  </div>
                  {/* ))} */}
            </div>
      )
}

export default ShopProductOrder
