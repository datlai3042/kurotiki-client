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
import { Circle, CircleUser, Clock, ShoppingCart, Store } from 'lucide-react'
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
                        className='whitespace-pre ml-auto mr-[20px] md:m-0 md:sticky top-[100px] p-[6px_8px] rounded-[4px] opacity-80 hover:opacity-100 bg-color-main text-[#fff]'
                  >
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
                        <div
                              style={{
                                    backgroundImage: 'url("https://i.pinimg.com/originals/7f/21/5a/7f215a48eee6cfbad5bc735f0ca300c9.png")',
                                    backgroundPosition: 'center',
                                    backgroundSize: '120% 125%',
                              }}
                              className='absolute inset-0 w-full h-full opacity-20 '
                        ></div>
                        <React.Fragment>
                              <div className='relative 2'>
                                    <div className='flex flex-col gap-[36px] p-[12px] print:p-[16px_42px]'>
                                          <div className='flex flex-wrap flex-col gap-[20px]'>
                                                <div className='flex flex-wrap justify-center font-semibold gap-[6px]'>
                                                      <span className=' whitespace-pre'>Ngày in hóa đơn</span>
                                                      <span>{now}</span>
                                                </div>
                                                <div className='text-color-main flex justify-center font-semibold gap-[6px]  whitespace-pre'>
                                                      <span>Số lượng sản phẩm</span>
                                                      <span>{carts.length}</span>
                                                </div>
                                                <div className='text-center'>---/---</div>
                                          </div>{' '}
                                          <div className='flex flex-col gap-[80px]'>
                                                {carts?.map((product, index) => (
                                                      <div className='flex flex-col gap-[16px]' key={product.product_id._id}>
                                                            <div className='flex justify-between gap-[4px] text-color-main items-center  font-extrabold text-[24px]'>
                                                                  <p className='pl-[22px]'>
                                                                        <span>Sản phẩm: {index + 1}</span>
                                                                  </p>
                                                                  <ShoppingCart size={30} />
                                                            </div>
                                                            <div className='flex flex-col h-max gap-[40px]'>
                                                                  <div className='  flex flex-wrap items-start justify-between  gap-[32px]'>
                                                                        <div className='flex flex-col items-end gap-[12px]'>
                                                                              <p className='flex text-color-main items-center gap-[8px]'>
                                                                                    <Store size={20} />

                                                                                    <span className=' font-bold text-[18px] whitespace-pre'>
                                                                                          Nhà cung cấp
                                                                                    </span>
                                                                              </p>
                                                                              <img
                                                                                    src={
                                                                                          product.shop_id.shop_avatar?.secure_url ||
                                                                                          product.shop_id.shop_avatar_default
                                                                                    }
                                                                                    className='w-[120px] rounded-[4px] '
                                                                                    alt=''
                                                                              />
                                                                        </div>
                                                                        <div className='flex flex-col items-end gap-[12px] pl-[24px]'>
                                                                              <div className=' flex  gap-[8px] justify-center whitespace-pre'>
                                                                                    <p>Cửa hàng:</p>
                                                                                    <span className='text-color-main font-bold'>
                                                                                          {' '}
                                                                                          {product.shop_id.shop_name}
                                                                                    </span>
                                                                              </div>
                                                                        </div>
                                                                  </div>

                                                                  <div className='flex flex-col gap-[28px]'>
                                                                        <p className='flex text-color-main items-center gap-[8px]'>
                                                                              <Circle size={20} />

                                                                              <span className=' font-bold text-[18px]'>Sản phẩm</span>
                                                                        </p>
                                                                        <div className='flex flex-col xl:flex-row print:flex-row print:flex-nowrap gap-[36px] h-max xl:h-[270px]'>
                                                                              <div className='w-[280px] h-[280px]'>
                                                                                    <img
                                                                                          src={
                                                                                                product.product_id.product_thumb_image
                                                                                                      .secure_url
                                                                                          }
                                                                                          className='w-full h-full object-contain'
                                                                                          alt=''
                                                                                    />
                                                                              </div>
                                                                              <div className=' flex flex-col gap-[20px]'>
                                                                                    <div className='flex-1 flex flex-col gap-[16px] '>
                                                                                          <p>
                                                                                                Tên sản phẩm:{' '}
                                                                                                {product.product_id.product_name}
                                                                                          </p>
                                                                                          <p>Số lượng: {product.quantity}</p>
                                                                                          <p>Giá: {product.product_id.product_price}</p>
                                                                                          <div className='flex gap-[4px] items-center'>
                                                                                                <p>Thành tiền</p>
                                                                                                <BoxMoney
                                                                                                      money={
                                                                                                            product.quantity *
                                                                                                            product.product_id.product_price
                                                                                                      }
                                                                                                      name='VNĐ'
                                                                                                />
                                                                                          </div>
                                                                                    </div>
                                                                              </div>
                                                                        </div>
                                                                  </div>

                                                                  <div className='flex flex-col gap-[20px]'>
                                                                        <div className='flex text-color-main items-center gap-[8px]'>
                                                                              <CircleUser size={20} />
                                                                              <span className='font-bold text-[18px]'>
                                                                                    Thông tin người mua
                                                                              </span>
                                                                        </div>
                                                                        <div className='flex flex-col gap-[28px] h-max'>
                                                                              <div className='flex  gap-[20px]'>
                                                                                    <img
                                                                                          src={
                                                                                                user?.avatar?.secure_url ||
                                                                                                user?.avatar_url_default
                                                                                          }
                                                                                          className='min-w-[80px] h-[80px] rounded-full'
                                                                                          alt=''
                                                                                    />
                                                                                    <div className=' flex  flex-col gap-[8px] justify-center'>
                                                                                          <p>
                                                                                                {user?.fullName ||
                                                                                                      user?.nickName ||
                                                                                                      user?.email}
                                                                                          </p>
                                                                                          <p>
                                                                                                Địa chỉ:{' '}
                                                                                                {renderStringAddressDetailV2(
                                                                                                      product.cart_address,
                                                                                                )}
                                                                                          </p>
                                                                                    </div>
                                                                              </div>
                                                                        </div>
                                                                  </div>
                                                            </div>

                                                            <div className='relative w-full h-[1px] bg-slate-200 mt-[36px]'>
                                                                  <span className='absolute top-[-50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-max bg-[#ffffff] px-[12px]'>
                                                                        ---/---
                                                                  </span>
                                                            </div>
                                                      </div>
                                                ))}
                                          </div>
                                    </div>

                                    <div className='flex flex-col gap-[36px]  p-[12px] print:p-[12px_42px]'>
                                          <div className='relative w-full h-[1px] bg-slate-200 mt-[36px]'>
                                                <span className='absolute top-[-50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-max bg-[#ffffff] px-[12px]'>
                                                      Thông tin thanh toán
                                                </span>
                                          </div>

                                          <div className='flex flex-col gap-[16px] items-end'>
                                                <div className='flex gap-[6px] mt-[40px]'>
                                                      <span className='text-color-main font-extrabold'>Thời gian thanh toán:</span>
                                                      <span> {convertDateToStringFull(orders.order_time_payment as Date)}</span>
                                                </div>
                                                <p className='flex gap-[8px] items-center'>
                                                      <span className='text-color-main font-extrabold'>Tổng giá trị đơn hàng: </span>
                                                      <span className='text-slate-800 font-bold text-[24px]'>{orders.order_total}</span>
                                                </p>
                                          </div>

                                          <div className='relative w-full h-[1px] bg-slate-200 mt-[36px]'>
                                                <span className='absolute top-[-50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-max bg-[#ffffff] px-[12px]'>
                                                      ---/---
                                                </span>
                                          </div>
                                    </div>
                              </div>
                        </React.Fragment>
                  </div>
            )
      },
)

export default OrderCheck
