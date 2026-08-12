import React from 'react'
import { Building2, Home, MapPin, PackageCheck, TentTree } from 'lucide-react'

import { CartProduct } from '../../types/cart.type'
import BoxMoney from '../../component/BoxUi/BoxMoney'

type TProps = {
      product: CartProduct
      index: number
}

const PaymentItem = ({ product, index }: TProps) => {
      const AddressTypeIcon = product.cart_address.type === 'Home' ? Home : product.cart_address.type === 'Company' ? Building2 : TentTree

      const addressTypeText =
            product.cart_address.type === 'Home' ? 'Nhà' : product.cart_address.type === 'Company' ? 'Công ty / cơ quan' : 'Nơi ở riêng tư'

      const totalPrice = product.quantity * product.product_id.product_price

      return (
            <article className='group relative overflow-hidden rounded-2xl border border-[var(--border-color-input)] bg-color-section-theme transition-all duration-200 hover:border-blue-500/35 hover:shadow-[0_12px_30px_rgba(37,99,235,0.08)]'>
                  <div className='flex items-center justify-between border-b border-[var(--border-color-input)] bg-[var(--bg-color-theme)]/40 px-4 py-3 md:px-5'>
                        <div className='flex items-center gap-2.5'>
                              <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10 text-green-500'>
                                    <PackageCheck size={18} />
                              </div>

                              <div>
                                    <p className='text-sm font-semibold'>Gói {index}</p>
                                    <p className='mt-0.5 text-[11px] text-slate-400'>Được xử lý trong cùng một đơn giao hàng</p>
                              </div>
                        </div>

                        <span className='rounded-full bg-blue-500/10 px-2.5 py-1 text-[11px] font-semibold text-blue-500'>
                              x{product.quantity}
                        </span>
                  </div>

                  <div className='grid grid-cols-1 gap-5 p-4 md:grid-cols-[96px_minmax(0,1fr)_220px] md:items-center md:p-5'>
                        <div className='relative mx-auto w-[96px] shrink-0 md:mx-0'>
                              <div className='aspect-square overflow-hidden rounded-xl border border-[var(--border-color-input)] bg-white'>
                                    <img
                                          src={product.product_id.product_thumb_image?.secure_url}
                                          className='h-full w-full object-contain p-1'
                                          alt={product.product_id.product_name || 'product'}
                                    />
                              </div>

                              <div className='absolute -right-2 -top-2 flex h-7 min-w-7 items-center justify-center rounded-full bg-blue-500 px-1.5 text-xs font-bold text-white shadow-md'>
                                    {product.quantity}
                              </div>
                        </div>

                        <div className='min-w-0'>
                              <h3 className='line-clamp-2 text-sm font-semibold leading-6 md:text-[15px]'>
                                    {product.product_id.product_name}
                              </h3>

                              <div className='mt-3 flex flex-wrap items-end gap-x-3 gap-y-1'>
                                    <span className='text-xs text-slate-400'>Thành tiền</span>

                                    <div className='text-base font-bold text-text-theme md:text-lg'>
                                          <BoxMoney name='VNĐ' money={totalPrice} />
                                    </div>
                              </div>

                              <p className='mt-2 text-xs text-slate-400'>
                                    {product.quantity > 1 && (
                                          <>
                                                Đơn giá:{' '}
                                                <span className='font-medium text-text-theme'>
                                                      <BoxMoney name='VNĐ' money={product.product_id.product_price} />
                                                </span>
                                          </>
                                    )}
                              </p>
                        </div>

                        <div className='rounded-xl border border-[var(--border-color-input)] bg-blue-500/[0.05] p-3.5'>
                              <div className='flex items-start gap-2.5'>
                                    <MapPin className='mt-0.5 shrink-0 text-blue-500' size={17} />

                                    <div className='min-w-0'>
                                          <p className='text-[11px] font-medium uppercase tracking-wide text-slate-400'>
                                                Địa chỉ giao hàng
                                          </p>

                                          <p className='mt-1.5 break-words text-xs font-medium leading-5 text-text-theme'>
                                                {product.cart_address.address_text}
                                          </p>
                                    </div>
                              </div>

                              <div className='mt-3 flex items-center gap-2 border-t border-blue-500/10 pt-3'>
                                    <AddressTypeIcon size={15} className='shrink-0 text-blue-500' />
                                    <span className='truncate text-xs text-slate-400'>{addressTypeText}</span>
                              </div>
                        </div>
                  </div>
            </article>
      )
}

export default PaymentItem
