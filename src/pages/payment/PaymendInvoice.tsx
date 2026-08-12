import React, { useRef } from 'react'
import { CartProduct } from '../../types/cart.type'
import { OrderItem } from '../../types/order.type'
import { initializeUseSelector, useSelector } from 'react-redux/es/hooks/useSelector'
import { useReactToPrint } from 'react-to-print'
import { useQuery } from '@tanstack/react-query'
import { RootState } from '../../store'
import { UserResponse } from '../../types/user.type'
import NotFound from '../../component/Errors/NotFound'
import { OrderPdf } from '../orderCheck/OrderCheck'
import { ArrowRight, Check, Printer } from 'lucide-react'

const PaymentInvoice = ({ carts, orders }: { carts: CartProduct[]; orders: OrderItem }) => {
      const user = useSelector((state: RootState) => state.authentication.user) as UserResponse
      const contentRef = useRef<HTMLDivElement>(null)
      const reactToPrintFn = useReactToPrint({ contentRef })

      if (!orders) return <NotFound />

      return (
            <div className='flex flex-col  mx-auto gap-[50px] '>
                  <div className='bg-color-section-theme border-[var(--border-color-input)] rounded-xl p-10 flex flex-col items-center text-center'>
                        <div className='w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mb-5'>
                              <Check size={28} className='text-green-600' />
                        </div>
                        <h2 className='text-lg font-medium mb-1.5'>Thanh toán thành công</h2>
                        <p className='text-sm text-gray-500 mb-6'>Đơn hàng của bạn đã được ghi nhận và đang được xử lý.</p>

                        <div className='flex gap-2.5'>
                              <button
                                    onClick={() => reactToPrintFn()}
                                    className='flex items-center hover:text-black gap-1.5 border border-[var(--border-color-input)] px-4 py-2.5 rounded-md text-sm hover:bg-gray-50 transition-colors'
                              >
                                    <Printer size={15} />
                                    In hóa đơn
                              </button>
                              <button
                                    disabled
                                    className='flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2.5 rounded-md text-sm hover:bg-indigo-700 transition-colors'
                              >
                                    Theo dõi đơn hàng
                                    <ArrowRight size={15} />
                              </button>
                        </div>

                        <div className='w-full mt-8 pt-6 border-t border-[var(--border-color-input)] text-left'>
                              <p className='text-xs text-gray-400 mb-1.5'>Mã đơn hàng</p>
                              <p className='text-sm font-medium'>{orders._id}</p>
                        </div>
                  </div>

                  
                  <div className=' max-w-[85%] mx-auto overflow-auto bg-[#ffffff] flex flex-col hidden'>
                        <>
                              <React.Fragment>
                                    <OrderPdf carts={carts} ref={contentRef} orders={orders} />
                              </React.Fragment>
                        </>
                  </div>
            </div>
      )
}

export default PaymentInvoice
