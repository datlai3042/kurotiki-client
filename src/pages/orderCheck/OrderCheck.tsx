import { useQuery } from '@tanstack/react-query'
import React, { forwardRef, useRef } from 'react'
import { useParams } from 'react-router-dom'
import OrderService from '../../apis/Order.service'
import NotFound from '../../component/Errors/NotFound'
import BoxMoney from '../../component/BoxUi/BoxMoney'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { UserResponse } from '../../types/user.type'
import { convertDateToStringFull } from '../../utils/date.utils'
import { renderStringAddressDetailV2 } from '../../utils/address.util'
import { Circle, CircleUser, Clock, Printer, ShoppingCart, Store } from 'lucide-react'
import { useReactToPrint } from 'react-to-print'
import { CartProduct } from '../../types/cart.type'
import { OrderItem } from '../../types/order.type'

const OrderCheck = () => {
      const { order_id } = useParams()
      const user = useSelector((state: RootState) => state.authentication.user) as UserResponse
      const contentRef = useRef<HTMLDivElement>(null)
      const reactToPrintFn = useReactToPrint({ contentRef })
      const getOrderId = useQuery({
            queryKey: ['get-order', order_id],
            queryFn: () => OrderService.getOrderInfo({ order_id: order_id as string }),
      })
      if (!order_id) return <NotFound />
      if (!getOrderId.data?.data.metadata.getOrderInfo && getOrderId.isSuccess) return <NotFound />

      const products = getOrderId.data?.data.metadata.getOrderInfo.order_products[0].products

      return (
            <div className='flex flex-wrap items-start mx-auto gap-[32px] my-[28px]'>
                  <div className='order-2 md:order-1 w-[720px] max-w-[90vw] mx-auto bg-[#ffffff] flex flex-col p-[24px_16px_50px] xl:p-[24px_20px_50px]'>
                        {getOrderId.isSuccess && (
                              <>
                                    <React.Fragment>
                                          <OrderPdf
                                                carts={products as CartProduct[]}
                                                ref={contentRef}
                                                orders={getOrderId.data?.data.metadata.getOrderInfo.order_products[0]}
                                          />
                                    </React.Fragment>
                              </>
                        )}

                        {getOrderId.isPending && (
                              <React.Fragment>
                                    <div className='animate-pulse basis-[40%] h-full flex  gap-[20px] bg-slate-300'>
                                          <div className='flex basis-[55%] gap-[12px] '>
                                                <div className='w-[60px] h-[60px] rounded-full'></div>
                                                <div className=' flex  flex-col gap-[8px] justify-center'>
                                                      <p></p>
                                                      <p></p>
                                                </div>
                                          </div>
                                          <div className=' basis-[45%] flex-1 flex flex-col gap-[4px] justify-between bg-slate-100'>
                                                <p></p>
                                                <p></p>
                                                <p></p>
                                                <div className='flex gap-[4px] items-center'>
                                                      <p></p>
                                                      <div className=''></div>
                                                </div>
                                          </div>
                                    </div>
                              </React.Fragment>
                        )}
                  </div>
                  <button
                        onClick={() => reactToPrintFn()}
                        className='whitespace-pre ml-auto mr-[20px] flex items-center gap-[8px] md:m-0 md:sticky top-[100px] p-[6px_8px] rounded-[4px] opacity-80 hover:opacity-100 bg-color-main text-[#fff]'
                  >
                        <Printer />
                        In Hóa đơn
                  </button>
            </div>
      )
}

