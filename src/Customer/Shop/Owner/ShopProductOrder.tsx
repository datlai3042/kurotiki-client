import React from 'react'
import { OrderItem } from '../../../types/order.type'
import { convertDateToStringFull } from '../../../utils/date.utils'
import { converNumberToMoney } from '../../../utils/money.utils'
import { CartProduct, CartResponse } from '../../../types/cart.type'
import { CalendarDays, Package2, WalletCards } from 'lucide-react'

type TProps = {
      CartHistory: CartProduct
}

const ShopProductOrder = (props: TProps) => {
      const { CartHistory } = props

      return (
            <div className='overflow-hidden rounded-2xl border border-slate-800/70 bg-[#15171b] text-text-theme shadow-[0_12px_35px_rgba(0,0,0,0.16)]'>
                  <div className='grid grid-cols-1 gap-5 p-5 md:grid-cols-[150px_minmax(0,1fr)_180px] md:items-center'>
                        {/* Product image */}
                        <div className='flex h-[150px] w-full items-center justify-center overflow-hidden rounded-xl border border-slate-800 bg-[#101217] p-2 md:w-[150px]'>
                              <img
                                    src={CartHistory.product_id.product_thumb_image?.secure_url}
                                    className='h-full w-full object-contain'
                                    alt='product'
                              />
                        </div>

                        {/* Product info */}
                        <div className='min-w-0'>
                              <p className='text-xs font-medium uppercase tracking-[0.12em] text-blue-500'>
                                    Sản phẩm bán chạy
                              </p>

                              <h3 className='mt-2 line-clamp-2 text-[16px] font-semibold leading-6 text-slate-100'>
                                    {CartHistory.product_id.product_name}
                              </h3>

                              <div className='mt-4 grid grid-cols-1 gap-3 text-sm text-slate-400 sm:grid-cols-2'>
                                    <div className='flex items-center gap-2'>
                                          <WalletCards size={16} className='shrink-0 text-blue-500' />
                                          <span>Giá sản phẩm</span>
                                    </div>

                                    <span className='font-medium text-slate-200'>
                                          {converNumberToMoney({
                                                money: CartHistory.product_id.product_price,
                                                replace: 'VNĐ',
                                          })}
                                    </span>

                                    <div className='flex items-center gap-2'>
                                          <Package2 size={16} className='shrink-0 text-blue-500' />
                                          <span>Số lượng</span>
                                    </div>

                                    <span className='font-medium text-slate-200'>
                                          {CartHistory.quantity}
                                    </span>

                                    <div className='flex items-center gap-2'>
                                          <CalendarDays size={16} className='shrink-0 text-blue-500' />
                                          <span>Thanh toán</span>
                                    </div>

                                    <span className='font-medium text-slate-200'>
                                          {convertDateToStringFull(CartHistory.cart_date)}
                                    </span>
                              </div>
                        </div>

                        {/* Total */}
                        <div className='rounded-xl border border-[var(--border-color-input)] bg-blue-500/5 p-4 md:text-right'>
                              <p className='text-xs text-slate-500'>Tổng tiền đơn hàng</p>

                              <p className='mt-1 text-xl font-semibold text-blue-500'>
                                    {converNumberToMoney({
                                          money:
                                                CartHistory.quantity *
                                                CartHistory.product_id.product_price,
                                          replace: 'VNĐ',
                                    })}
                              </p>

                              <p className='mt-2 text-[11px] leading-5 text-slate-500'>
                                    Giá trị đơn hàng đã hoàn tất
                              </p>
                        </div>
                  </div>
            </div>
      )
}

export default ShopProductOrder