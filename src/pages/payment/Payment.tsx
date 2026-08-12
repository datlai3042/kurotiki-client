import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Check, ChevronRight, ShieldCheck } from 'lucide-react'
import { useSelector } from 'react-redux'

import LogoTiki from '../../component/Header/Components/logo.png'
import HeaderBoxHover from '../../component/Header/Components/HeaderBoxHover'
import CartUserInfo from '../../component/Cart/CartUserInfo'
import NotFound from '../../component/Errors/NotFound'

import CartService from '../../apis/cart.service'
import PaymentCart from './PaymentCart'
import PaymentItem from './PaymentItem'
import PaymentInvoice from './PaymendInvoice'

import { RootState } from '../../store'
import { UserResponse } from '../../types/user.type'
import { CartProduct, CartResponse } from '../../types/cart.type'
import { OrderItem } from '../../types/order.type'
import HeaderLogoToggle from '../../component/Header/Components/HeaderLogoToggle'

const Payment = () => {
      const [price, setPrice] = useState(0)
      const [stateOrder, setStateOrder] = useState(false)
      const [dataOrder, setDataOrder] = useState<OrderItem | undefined>(undefined)

      const user = useSelector((state: RootState) => state.authentication.user) as UserResponse
      const [activeStep, setActiveStep] = useState<1 | 2>(1)
      const payQuery = useQuery({
            queryKey: ['v1/api/cart/cart-pay'],
            queryFn: () => CartService.calculatorPrice(),
      })

      const onSuccesOrder = ({ message, order_success }: { message: string; order_success: OrderItem }) => {
            if (message === 'SUCCESS') {
                  setDataOrder(order_success)
                  setStateOrder(true)
                  setActiveStep(2)
            }
      }
      const paymentSteps = [
            {
                  id: 1,
                  label: 'Giao hàng',
            },
            {
                  id: 2,
                  label: 'Thanh toán',
            },
      ] as const
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
                        let result = 0

                        payQuery.data.data.metadata.carts.cart_products.forEach((cartItem) => {
                              result += cartItem.quantity * cartItem.product_id.product_price
                        })

                        return result
                  })
            }
      }, [payQuery.isSuccess, payQuery.data?.data])

      const carts = payQuery.data?.data.metadata.carts
      const cartProducts = carts?.cart_products ?? []

      return (
            <div className='min-h-screen w-full bg-color-section-theme text-text-theme'>
                  <div className='mx-auto min-h-screen w-full'>
                        <header className='sticky top-0 z-[500] border-b border-[var(--border-color-input)] bg-color-section-theme/95 backdrop-blur-md'>
                              <div className='mx-auto flex h-[78px] w-full max-w-[1500px] items-center justify-between px-4 md:px-6 xl:px-8'>
                                    <div className='flex min-w-0 items-center gap-4'>
                                          <HeaderLogoToggle />

                                          <div className='hidden h-8 w-px bg-[var(--border-color-input)] sm:block' />

                                          <div className='min-w-0'>
                                                <p className='text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400'>
                                                      Checkout
                                                </p>
                                                <h1 className='truncate text-lg font-semibold text-blue-500 md:text-xl'>Thanh toán</h1>
                                          </div>
                                    </div>

                                    <div className='hidden items-center gap-3 xl:flex'>
                                          {paymentSteps.map((step, index) => {
                                                const isActive = activeStep === step.id
                                                const isCompleted = activeStep > step.id

                                                return (
                                                      <React.Fragment key={step.id}>
                                                            <div className='flex items-center gap-2'>
                                                                  <div
                                                                        className={`
                                          flex h-7 w-7 items-center justify-center rounded-full
                                          border text-xs font-semibold transition-all duration-300
                                          ${
                                                isActive
                                                      ? 'border-blue-500 bg-blue-500 text-white shadow-[0_0_0_4px_rgba(59,130,246,0.12)]'
                                                      : isCompleted
                                                      ? 'border-blue-500 bg-blue-500 text-white'
                                                      : 'border-[var(--border-color-input)] text-slate-400'
                                          }
                                    `}
                                                                  >
                                                                        {isCompleted ? <Check size={15} strokeWidth={2.5} /> : step.id}
                                                                  </div>

                                                                  <span
                                                                        className={`
                                          text-xs font-medium transition-colors
                                          ${isActive || isCompleted ? 'text-blue-500' : 'text-slate-400'}
                                    `}
                                                                  >
                                                                        {step.label}
                                                                  </span>
                                                            </div>

                                                            {index < paymentSteps.length - 1 && (
                                                                  <ChevronRight
                                                                        size={14}
                                                                        className={isCompleted ? 'text-blue-500' : 'text-slate-400'}
                                                                  />
                                                            )}
                                                      </React.Fragment>
                                                )
                                          })}
                                    </div>

                                    <div className='group relative z-[601] hidden items-center gap-2 xl:flex'>
                                          <button className='flex items-center gap-2 rounded-full px-2 py-1.5 transition-colors hover:bg-blue-500/10'>
                                                {user ? (
                                                      <img
                                                            src={user?.avatar?.secure_url || user.avatar_url_default}
                                                            className='h-8 w-8 rounded-full border border-[var(--border-color-input)] object-cover'
                                                            alt='avatar'
                                                      />
                                                ) : (
                                                      <img
                                                            src='https://salt.tikicdn.com/ts/upload/07/d5/94/d7b6a3bd7d57d37ef6e437aa0de4821b.png'
                                                            alt='avatar'
                                                            className='h-8 w-8 rounded-full'
                                                      />
                                                )}
                                                <span className='text-sm font-semibold text-blue-500'>Tài khoản</span>
                                          </button>

                                          <div className='absolute right-0 top-[42px] hidden pt-2 group-hover:block'>
                                                <HeaderBoxHover />
                                          </div>
                                    </div>
                              </div>
                        </header>

                        {payQuery.isLoading && (
                              <div className='mx-auto flex min-h-[420px] max-w-[1500px] items-center justify-center px-4'>
                                    <div className='flex flex-col items-center gap-3'>
                                          <div className='h-9 w-9 animate-spin rounded-full border-4 border-blue-500/20 border-t-blue-500' />
                                          <span className='text-sm text-slate-400'>Đang tải thông tin thanh toán...</span>
                                    </div>
                              </div>
                        )}

                        {payQuery.isSuccess && cartProducts.length > 0 && (
                              <main className='mx-auto grid w-full max-w-[1500px] grid-cols-1 gap-5 px-4 py-5 md:px-6 xl:grid-cols-[minmax(0,1fr)_420px] xl:px-8 xl:py-7'>
                                    <section className='min-w-0'>
                                          {!stateOrder && (
                                                <div className='overflow-hidden rounded-2xl border border-[var(--border-color-input)] bg-color-section-theme shadow-[0_10px_35px_rgba(15,23,42,0.06)]'>
                                                      <div className='border-b border-[var(--border-color-input)] px-5 py-5 md:px-6'>
                                                            <div className='flex items-center gap-3'>
                                                                  <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500'>
                                                                        <span className='text-sm font-bold'>1</span>
                                                                  </div>

                                                                  <div>
                                                                        <h2 className='text-lg font-semibold md:text-xl'>
                                                                              Chọn hình thức giao hàng
                                                                        </h2>
                                                                        <p className='mt-1 text-xs text-slate-400 md:text-sm'>
                                                                              Kiểm tra sản phẩm và địa chỉ nhận hàng trước khi tiếp tục.
                                                                        </p>
                                                                  </div>
                                                            </div>
                                                      </div>

                                                      <div className='flex flex-col gap-5 p-4 md:p-6'>
                                                            {cartProducts.map((product, index) => (
                                                                  <PaymentItem key={product._id} product={product} index={index + 1} />
                                                            ))}

                                                            <div className='flex flex-col gap-3 rounded-xl border border-blue-500/20 bg-blue-500/[0.06] p-4 sm:flex-row sm:items-center sm:justify-between'>
                                                                  <div className='flex items-start gap-3'>
                                                                        <div className='mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500'>
                                                                              <ShieldCheck size={20} />
                                                                        </div>

                                                                        <div>
                                                                              <p className='text-sm font-semibold'>Giao hàng tiêu chuẩn</p>
                                                                              <p className='mt-1 text-xs leading-5 text-slate-400'>
                                                                                    Hệ thống sẽ sử dụng địa chỉ bạn đã chọn cho từng sản
                                                                                    phẩm.
                                                                              </p>
                                                                        </div>
                                                                  </div>

                                                                  <span className='w-fit rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-500'>
                                                                        Đã sẵn sàng
                                                                  </span>
                                                            </div>
                                                      </div>
                                                </div>
                                          )}

                                          {stateOrder && dataOrder && (
                                                <div className='animate-mountComponent overflow-hidden rounded-2xl border border-[var(--border-color-input)] bg-color-section-theme p-4 shadow-[0_10px_35px_rgba(15,23,42,0.06)] md:p-6'>
                                                      <div className='min-h-[400px] max-w-full'>
                                                            <PaymentInvoice carts={dataOrder.products} orders={dataOrder} />
                                                      </div>
                                                </div>
                                          )}
                                    </section>

                                    <aside className='flex h-max min-w-0 flex-col gap-4 xl:sticky xl:top-[98px]'>
                                          <div className='overflow-hidden rounded-2xl border border-[var(--border-color-input)] bg-color-section-theme shadow-[0_10px_35px_rgba(15,23,42,0.06)]'>
                                                <CartUserInfo products={cartProducts as CartProduct[]} />
                                          </div>

                                          <div className='overflow-hidden rounded-2xl border border-[var(--border-color-input)] bg-color-section-theme shadow-[0_10px_35px_rgba(15,23,42,0.06)]'>
                                                <PaymentCart
                                                      onOrderSuccess={onSuccesOrder}
                                                      carts={carts as CartResponse}
                                                      price={price}
                                                      product_payment={cartProducts as CartProduct[]}
                                                />
                                          </div>

                                          <div className='grid grid-cols-2 gap-2 rounded-2xl border border-[var(--border-color-input)] bg-color-section-theme p-3 text-center text-[11px] text-slate-400 shadow-[0_10px_35px_rgba(15,23,42,0.05)]'>
                                                <div className='rounded-xl bg-blue-500/[0.05] px-2 py-3'>
                                                      <ShieldCheck className='mx-auto mb-1.5 text-blue-500' size={19} />
                                                      <p className='font-semibold text-text-theme'>Thanh toán an toàn</p>
                                                </div>

                                                <div className='rounded-xl bg-blue-500/[0.05] px-2 py-3'>
                                                      <Check className='mx-auto mb-1.5 text-green-500' size={19} />
                                                      <p className='font-semibold text-text-theme'>Kiểm tra đơn dễ dàng</p>
                                                </div>
                                          </div>
                                    </aside>
                              </main>
                        )}

                        {payQuery.isSuccess && cartProducts.length === 0 && (
                              <div className='mx-auto mt-8 w-full max-w-[1500px] px-4 md:px-6 xl:px-8'>
                                    <div className='rounded-2xl border border-[var(--border-color-input)] bg-color-section-theme p-4'>
                                          <NotFound
                                                ContentHeader='Không có sản phẩm nào được thanh toán'
                                                ContentDescription='Vui lòng chọn sản phẩm trước khi vào trang này'
                                                countTime={false}
                                          />
                                    </div>
                              </div>
                        )}
                  </div>
            </div>
      )
}

export default Payment
