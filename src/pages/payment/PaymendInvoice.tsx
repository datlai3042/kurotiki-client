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
import { Printer } from 'lucide-react'

const PaymentInvoice = ({ carts, orders }: { carts: CartProduct[]; orders: OrderItem }) => {
      const user = useSelector((state: RootState) => state.authentication.user) as UserResponse
      const contentRef = useRef<HTMLDivElement>(null)
      const reactToPrintFn = useReactToPrint({ contentRef })

      if (!orders) return <NotFound />

      return (
            <div className='flex flex-col  mx-auto gap-[50px] '>
                  <div className='w-full flex flex-wrap justify-center items-center gap-[16px]'>
                        <p className='text-center text-[28px] text-text-theme'>Thanh toán thành công</p>
                        <button
                              onClick={() => reactToPrintFn()}
                              className='whitespace-pre ml-auto mr-[20px] flex items-center gap-[8px] md:m-0 md:sticky top-[100px] p-[6px_8px] rounded-[4px] opacity-80 hover:opacity-100 bg-color-main text-[#fff]'
                        >
                              <Printer />
                              In Hóa đơn
                        </button>
                  </div>
                  <div className=' max-w-[85%] mx-auto  bg-[#ffffff] flex flex-col '>
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
