import React from 'react'
import { OrderItem } from '../../types/order.type'
import { convertDateToStringFull } from '../../utils/date.utils'
import { Store, Truck } from 'lucide-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import OrderService from '../../apis/Order.service'
import { CartProduct } from '../../types/cart.type'
import { useNavigate } from 'react-router-dom'

type TProps = {
      orderItem: OrderItem
}

const OrderHistoryItem = (props: TProps) => {
      const { orderItem } = props
      const navigate = useNavigate()

      const onBuyAgain = () => {
            //console.log(([^)]+))
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
            <section className='min-h-[180px] h-max w-full flex flex-col gap-[16px]  bg-[#ffffff] p-[16px_20px] text-[12px]'>
                  {/* {orderItem.map((products) => ( */}
                  <div className='min-h-full flex flex-col gap-[16px] flex-1'>
                        <div className='w-full flex justify-between items-center'>
                              <div className='flex gap-[8px] items-center'>
                                    <Truck />
                                    <span>Giao hàng thành công</span>
                              </div>
                              <span>{convertDateToStringFull(orderItem.order_time_payment)}</span>
                        </div>

                        <div className='flex-1 flex flex-col gap-[16px]'>
                              {orderItem.products.map((product) => (
                                    <div className='h-full flex flex-col gap-[16px]' key={product._id}>
                                          <div className='w-full h-[1px] bg-[rgb(235_235_240)]'></div>
                                          <div className='w-full flex'>
                                                <div className='flex-1 flex  gap-[16px]'>
                                                      <div className='relative p-[4px] border-[1px] rounded border-[rgb(235_235_240)]'>
                                                            <img
                                                                  src={product.product_id.product_thumb_image.secure_url}
                                                                  className='w-[75px] h-[75px]'
                                                                  alt=''
                                                            />

                                                            <div className='absolute bottom-0 right-0 min-w-[25px] w-max p-[4px] h-[25px] bg-slate-200 text-slate-500 flex items-center justify-center rounded-tl-[10px]'>
                                                                  x{product.quantity}
                                                            </div>
                                                      </div>
                                                      <div className='flex-1 flex flex-col gap-[8px] text-[12px] text-slate-900'>
                                                            <span>{product.product_id.product_name}</span>
                                                            <div className=' flex items-center gap-[4px] '>
                                                                  <Store color='gray' size={16} />
                                                                  <span>{product.shop_id.shop_name}</span>
                                                            </div>
                                                      </div>
                                                </div>
                                                <div style={{ direction: 'rtl' }} className='w-[16%] xl:w-[4%]'>
                                                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                                                            .format(product.product_id.product_price * product.quantity)
                                                            .replace('₫', '')}
                                                </div>
                                          </div>
                                    </div>
                              ))}
                        </div>
                        <div className='w-full h-[1px] bg-[rgb(235_235_240)]'></div>
                        <div className='min-h-[100px] h-max w-full  flex justify-end items-center'>
                              <div className='min-w-[150px] w-max flex flex-col items-end gap-[6px] rtl'>
                                    <p className='flex gap-[4px] text-[16px]'>
                                          <span>Tổng tiền:</span>
                                          <span style={{ direction: 'rtl' }}>
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                                                      .format(orderItem.order_total)
                                                      .replace('₫', '')}
                                          </span>
                                    </p>
                                    <button
                                          className='self-end w-[70px] h-[36px] border-[1px] border-blue-400 text-blue-300 rounded-none flex items-center justify-center text-[14px]'
                                          onClick={onBuyAgain}
                                    >
                                          Mua lại
                                    </button>
                              </div>
                        </div>

                        {/* <div className='w-full h-[1px] bg-slate-400'></div> */}
                  </div>
                  {/* ))} */}
            </section>
      )
}

export default OrderHistoryItem
