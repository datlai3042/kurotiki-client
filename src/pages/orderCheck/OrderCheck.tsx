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
                  <div className='order-2 md:order-1 max-w-[90vw] mx-auto overflow-auto  flex flex-col '>
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
                  <div ref={ref} className='pb-[24px] relative w-max h-screen'>
                        <div className='absolute inset-0 w-full h-full opacity-20  '></div>
                        <React.Fragment>
                              <div className='relative p-6 bg-white shadow-md rounded-md h-screen'>
                                    {/* Header */}
                                    <div className='flex justify-between items-center border-b pb-4'>
                                          <div className='flex items-center gap-3'>
                                                <img src='/logo.png' alt='Logo' className='' />
                                                <div>
                                                      <h1 className='text-lg font-semibold'>KUROTIKI</h1>
                                                      <p className='text-xs text-gray-500'>Invoice Number: {orders._id}</p>
                                                      <p className='text-xs text-gray-500'>
                                                            Date: {convertDateToStringFull(orders.order_time_payment as Date)}
                                                      </p>
                                                </div>
                                          </div>
                                          <div className='bg-blue-900 text-white font-bold px-6 py-2 text-lg rounded'>HÓA ĐƠN</div>
                                    </div>

                                    {/* Bill From / To */}
                                    <div className='grid grid-cols-2 gap-8 border-b py-6'>
                                          <div>
                                                <p className='font-semibold text-gray-700'>Bill from:</p>
                                                <p className='text-gray-600 text-sm'>Company Name</p>
                                                <p className='text-gray-600 text-sm'>Street Address, Zip Code</p>
                                          </div>
                                          <div>
                                                <p className='font-semibold text-gray-700'>Bill to:</p>
                                                <p className='text-gray-600 text-sm'>{user?.fullName || user?.nickName || user?.email}</p>
                                                <p className='text-gray-600 text-sm'>
                                                      {renderStringAddressDetailV2(carts?.[0]?.cart_address)}
                                                </p>
                                          </div>
                                    </div>

                                    {/* Items Table */}
                                    <div className='overflow-x-auto my-6'>
                                          <table className='min-w-full border border-gray-300'>
                                                <thead className='bg-gray-100'>
                                                      <tr>
                                                            <th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>
                                                                  Sản phẩm
                                                            </th>
                                                            <th className='px-4 py-2 text-center text-sm font-semibold text-gray-700'>
                                                                  Số lượng
                                                            </th>
                                                            <th className='px-4 py-2 text-center text-sm font-semibold text-gray-700'>
                                                                  Giá
                                                            </th>
                                                            <th className='px-4 py-2 text-center text-sm font-semibold text-gray-700'>
                                                                  Thuế
                                                            </th>
                                                            <th className='px-4 py-2 text-right text-sm font-semibold text-gray-700'>
                                                                  Tổng cộng
                                                            </th>
                                                      </tr>
                                                </thead>
                                                <tbody className='divide-y'>
                                                      {carts?.map((product) => (
                                                            <tr key={product.product_id._id}>
                                                                  <td className='px-4 py-2 text-sm text-gray-700'>
                                                                        {product.product_id.product_name}
                                                                  </td>
                                                                  <td className='px-4 py-2 text-sm text-center text-gray-700'>
                                                                        {product.quantity}
                                                                  </td>
                                                                  <td className='px-4 py-2 text-sm text-center text-gray-700'>
                                                                        <BoxMoney money={product.product_id.product_price} name='VNĐ' />
                                                                  </td>
                                                                  <td className='px-4 py-2 text-sm text-center text-gray-700'>0.00</td>
                                                                  <td className='px-4 py-2 text-sm text-right text-gray-700'>
                                                                        <BoxMoney
                                                                              money={product.quantity * product.product_id.product_price}
                                                                              name='VNĐ'
                                                                        />
                                                                  </td>
                                                            </tr>
                                                      ))}
                                                </tbody>
                                          </table>
                                    </div>

                                    {/* Footer */}
                                    <div className='flex justify-end mt-6'>
                                          <div className='w-full max-w-sm space-y-2 text-sm text-gray-800'>
                                                <div className='flex justify-between'>
                                                      <span>Tổng cộng:</span>
                                                      <span>{orders.order_total}</span>
                                                </div>
                                                <div className='flex justify-between'>
                                                      <span>Giảm giá:</span>
                                                      <span>0.00</span>
                                                </div>
                                                <div className='flex justify-between'>
                                                      <span>Thuế:</span>
                                                      <span>0.00</span>
                                                </div>
                                                <div className='flex justify-between font-semibold text-blue-900 border-t-2 border-blue-900 pt-2 text-lg'>
                                                      <span>Thành tiền:</span>
                                                      <span>{orders.order_total}</span>
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
