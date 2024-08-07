import React, { useEffect, useState } from 'react'
import LogoTiki from './assets/img/payment_logo_tiki.png'
import { Phone } from 'lucide-react'
import CartUserInfo from '../../component/Cart/CartUserInfo'
import { useQuery } from '@tanstack/react-query'
import CartService from '../../apis/cart.service'
import PaymentCart from './PaymentCart'
import PaymentItem from './PaymentItem'
import { Link } from 'react-router-dom'
import { CartProduct, CartResponse } from '../../types/cart.type'
import NotFound from '../../component/Errors/NotFound'
import { OrderItem } from '../../types/order.type'
import { PDFInvoice } from './PDFInvoice'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { PDFInvoiceImage } from './PDFInvoiceImage'

const Payment = () => {
      const [price, setPrice] = useState<number>(0)
      const [stateOrder, setStateOrder] = useState<boolean>(false)
      const [dataOrder, setDataOrder] = useState<OrderItem | undefined>(undefined)

      const payQuery = useQuery({
            queryKey: ['v1/api/cart/cart-pay'],
            queryFn: () => CartService.calculatorPrice(),
      })

      const onSuccesOrder = ({ message, order_success }: { message: string; order_success: OrderItem }) => {
            if (message === 'SUCCESS') {
                  setDataOrder(order_success)
                  setStateOrder(true)
            }
      }

      useEffect(() => {
            window.scrollTo({
                  top: 0,
                  left: 0,
                  behavior: 'smooth',
            })
      }, [])

      useEffect(() => {
            if (payQuery.isSuccess && payQuery.data.data.metadata.carts) {
                  console.log({ cart_id: payQuery.data.data.metadata.carts._id })
                  setPrice(() => {
                        let result: number = 0
                        payQuery.data.data.metadata.carts.cart_products.forEach((cartItem) => {
                              result += cartItem.quantity * cartItem.product_id.product_price
                        })
                        return result
                  })
            }
      }, [payQuery.isSuccess, payQuery.data?.data])

      return (
            <div className='w-full min-h-screen h-max'>
                  <div className='w-full min-h-screen px-[16px] xl:px-0 h-max flex flex-col'>
                        <header className='w-full h-[100px] p-[20px] xl:p-[15px_150px] bg-[#ffffff] flex justify-between items-start'>
                              <div className='w-[80%] xl:w-[1250px] mx-auto h-full flex gap-[16px] items-center'>
                                    <Link to={'/'}>
                                          <img src={LogoTiki} className='w-[65px] h-[65px]' alt='' />
                                    </Link>
                                    <div className='w-[1px] h-[50%] bg-blue-400'></div>
                                    <span className='text-blue-400 text-[14px] xl:text-[24px]'>Thanh toán</span>
                              </div>
                              <div className='w-[290px] xl:w-[300px] h-[65px] px-[4px] flex items-center gap-[8px] border-[1px] border-blue-400 rounded-3xl bg-blue-100 text-[12px]'>
                                    <div className='bg-blue-400 w-[40px] h-[40px] rounded-full flex items-center justify-center'>
                                          <Phone color='white' />
                                    </div>
                                    <div className='flex flex-col gap-[6px] '>
                                          <span className='font-semibold text-blue-400 text-[18px] '>1900-6035</span>
                                          <span className='text-[12px] xl:text-[14px]'>8h - 21h, cả T7 & CN</span>
                                    </div>
                              </div>
                        </header>
                        {payQuery.isSuccess &&
                              payQuery.data.data.metadata.carts &&
                              payQuery.data.data.metadata.carts.cart_products.length > 0 && (
                                    <section className='mt-[30px] w-full xl:w-[1250px] mx-auto min-h-screen h-max  flex flex-col xl:flex-row gap-[16px]'>
                                          {!stateOrder && (
                                                <div className='w-full xl:w-[70%] bg-[#ffffff] p-[20px] h-max'>
                                                      <h4>Chọn hình thức giao hàng</h4>
                                                      <div className='mt-[40px] flex flex-col gap-[70px]'>
                                                            {payQuery.isSuccess &&
                                                                  payQuery.data.data.metadata.carts.cart_products.map((product, index) => (
                                                                        <PaymentItem
                                                                              key={product._id}
                                                                              product={product}
                                                                              index={index + 1}
                                                                        />
                                                                  ))}
                                                      </div>
                                                </div>
                                          )}

                                          {stateOrder && dataOrder && (
                                                <div className='animate-mountComponent w-full xl:w-[70%] bg-[#ffffff] p-[20px] h-max'>
                                                      <p className='text-center text-[28px] text-slate-900'>Thanh toán thành công</p>
                                                      <div className='hidden xl:block w-[550px] min-h-[400px] h-max mx-auto'>
                                                            <PDFInvoiceImage
                                                                  orderTime={dataOrder.order_time_payment}
                                                                  products={dataOrder.products}
                                                                  orderTotal={dataOrder.order_total}
                                                            />
                                                      </div>
                                                      <div className='animate-pulse w-full hidden xl:flex justify-center items-center h-[40px] my-[40px]'>
                                                            <PDFDownloadLink
                                                                  document={
                                                                        <PDFInvoiceImage
                                                                              orderTime={dataOrder.order_time_payment}
                                                                              products={dataOrder.products}
                                                                              orderTotal={dataOrder.order_total}
                                                                        />
                                                                  }
                                                                  fileName='hoadon'
                                                                  style={{
                                                                        padding: '12px 16px',
                                                                        backgroundColor: 'black',
                                                                        color: '#ffffff',
                                                                        borderRadius: 6,
                                                                  }}
                                                            >
                                                                  Tải hóa đơn
                                                            </PDFDownloadLink>
                                                      </div>
                                                </div>
                                          )}
                                          <div className='w-full xl:w-[30%] h-max flex flex-col gap-[16px]'>
                                                <CartUserInfo
                                                      products={payQuery.data?.data.metadata.carts.cart_products as CartProduct[]}
                                                />
                                                <PaymentCart
                                                      onOrderSuccess={onSuccesOrder}
                                                      carts={payQuery.data?.data.metadata.carts as CartResponse}
                                                      price={price}
                                                      product_payment={payQuery.data?.data.metadata.carts.cart_products as CartProduct[]}
                                                />
                                          </div>
                                    </section>
                              )}

                        {payQuery.isSuccess &&
                              payQuery.data.data.metadata.carts &&
                              payQuery.data.data.metadata.carts.cart_products.length ===0 && (
                                    <div className='mt-[30px] w-full h-[600px] bg-[#fff] rounded-lg flex justify-center items-center'>
                                          Không có sản phẩm thanh toán
                                    </div>
                              )}
                      
                  </div>
            </div>
      )
}

export default Payment
