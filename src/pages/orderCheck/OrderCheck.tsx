import { useQuery } from '@tanstack/react-query'
import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Printer, Store } from 'lucide-react'
import { useReactToPrint } from 'react-to-print'

import OrderService from '../../apis/Order.service'
import NotFound from '../../component/Errors/NotFound'

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
      const [isNotFound, setIsNotFound] = useState(false)
      const getOrderId = useQuery({
            queryKey: ['get-order', order_id],
            queryFn: () =>
                  OrderService.getOrderInfo({
                        order_id: order_id as string,
                  }),
            enabled: Boolean(order_id),
      })

      useEffect(() => {
            if (getOrderId.isSuccess && !getOrderId.isLoading) {
                  setIsNotFound(true)
            }
      }, [getOrderId.isLoading, getOrderId.isSuccess])
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
            <>
                  {isNotFound ? (
                        <NotFound
                              ContentHeader='Không tìm thấy hóa đơn'
                              ContentDescription='Bạn có thể kiểm tra lại các mã chứng từ'
                              countTime={false}
                        />
                  ) : (
                        <div className='mx-auto my-[12px] flex flex-col items-start gap-[12px]'>
                              <div className='order-2 mx-auto flex max-w-[90vw] flex-col overflow-auto md:order-1'>
                                    {getOrderId.isSuccess && order && (
                                          <OrderPdf ref={contentRef} carts={products as CartProduct[]} orders={order} />
                                    )}

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
                  )}
            </>
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

      const formatMoney = (money: number) => `${new Intl.NumberFormat('vi-VN').format(money)} ₫`

      return (
            <div
                  ref={ref}
                  className='relative mx-auto min-h-[1123px] w-[794px] overflow-hidden bg-white text-[#172554] shadow-xl print:min-h-0 print:w-full print:shadow-none'
            >
                  {/* Watermark */}
                  <div className='pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden'>
                        <span className='-rotate-45 select-none whitespace-nowrap text-[92px] font-bold tracking-[14px] text-[#1d4ed8] opacity-[0.035]'>
                              KUROTIKI
                        </span>
                  </div>

                  <div className='relative z-10 flex min-h-[1123px] flex-col px-10 py-9 print:min-h-0'>
                        {/* Header */}
                        <header className='flex items-start justify-between border-b-2 border-[#2563eb] pb-5'>
                              <div className='flex items-start gap-4'>
                                    <img src='/logo.png' alt='KuroTiki' className='h-[54px] w-auto object-contain' />

                                    <div className='pt-0.5'>
                                          <h1 className='text-[20px] font-bold tracking-tight text-[#0f172a]'>KUROTIKI</h1>

                                          <p className='mt-1 text-[10px] text-[#64748b]'>
                                                Số hóa đơn: <span className='font-medium text-[#334155]'>{orders._id}</span>
                                          </p>

                                          <p className='mt-0.5 text-[10px] text-[#64748b]'>
                                                Ngày tạo: {convertDateToStringFull(orders.order_time_payment as Date)}
                                          </p>
                                    </div>
                              </div>

                              <div className='text-right'>
                                    <h2 className='text-[27px] font-bold tracking-tight text-[#1e3a8a]'>HÓA ĐƠN</h2>

                                    <div className='mt-2 inline-flex rounded-md bg-[#2563eb] px-3 py-1 text-[10px] font-semibold text-white'>
                                          #{String(orders._id).slice(-10).toUpperCase()}
                                    </div>
                              </div>
                        </header>

                        {/* Customer information */}
                        <section className='mt-6 grid grid-cols-2 gap-5'>
                              <div className='rounded-xl border border-[#dbeafe] bg-[#f8fbff] p-4'>
                                    <div className='mb-3 flex items-center gap-2'>
                                          <div className='flex h-7 w-7 items-center justify-center rounded-full bg-[#2563eb] text-white'>
                                                <Store size={14} />
                                          </div>
                                          <h3 className='text-[11px] font-bold uppercase tracking-wide text-[#1d4ed8]'>
                                                Thông tin người bán
                                          </h3>
                                    </div>

                                    <p className='text-[12px] font-bold text-[#0f172a]'>KUROTIKI</p>
                                    <p className='mt-2 text-[10px] leading-5 text-[#475569]'>Nền tảng thương mại điện tử KuroTiki</p>
                                    <p className='text-[10px] leading-5 text-[#475569]'>Hỗ trợ khách hàng và quản lý đơn hàng trực tuyến</p>
                              </div>

                              <div className='rounded-xl border border-[#dbeafe] bg-[#f8fbff] p-4'>
                                    <div className='mb-3 flex items-center gap-2'>
                                          <div className='flex h-7 w-7 items-center justify-center rounded-full bg-[#2563eb] text-white'>
                                                <span className='text-[12px] font-bold'>✓</span>
                                          </div>
                                          <h3 className='text-[11px] font-bold uppercase tracking-wide text-[#1d4ed8]'>
                                                Thông tin khách hàng
                                          </h3>
                                    </div>

                                    <p className='text-[12px] font-bold text-[#0f172a]'>
                                          {user?.fullName || user?.nickName || user?.email}
                                    </p>

                                    <p className='mt-2 text-[10px] leading-5 text-[#475569]'>
                                          Mỗi sản phẩm/gói hàng có thể sử dụng một địa chỉ nhận hàng riêng.
                                    </p>
                              </div>
                        </section>

                        {/* Shops */}
                        <section className='mt-7 flex flex-col gap-7'>
                              {Object.entries(dataAfterHandle).map(([shopId, shopProducts]) => {
                                    const shop = shopProducts[0]?.shop_id
                                    const subtotal = shopProducts.reduce(
                                          (sum, item) => sum + item.quantity * item.product_id.product_price,
                                          0,
                                    )

                                    return (
                                          <div key={shopId} className='break-inside-avoid'>
                                                <div className='mb-3 flex items-end justify-between gap-4'>
                                                      <div>
                                                            <div className='flex items-center gap-2 text-[#1d4ed8]'>
                                                                  <Store size={16} />
                                                                  <span className='text-[11px] font-bold uppercase tracking-wide'>
                                                                        Shop
                                                                  </span>
                                                            </div>

                                                            <h3 className='mt-1.5 text-[13px] font-semibold text-[#0f172a]'>
                                                                  {shop.shop_name}
                                                            </h3>
                                                      </div>

                                                      <span className='rounded-md bg-[#eff6ff] px-2.5 py-1 text-[9px] text-[#2563eb]'>
                                                            Mã shop: {shop._id}
                                                      </span>
                                                </div>

                                                <div className='overflow-hidden rounded-lg border border-[#dbeafe]'>
                                                      <table className='w-full table-fixed border-collapse'>
                                                            <thead>
                                                                  <tr className='bg-[#eff6ff] text-[#1e3a8a]'>
                                                                        <th className='w-[44%] px-3 py-2.5 text-left text-[9px] font-bold uppercase'>
                                                                              Sản phẩm
                                                                        </th>
                                                                        <th className='w-[14%] px-3 py-2.5 text-center text-[9px] font-bold uppercase'>
                                                                              Số lượng
                                                                        </th>
                                                                        <th className='w-[20%] px-3 py-2.5 text-right text-[9px] font-bold uppercase'>
                                                                              Đơn giá
                                                                        </th>
                                                                        <th className='w-[22%] px-3 py-2.5 text-right text-[9px] font-bold uppercase'>
                                                                              Thành tiền
                                                                        </th>
                                                                  </tr>
                                                            </thead>

                                                            <tbody>
                                                                  {shopProducts.map((product) => (
                                                                        <tr
                                                                              key={product.product_id._id}
                                                                              className='border-t border-[#e2e8f0]'
                                                                        >
                                                                              <td className='px-3 py-3 align-top'>
                                                                                    <p className='text-[10px] font-semibold leading-4 text-[#0f172a]'>
                                                                                          {product.product_id.product_name}
                                                                                    </p>

                                                                                    <div className='mt-2 rounded-md bg-[#f8fbff] px-2 py-1.5'>
                                                                                          <p className='text-[8px] font-semibold uppercase tracking-wide text-[#2563eb]'>
                                                                                                Địa chỉ nhận hàng
                                                                                          </p>
                                                                                          <p className='mt-0.5 text-[8px] leading-3.5 text-[#64748b]'>
                                                                                                {renderStringAddressDetailV2(
                                                                                                      product.cart_address,
                                                                                                )}
                                                                                          </p>
                                                                                    </div>
                                                                              </td>

                                                                              <td className='px-3 py-3 text-center text-[10px] text-[#334155]'>
                                                                                    {product.quantity}
                                                                              </td>

                                                                              <td className='px-3 py-3 text-right text-[10px] font-medium text-[#334155]'>
                                                                                    {formatMoney(product.product_id.product_price)}
                                                                              </td>

                                                                              <td className='px-3 py-3 text-right text-[10px] font-semibold text-[#0f172a]'>
                                                                                    {formatMoney(
                                                                                          product.quantity *
                                                                                                product.product_id.product_price,
                                                                                    )}
                                                                              </td>
                                                                        </tr>
                                                                  ))}
                                                            </tbody>
                                                      </table>

                                                      <div className='flex items-center justify-end gap-3 border-t border-dashed border-[#bfdbfe] bg-[#f8fbff] px-4 py-2.5'>
                                                            <span className='text-[9px] text-[#64748b]'>Tạm tính ({shop.shop_name})</span>
                                                            <span className='text-[11px] font-bold text-[#1d4ed8]'>
                                                                  {formatMoney(subtotal)}
                                                            </span>
                                                      </div>
                                                </div>
                                          </div>
                                    )
                              })}
                        </section>

                        {/* Total */}
                        <section className='mt-7 flex justify-end'>
                              <div className='w-[330px] rounded-xl border border-[#dbeafe] bg-[#f8fbff] p-4'>
                                    <div className='flex justify-between py-1.5 text-[10px] text-[#475569]'>
                                          <span>Tổng cộng ({totalShops} shop)</span>
                                          <span className='font-semibold text-[#0f172a]'>{formatMoney(orders.order_total)}</span>
                                    </div>

                                    <div className='flex justify-between py-1.5 text-[10px] text-[#475569]'>
                                          <span>Phí vận chuyển</span>
                                          <span className='font-semibold text-[#16a34a]'>{formatMoney(0)}</span>
                                    </div>

                                    <div className='my-3 h-px bg-[#2563eb]' />

                                    <div className='flex items-center justify-between gap-5'>
                                          <span className='text-[13px] font-bold uppercase text-[#1e3a8a]'>Thành tiền</span>
                                          <span className='text-[20px] font-bold text-[#2563eb]'>{formatMoney(orders.order_total)}</span>
                                    </div>

                                    <p className='mt-1.5 text-right text-[9px] text-[#64748b]'>(Đã bao gồm VAT nếu có)</p>
                              </div>
                        </section>

                        {/* Notes */}
                        <section className='mt-7 rounded-xl border border-dashed border-[#bfdbfe] bg-[#f8fbff] p-4'>
                              <p className='text-[10px] font-bold text-[#2563eb]'>Lưu ý</p>

                              <div className='mt-2 space-y-1 text-[9px] leading-4 text-[#64748b]'>
                                    <p>• Vui lòng kiểm tra kỹ thông tin đơn hàng và sản phẩm.</p>
                                    <p>• Hóa đơn này được tạo tự động từ hệ thống và không cần ký tên.</p>
                                    <p>• Cảm ơn bạn đã mua hàng tại KuroTiki.</p>
                              </div>
                        </section>

                        {/* Footer */}
                        <footer className='mt-auto pt-8'>
                              <div className='border-t border-[#2563eb] pt-4 text-center'>
                                    <p className='text-[10px] text-[#2563eb]'>
                                          Cảm ơn bạn đã mua hàng tại <span className='font-bold'>KuroTiki!</span>
                                    </p>
                                    <p className='mt-1 text-[9px] text-[#94a3b8]'>Mã hóa đơn: #{String(orders._id)}</p>
                              </div>
                        </footer>
                  </div>
            </div>
      )
})

OrderPdf.displayName = 'OrderPdf'

export default OrderCheck