export const OrderPdf = forwardRef<HTMLDivElement, { carts: CartProduct[]; orders: OrderItem; stylePdf?: React.CSSProperties }>(
      ({ carts, orders }, ref) => {
            const user = useSelector((state: RootState) => state.authentication.user) as UserResponse
            const now = convertDateToStringFull(new Date())
            return (
                  <div ref={ref} className='pb-[24px] relative'>
                        <div className='absolute inset-0 w-full h-full opacity-20 bg-[#fff] '></div>
                        <React.Fragment>
                              <div className='relative 2'>
                                    <div className='flex flex-col gap-[36px] p-[12px_36px] print:p-[16px_42px]'>
                                          <div className='flex justify-between flex-wrap gap-[20px]'>
                                                <div className='flex flex-col gap-[4px]'>
                                                      <div className='text-[#3e4044] text-[20px] font-semibold'>KUROTIKI</div>
                                                      <span className='text-[12px] text-color-main font-semibold'>{orders._id}</span>
                                                </div>
                                                <div>
                                                      <img src={'/logo.png'} className='min-w-[80px] h-[36px] ' alt='' />
                                                </div>
                                          </div>

                                          <div className='flex flex-col gap-[100px] my-[16px]'>
                                                {carts?.map((product, index) => (
                                                      <div className='flex flex-col gap-[16px]' key={product.product_id._id}>
                                                            <div className='flex flex-col h-max gap-[14px]'>
                                                                  <div className='flex justify-between gap-[16px] border-y-[1px] border-[#ebecef]'>
                                                                        <div className='flex-1 py-[10px] px-[6px] border-r-[1px] border-l-[1px] border-[#ebecef]'>
                                                                              <div className='flex flex-col gap-[1px] text-[13px]'>
                                                                                    <span className='text-[#4a4b4f] text-[14px] font-semibold'>
                                                                                          Khách hàng
                                                                                    </span>
                                                                                    <span className='text-[#92969d]'>
                                                                                          {user?.fullName || user?.nickName || user?.email}
                                                                                    </span>
                                                                              </div>
                                                                        </div>
                                                                        <div className='flex-1 py-[10px] px-[6px] border-r-[1px] border-[#ebecef]'>
                                                                              <div className='flex flex-col gap-[1px] text-[13px]'>
                                                                                    <span className='text-[#4a4b4f] text-[14px] font-semibold'>
                                                                                          Địa chỉ
                                                                                    </span>
                                                                                    <span className='text-[#92969d]'>
                                                                                          {renderStringAddressDetailV2(
                                                                                                product.cart_address,
                                                                                          )}
                                                                                    </span>
                                                                              </div>
                                                                        </div>
                                                                        <div className='flex-1 py-[10px] px-[6px] border-r-[1px] border-[#ebecef]'>
                                                                              <div className='flex flex-col gap-[1px] text-[13px]'>
                                                                                    <span className='text-[#4a4b4f] text-[14px] font-semibold'>
                                                                                          Nhà cung cấp
                                                                                    </span>
                                                                                    <span className='text-[#92969d]'>
                                                                                          {product.shop_id.shop_name}
                                                                                    </span>
                                                                              </div>
                                                                        </div>
                                                                  </div>
                                                                  <div className='flex flex-col gap-[28px]'>
                                                                        <div className='overflow-x-auto'>
                                                                              <table className='min-w-full divide-y divide-gray-200 border border-gray-300'>
                                                                                    <thead className='bg-gray-100'>
                                                                                          <tr>
                                                                                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                                                                                                      Hình ảnh
                                                                                                </th>
                                                                                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                                                                                                      Tên sản phẩm
                                                                                                </th>
                                                                                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                                                                                                      Số lượng
                                                                                                </th>
                                                                                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                                                                                                      Giá
                                                                                                </th>
                                                                                          </tr>
                                                                                    </thead>
                                                                                    <tbody className='bg-white divide-y divide-gray-200'>
                                                                                          <tr>
                                                                                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                                                                                                      <div className='w-[40px] rounded-[.4rem] h-[40px]'>
                                                                                                            <img
                                                                                                                  src={
                                                                                                                        product.product_id
                                                                                                                              .product_thumb_image
                                                                                                                              .secure_url
                                                                                                                  }
                                                                                                                  className='w-full h-full rounded-[.4rem] object-contain'
                                                                                                                  alt=''
                                                                                                            />
                                                                                                      </div>
                                                                                                </td>
                                                                                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                                                                                                     <p className='w-[200px] whitespace-pre-wrap'>
                                                                                                       {product.product_id.product_name}
                                                                                                     </p>
                                                                                                </td>
                                                                                                <td className='px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700'>
                                                                                                      {product.quantity}
                                                                                                </td>
                                                                                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                                                                                                      <BoxMoney
                                                                                                            money={
                                                                                                                  product.quantity *
                                                                                                                  product.product_id
                                                                                                                        .product_price
                                                                                                            }
                                                                                                            name='VNĐ'
                                                                                                      />
                                                                                                </td>
                                                                                          </tr>
                                                                                    </tbody>
                                                                              </table>
                                                                        </div>
                                                                  </div>
                                                            </div>
                                                      </div>
                                                ))}
                                          </div>
                                    </div>

                                    <div className='flex flex-col gap-[36px] mt-auto  p-[12px_0px] print:p-[12px_0px]'>
                                          <div className='w-full max-w-sm ml-auto mr-[36px] text-sm text-gray-800'>
                                                <div className='space-y-3 border-b border-gray-300 pb-4'>
                                                      <div className='flex justify-between font-medium'>
                                                            <span>Thời gian thanh toán</span>
                                                            <span>{convertDateToStringFull(orders.order_time_payment as Date)}</span>
                                                      </div>
                                                      <div className='flex justify-between'>
                                                            <span>Tiền phải trả</span>
                                                            <span>{orders.order_total}</span>
                                                      </div>
                                                      <div className='flex justify-between'>
                                                            <span>Thuế (0%)</span>
                                                            <span>0.00</span>
                                                      </div>
                                                      <div className='flex justify-between pt-4 border-t-4 border-purple-500 font-semibold text-purple-600'>
                                                            <span>Tổng thanh toán</span>
                                                            <span>{orders.order_total}</span>
                                                      </div>
                                                </div>
                                          </div>
                                    </div>
                              </div>
                        </React.Fragment>
                  </div>
            )
      },
)

export default OrderCheck
