import React from 'react'
import { convertDateToStringFull } from '../../../utils/date.utils'
import { converNumberToMoney } from '../../../utils/money.utils'
import { CartProduct } from '../../../types/cart.type'
import { CalendarDays, Package2, ReceiptIcon, WalletCards } from 'lucide-react'

type TProps = {
      CartHistory: CartProduct
}

const ShopProductOrder = ({ CartHistory }: TProps) => {
      const product = CartHistory.product_id

      const totalMoney = CartHistory.quantity * product.product_price

      return (
            <article className='overflow-hidden rounded-2xl border border-[var(--border-color-input)] bg-color-section-theme text-text-theme shadow-[0_8px_28px_rgba(0,0,0,0.06)] transition hover:border-blue-500/25 hover:shadow-[0_12px_34px_rgba(0,0,0,0.08)]'>
                  <div className='grid grid-cols-1 gap-4 p-4 sm:p-5 md:grid-cols-[116px_minmax(0,1fr)] xl:grid-cols-[124px_minmax(0,1fr)_210px] xl:items-center'>
                        {/* Product image */}
                        <div className='relative mx-auto flex h-[116px] w-[116px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[var(--border-color-input)] bg-slate-500/[0.025] p-2 sm:mx-0 xl:h-[124px] xl:w-[124px]'>
                              <img
                                    src={product.product_thumb_image?.secure_url}
                                    className='h-full w-full rounded-lg object-contain'
                                    alt={product.product_name || 'product'}
                              />

                              <span className='absolute left-3 top-2.5 rounded-full bg-[#eaf1fd] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.05em] text-blue-500 backdrop-blur-sm'>
                                    Bán chạy
                              </span>
                        </div>

                        {/* Product info */}
                        <div className='min-w-0'>
                              <div className='flex flex-wrap items-center gap-2'>
                                    <span className='inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-1 text-[10px] font-semibold text-blue-500'>
                                          <ReceiptIcon size={12} />
                                          Đơn hàng đã hoàn tất
                                    </span>
                              </div>

                              <h3 className='mt-2 line-clamp-2 text-[15px] font-semibold leading-6 text-text-theme sm:text-[16px]'>
                                    {product.product_name}
                              </h3>

                              <div className='mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3 xl:max-w-[620px]'>
                                    <div className='rounded-xl border border-[var(--border-color-input)] bg-slate-500/[0.025] p-3'>
                                          <div className='flex items-center gap-2 text-slate-400'>
                                                <WalletCards size={14} className='shrink-0 text-blue-500' />
                                                <span className='text-[10px] font-medium uppercase tracking-[0.06em]'>Giá sản phẩm</span>
                                          </div>

                                          <p className='mt-1.5 text-[12px] font-semibold text-text-theme sm:text-[13px]'>
                                                {converNumberToMoney({
                                                      money: product.product_price,
                                                      replace: 'VNĐ',
                                                })}
                                          </p>
                                    </div>

                                    <div className='rounded-xl border border-[var(--border-color-input)] bg-slate-500/[0.025] p-3'>
                                          <div className='flex items-center gap-2 text-slate-400'>
                                                <Package2 size={14} className='shrink-0 text-blue-500' />
                                                <span className='text-[10px] font-medium uppercase tracking-[0.06em]'>Số lượng</span>
                                          </div>

                                          <p className='mt-1.5 text-[12px] font-semibold text-text-theme sm:text-[13px]'>
                                                {CartHistory.quantity} sản phẩm
                                          </p>
                                    </div>

                                    <div className='rounded-xl border border-[var(--border-color-input)] bg-slate-500/[0.025] p-3'>
                                          <div className='flex items-center gap-2 text-slate-400'>
                                                <CalendarDays size={14} className='shrink-0 text-blue-500' />
                                                <span className='text-[10px] font-medium uppercase tracking-[0.06em]'>Thanh toán</span>
                                          </div>

                                          <p className='mt-1.5 line-clamp-1 text-[12px] font-semibold text-text-theme sm:text-[13px]'>
                                                {convertDateToStringFull(CartHistory.cart_date)}
                                          </p>
                                    </div>
                              </div>
                        </div>

                        {/* Total */}
                        <div className='md:col-span-2 xl:col-span-1'>
                              <div className='relative overflow-hidden rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-500/[0.08] to-blue-500/[0.025] p-4 xl:text-right'>
                                    <div className='pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl' />

                                    <div className='relative'>
                                          <p className='text-[10px] font-medium uppercase tracking-[0.08em] text-slate-500'>
                                                Tổng tiền đơn hàng
                                          </p>

                                          <p className='mt-1 text-[20px] font-bold tracking-[-0.02em] text-blue-500 sm:text-[22px]'>
                                                {converNumberToMoney({
                                                      money: totalMoney,
                                                      replace: 'VNĐ',
                                                })}
                                          </p>

                                          <div className='mt-3 flex items-center gap-2 xl:justify-end'>
                                                <span className='h-2 w-2 rounded-full bg-emerald-500' />
                                                <span className='text-[10px] font-medium text-slate-500'>Giao dịch hoàn tất</span>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </div>
            </article>
      )
}

export default ShopProductOrder
