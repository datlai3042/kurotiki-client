import { useQuery } from '@tanstack/react-query'
import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Printer, Store } from 'lucide-react'
import { useReactToPrint } from 'react-to-print'

import OrderService from '../../apis/Order.service'
import NotFound from '../../component/Errors/NotFound'
import BoxMoney from '../../component/BoxUi/BoxMoney'

import { RootState } from '../../store'
import { UserResponse } from '../../types/user.type'
import { CartProduct } from '../../types/cart.type'
import { OrderItem } from '../../types/order.type'

import { convertDateToStringFull } from '../../utils/date.utils'
import { renderStringAddressDetailV2 } from '../../utils/address.util'

const OrderCheck = () => {
      const { order_id } = useParams()

      const contentRef = useRef<HTMLDivElement>(null)

      const reactToPrintFn = useReactToPrint({
            contentRef,
      })

      const getOrderId = useQuery({
            queryKey: ['get-order', order_id],
            queryFn: () =>
                  OrderService.getOrderInfo({
                        order_id: order_id as string,
                  }),
            enabled: Boolean(order_id),
      })

      if (!order_id) {
            return <NotFound />
      }

      const orderInfo = getOrderId.data?.data.metadata.getOrderInfo

      if (!orderInfo && getOrderId.isSuccess) {
            return <NotFound />
      }

      const order = orderInfo?.order_products?.[0]
      const products = order?.products

      return (
            <div className='mx-auto my-[12px] flex flex-col items-start gap-[12px]'>
                  <div className='order-2 mx-auto flex max-w-[90vw] flex-col overflow-auto md:order-1'>
                        {getOrderId.isSuccess && order && <OrderPdf ref={contentRef} carts={products as CartProduct[]} orders={order} />}

                        {getOrderId.isPending && (
                              <div className='flex h-full basis-[40%] animate-pulse gap-[20px] bg-slate-300'>
                                    <div className='flex basis-[55%] gap-[12px]'>
                                          <div className='h-[60px] w-[60px] rounded-full' />

                                          <div className='flex flex-col justify-center gap-[8px]'>
                                                <p />
                                                <p />
                                          </div>
                                    </div>

                                    <div className='flex flex-1 basis-[45%] flex-col justify-between gap-[4px] bg-slate-100'>
                                          <p />
                                          <p />
                                          <p />

                                          <div className='flex items-center gap-[4px]'>
                                                <p />
                                                <div />
                                          </div>
                                    </div>
                              </div>
                        )}
                  </div>

                  <button
                        onClick={() => reactToPrintFn()}
                        type='button'
                        className='ml-auto  flex items-center gap-[8px] whitespace-pre rounded-[4px] bg-color-main p-[6px_8px] text-white opacity-80 hover:opacity-100'
                  >
                        <Printer size={16} />
                        In hóa đơn
                  </button>
            </div>
      )
}

interface OrderPdfProps {
      carts: CartProduct[]
      orders: OrderItem
      stylePdf?: React.CSSProperties
}

