import React from 'react'
import { OrderItem } from '../../types/order.type'
import { convertDateToStringFull } from '../../utils/date.utils'
import { Store, Truck } from 'lucide-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import OrderService from '../../apis/Order.service'
import { CartProduct } from '../../types/cart.type'
import { useNavigate } from 'react-router-dom'
import BoxMoney from '../../component/BoxUi/BoxMoney'

type TProps = {
      orderItem: OrderItem
}

const OrderHistoryItem = (props: TProps) => {
      const { orderItem } = props
      const navigate = useNavigate()

      const onBuyAgain = () => {
            const products = orderItem.products
            buyAgainMutation.mutate(products)
      }

      const getMyCart = useQuery({
            queryKey: ['v1/api/cart/cart-get-my-cart'],
      })

      const buyAgainMutation = useMutation({
            mutationKey: ['/v1/api/order/buy-again'],
            mutationFn: (products: CartProduct[]) => OrderService.buyAgain(products),
            onSuccess: () => {
                  if (!getMyCart.isPending) {
                        navigate('/cart')
                  }
            },
      })

      return (
            <section className='w-full overflow-hidden rounded-2xl border border-[var(--border-color-input)] bg-color-section-theme text-text-theme shadow-[0_8px_30px_rgba(15,23,42,0.05)]'>
                  {/* Order header */}
                  <div className='flex flex-wrap rounded-2xl items-center justify-between gap-3 border-b border-[var(--border-color-input)]      px-5 py-4'>
                        <div className='flex items-center gap-2'>
                              <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500'>
                                    <Truck size={18} strokeWidth={1.8} />
                              </div>

                              <div>
                                    <div className='flex flex-wrap items-center gap-2'>
                                          <span className='text-sm font-semibold text-text-theme'>Giao hàng thành công</span>

                                          <span className='rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-500'>
                                                Đã giao
                                          </span>
                                    </div>

                                    <p className='mt-1 text-xs text-slate-500'>Đơn hàng đã được giao đến bạn</p>
                              </div>
                        </div>

                        <span className='text-xs text-slate-400'>{convertDateToStringFull(orderItem.order_time_payment)}</span>
                  </div>

                  {/* Products */}
                  <div className='divide-y divide-[var(--border-color-input)]'>
                        {orderItem.products.map((product) => (
                              <div
                                    key={product._id}
                                    className='grid min-h-[126px] grid-cols-1 gap-4 px-5 py-5 xl:grid-cols-[88px_minmax(0,1.4fr)_180px_150px] xl:items-center'
                              >
                                    {/* Image */}
                                    <div className='relative flex h-[88px] w-[88px] items-center justify-center overflow-hidden rounded-xl border border-[var(--border-color-input)] bg-white p-1'>
                                          <img
                                                src={product.product_id.product_thumb_image.secure_url}
                                                className='h-full w-full rounded-lg object-contain'
                                                alt=''
                                          />

                                          <div className='absolute bottom-0 right-0 flex h-6 min-w-6 items-center justify-center rounded-tl-lg bg-slate-100 px-1.5 text-[11px] font-medium text-blue-600'>
                                                x{product.quantity}
                                          </div>
                                    </div>

                                    {/* Info */}
                                    <div className='min-w-0'>
                                          <div className='flex items-center gap-2 text-xs text-slate-500'>
                                                <Store size={15} strokeWidth={1.7} />
                                                <span className='truncate'>{product.shop_id.shop_name}</span>
                                          </div>

                                          <h3 className='mt-2 line-clamp-2 text-sm font-semibold leading-6 text-text-theme'>
                                                {product.product_id.product_name}
                                          </h3>

                                          <p className='mt-1 text-xs text-slate-500'>Số lượng: {product.quantity}</p>
                                    </div>

                                    {/* Price */}
                                    <div className='border-t border-[var(--border-color-input)] pt-3 xl:border-l xl:border-t-0 xl:pl-5 xl:pt-0'>
                                          <p className='text-xs text-slate-500'>Tổng tiền</p>

                                          <p className='mt-1 text-lg font-semibold text-text-theme'>
                                                <BoxMoney name='VNĐ' money={product.product_id.product_price * product.quantity} />
                                          </p>

                                          <p className='mt-1 text-[11px] text-slate-400'>Thanh toán khi nhận hàng</p>
                                    </div>

                                    {/* Action */}
                                    <div className='flex justify-end'>
                                          <button
                                                className='h-10 min-w-[96px] rounded-xl border border-blue-500 px-4 text-sm font-medium text-blue-500 transition hover:bg-blue-500 hover:text-white'
                                                onClick={onBuyAgain}
                                          >
                                                Mua lại
                                          </button>
                                    </div>
                              </div>
                        ))}
                  </div>
            </section>
      )
}

export default OrderHistoryItem
