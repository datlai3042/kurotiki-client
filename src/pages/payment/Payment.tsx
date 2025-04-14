import React, { useEffect, useState } from 'react'
import LogoTiki from '../../component/Header/Components/logo.png'
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
import HeaderBoxHover from '../../component/Header/Components/HeaderBoxHover'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { UserResponse } from '../../types/user.type'

const Payment = () => {
      const [price, setPrice] = useState<number>(0)
      const [stateOrder, setStateOrder] = useState<boolean>(false)
      const [dataOrder, setDataOrder] = useState<OrderItem | undefined>(undefined)
      const user = useSelector((state: RootState) => state.authentication.user) as UserResponse

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
            <div className='w-full min-h-[2000px] h-max'>
                  <div className='w-full min-h-screen px-[16px] xl:px-0 h-max flex flex-col'>
                        <header className='w-full h-[100px] p-[20px] bg-color-section-theme flex justify-between items-center'>
                              <div className=' h-full flex gap-[16px] items-center'>
                                    <Link to={'/'}>
                                          <img src={LogoTiki} className='' alt='' />
                                    </Link>
                                    <div className='w-[1px] h-[50%] bg-blue-400'></div>
                                    <span className='text-blue-400 text-[14px] xl:text-[24px]'>Thanh toán</span>
                              </div>
                              <div className=' px-[4px] flex items-center gap-[8px]   text-[12px]'>
                                    <div className='group relative z-[601] hidden xl:flex items-center px-2 gap-2 whitespace-pre'>
                                          {user ? (
                                                <img
                                                      src={user?.avatar?.secure_url || user.avatar_url_default}
                                                      className='w-[24px] h-[24px] rounded-full'
                                                      alt='avatar'
                                                />
                                          ) : (
                                                <img
                                                      src='https://salt.tikicdn.com/ts/upload/07/d5/94/d7b6a3bd7d57d37ef6e437aa0de4821b.png'
                                                      alt=''
                                                      className='w-[24px] h-[24px]'
                                                />
                                          )}
                                          <button className='text-blue-500 font-semibold'>Tài Khoản</button>
                                          <div className='absolute  top-[20px] z-[601] right-0 hidden group-hover:block'>
                                                <div className='w-full h-full pt-[10px]'>
                                                      <HeaderBoxHover />
                                                </div>
                                          </div>
                                    </div>
                              </div>
                        </header>
                        {payQuery.isSuccess && payQuery.data.data.metadata.carts?.cart_products?.length > 0 && (
                              <section className='mt-[30px] w-full  mx-auto min-h-screen h-max  flex flex-col xl:flex-row gap-[16px]'>
                                    {!stateOrder && (
                                          <div className='w-full xl:w-[70%] bg-color-section-theme text-text-theme p-[20px] h-max'>
                                                <h4>Chọn hình thức giao hàng</h4>
                                                <div className='mt-[40px] flex flex-col gap-[70px]'>
                                                      {payQuery.isSuccess &&
                                                            payQuery.data.data.metadata.carts.cart_products.map((product, index) => (
                                                                  <PaymentItem key={product._id} product={product} index={index + 1} />
                                                            ))}
                                                </div>
                                          </div>
                                    )}

                                    {stateOrder && dataOrder && (
                                          <div className='animate-mountComponent w-full xl:w-[70%] mb-[20px] bg-color-section-theme p-[20px] h-max'>
                                                <p className='text-center text-[28px] text-text-theme'>Thanh toán thành công</p>
                                                <div className='hidden xl:block w-[550px] min-h-[400px] h-max mx-auto'>
                                                      <PDFInvoice
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
                                                            fileName='hoadon_muahang'
                                                            style={{
                                                                  padding: '12px 16px',
                                                                  backgroundColor: 'var(--color-main)',
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
                                          <CartUserInfo products={payQuery.data?.data.metadata.carts.cart_products as CartProduct[]} />
                                          <PaymentCart
                                                onOrderSuccess={onSuccesOrder}
                                                carts={payQuery.data?.data.metadata.carts as CartResponse}
                                                price={price}
                                                product_payment={payQuery.data?.data.metadata.carts.cart_products as CartProduct[]}
                                          />
                                    </div>
                              </section>
                        )}

                        {payQuery.isSuccess && payQuery.data.data.metadata.carts.cart_products.length === 0 && (
                              <div className='mt-[32px]'>
                                    <NotFound
                                          ContentHeader='Không có sản phẩm nào được thanh toán'
                                          ContentDescription='Vui lòng cọn sản phẩm trước khi vào trang này'
                                    />
                              </div>
                        )}
                  </div>
            </div>
      )
}

export default Payment