export const OrderPdf = forwardRef<HTMLDivElement, OrderPdfProps>(({ carts, orders }, ref) => {
      const user = useSelector((state: RootState) => state.authentication.user) as UserResponse

      const [dataAfterHandle, setDataAfterHandle] = useState<Record<string, CartProduct[]>>({})

      useEffect(() => {
            const shopData: Record<string, CartProduct[]> = {}

            carts?.forEach((product) => {
                  const shopId = product.shop_id._id

                  if (!shopData[shopId]) {
                        shopData[shopId] = []
                  }

                  shopData[shopId].push(product)
            })

            setDataAfterHandle(shopData)
      }, [carts])
      const totalShops = Object.keys(dataAfterHandle ?? {}).length
      return (
            <div ref={ref} className='relative  h-screen w-max pb-[24px]'>
                  <div className='absolute inset-0 h-full w-full opacity-20' />
                  <div className='relative z-20 h-screen gap-[20px] flex flex-col rounded-md bg-white p-6 py-10 shadow-md'>
                        <div className='pointer-events-none absolute inset-0 z-10 flex items-center justify-center'>
                              <span className='-rotate-45 select-none whitespace-nowrap text-[90px] font-bold tracking-[12px] text-blue-900 opacity-[0.05]'>
                                    KUROTIKI
                              </span>
                        </div>
                        {/* Header */}
                        <div className='flex items-center justify-between border-b pb-4'>
                              <div className='flex items-center gap-3'>
                                    <img src='/logo.png' alt='Logo' />

                                    <div>
                                          <h1 className='text-lg font-semibold'>KUROTIKI</h1>

                                          <p className='text-xs text-gray-500'>Số hóa đơn: {orders._id}</p>

                                          <p className='text-xs text-gray-500'>
                                                Ngày tạo: {convertDateToStringFull(orders.order_time_payment as Date)}
                                          </p>
                                    </div>
                              </div>

                              <div className='rounded bg-blue-900 px-6 py-2 text-lg font-bold text-white'>HÓA ĐƠN</div>
                        </div>

                        {/* Bill From / Bill To */}
                        <div className='grid grid-cols-2 gap-8 border-b py-6'>
                              <div>
                                    <p className='font-semibold text-gray-700'>Bill from:</p>

                                    <p className='text-sm text-gray-600'>Company Name</p>

                                    <p className='text-sm text-gray-600'>Street Address, Zip Code</p>
                              </div>

                              <div>
                                    <p className='font-semibold text-gray-700'>Bill to:</p>

                                    <p className='text-sm text-gray-600'>{user?.fullName || user?.nickName || user?.email}</p>

                                    <p className='text-sm text-gray-600'>{renderStringAddressDetailV2(carts?.[0]?.cart_address)}</p>
                              </div>
                        </div>
                        <div className='flex flex-col gap-1'>
                              {/* Products grouped by shop */}
                              {Object.entries(dataAfterHandle).map(([shopId, shopProducts]) => {
                                    const shop = shopProducts[0]?.shop_id

                                    const subtotal = shopProducts.reduce(
                                          (sum, item) => sum + item.quantity * item.product_id.product_price,
                                          0,
                                    )

                                    return (
                                          <div key={shopId}>
                                                <div className='my-6 overflow-x-auto'>
                                                      <div className='mb-3 flex items-center gap-2 text-gray-700'>
                                                            <Store className='text-[#1e3a8a]' size={18} />

                                                            <span className='text-sm font-semibold'>{shop.shop_name}</span>

                                                            <span className=' rounded bg-gray-500/10 px-2 py-0.5 text-xs text-gray-400'>
                                                                  Mã shop: {shop._id}
                                                            </span>
                                                      </div>

                                                      <div className='overflow-x-auto my-1'>
                                                            {' '}
                                                            <table className='min-w-full  '>
                                                                  {' '}
                                                                  <thead className='bg-gray-100'>
                                                                        {' '}
                                                                        <tr>
                                                                              {' '}
                                                                              <th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>
                                                                                    {' '}
                                                                                    Sản phẩm{' '}
                                                                              </th>{' '}
                                                                              <th className='px-4 py-2 text-center text-sm font-semibold text-gray-700'>
                                                                                    {' '}
                                                                                    Số lượng{' '}
                                                                              </th>{' '}
                                                                              <th className='px-4 py-2 text-center text-sm font-semibold text-gray-700'>
                                                                                    {' '}
                                                                                    Giá{' '}
                                                                              </th>{' '}
                                                                              <th className='px-4 py-2 text-right text-sm font-semibold text-gray-700'>
                                                                                    {' '}
                                                                                    Tổng cộng{' '}
                                                                              </th>{' '}
                                                                        </tr>{' '}
                                                                  </thead>{' '}
                                                                  <tbody className='divide-y'>
                                                                        {' '}
                                                                        {carts?.map((product) => (
                                                                              <tr key={product.product_id._id}>
                                                                                    {' '}
                                                                                    <td className='px-4 py-2 text-sm text-gray-700 '>
                                                                                          {' '}
                                                                                          {product.product_id.product_name}{' '}
                                                                                    </td>{' '}
                                                                                    <td className='px-4 py-2 text-sm text-center text-gray-700 '>
                                                                                          {' '}
                                                                                          {product.quantity}{' '}
                                                                                    </td>{' '}
                                                                                    <td className='px-4 py-2 text-sm text-center text-gray-700 '>
                                                                                          {' '}
                                                                                          <BoxMoney
                                                                                                money={product.product_id.product_price}
                                                                                                name='VNĐ'
                                                                                                colorBackground='bg-[#514751]'
                                                                                          />{' '}
                                                                                    </td>{' '}
                                                                                    <td className='px-4 py-2 text-sm text-right text-gray-700 flex justify-end'>
                                                                                          {' '}
                                                                                          <BoxMoney
                                                                                                money={
                                                                                                      product.quantity *
                                                                                                      product.product_id.product_price
                                                                                                }
                                                                                                name='VNĐ'
                                                                                                colorBackground='bg-[#514751]'
                                                                                          />{' '}
                                                                                    </td>{' '}
                                                                              </tr>
                                                                        ))}{' '}
                                                                  </tbody>{' '}
                                                            </table>{' '}
                                                      </div>

                                                      <div className='flex justify-end items-center  rounded bg-gray-500/10 px-2 py-1.5 text-xs text-gray-600'>
                                                            Tạm tính ({shop.shop_name}):&nbsp;
                                                            <BoxMoney money={subtotal} name='VNĐ' colorBackground='bg-[#514751]' />
                                                      </div>
                                                </div>
                                          </div>
                                    )
                              })}
                        </div>
                        <div className='mt-auto flex justify-end'>
                              <div className='w-full max-w-sm space-y-1 text-sm text-gray-800'>
                                    <div className='flex justify-between py-1.5'>
                                          <span>Tổng cộng ({totalShops} shop)</span>
                                          <BoxMoney money={orders.order_total} name='VNĐ' colorBackground='bg-[#514751]' />
                                    </div>
                                    <div className='flex justify-between py-1.5'>
                                          <span>Phí vận chuyển</span>
                                          <BoxMoney money={0} name='VNĐ' colorBackground='bg-[#514751]' />
                                    </div>
                                    <div className='flex justify-between border-t-2 border-blue-900 pt-2 text-lg font-semibold text-blue-900'>
                                          <span>Thành tiền:</span>

                                          <BoxMoney money={orders.order_total} name='VNĐ' colorBackground='bg-[#514751]' />
                                    </div>
                              </div>
                        </div>
                        {/* Footer */}
                  </div>
            </div>
      )
})

OrderPdf.displayName = 'OrderPdf'

export default OrderCheck
