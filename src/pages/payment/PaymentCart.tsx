import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CartProduct, CartResponse } from '../../types/cart.type'
import BoxMoney from '../../component/BoxUi/BoxMoney'
import { ChevronUp, ImageOff, ShoppingBag } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import OrderService from '../../apis/Order.service'
import { OrderItem } from '../../types/order.type'
import { checkAxiosError } from '../../utils/handleAxiosError'
import { addToast } from '../../Redux/toast'
import { useDispatch } from 'react-redux'
import BoxLoading from '../../component/BoxUi/BoxLoading'
import { onClearCacheNotifiaction } from '../../Redux/notification.slice'

type TProps = {
      carts: CartResponse
      price: number
      product_payment: CartProduct[]
      onOrderSuccess: ({ message, order_success }: { message: string; order_success: OrderItem }) => void
}

export type ParamOrderAdd = {
      products: Omit<CartProduct, '_id'>[]
      order_total: number
}

const PaymentCart = (props: TProps) => {
      const { carts, price, product_payment, onOrderSuccess } = props

      const productWrapperRef = useRef<HTMLDivElement>(null)
      const queryClient = useQueryClient()
      const dispatch = useDispatch()

      const [openSeeProduct, setOpenSeeProduct] = useState(false)
      const [disable, setDisable] = useState(false)

      const onClearEffect = () => {
            queryClient.invalidateQueries({ queryKey: ['v1/api/cart/cart-get-my-cart'] })
            queryClient.invalidateQueries({ queryKey: ['/v1/api/notification/get-my-notification', 'PRODUCT'] })
            dispatch(onClearCacheNotifiaction({ type: 'PRODUCT' }))
      }

      const orderPaymentMutation = useMutation({
            mutationKey: ['/v1/api/order/order-payment-product'],
            mutationFn: (orders: ParamOrderAdd) => OrderService.orderAddProduct(orders),

            onSuccess: (axiosResponse) => {
                  const { message, order_success } = axiosResponse.data.metadata
                  onOrderSuccess({ message, order_success })
                  onClearEffect()
            },

            onError: (error: unknown) => {
                  setDisable(false)

                  if (checkAxiosError<{ code: number; message: string; detail: string }>(error)) {
                        if (error.response?.data.code === 400 && error.response.data.message === 'Bad Request') {
                              dispatch(
                                    addToast({
                                          id: Math.random().toString(),
                                          type: 'ERROR',
                                          message: error.response.data.detail,
                                    }),
                              )
                        }
                  }
            },
      })

      const controllOpenSeeProduct = () => {
            setOpenSeeProduct((prev) => !prev)
      }

      const handleVerifyBuy = () => {
            if (disable || orderPaymentMutation.isPending) return

            setDisable(true)
            orderPaymentMutation.mutate({
                  products: product_payment,
                  order_total: price,
            })
      }

      useEffect(() => {
            if (productWrapperRef.current && !openSeeProduct) {
                  productWrapperRef.current.scrollTop = 0
            }
      }, [openSeeProduct])

      return (
            <div className='overflow-hidden rounded-2xl bg-color-section-theme text-text-theme'>
                  {/* Header */}
                  <div className='px-4 pt-4 md:px-5 md:pt-5'>
                        <div className='flex items-center justify-between'>
                              <div className='flex items-center gap-2'>
                                    <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500'>
                                          <ShoppingBag size={18} />
                                    </div>

                                    <div>
                                          <h4 className='text-sm font-semibold md:text-[15px]'>Đơn hàng</h4>
                                          <p className='mt-0.5 text-[11px] text-slate-400'>
                                                {carts?.cart_products.length} sản phẩm
                                          </p>
                                    </div>
                              </div>

                              <button
                                    type='button'
                                    onClick={controllOpenSeeProduct}
                                    className='flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium text-blue-500 transition-colors hover:bg-blue-500/10'
                              >
                                    {openSeeProduct ? 'Thu gọn' : 'Xem thông tin'}

                                    <ChevronUp
                                          size={16}
                                          className={`${openSeeProduct ? 'rotate-0' : 'rotate-180'} transition-transform duration-300`}
                                    />
                              </button>
                        </div>
                  </div>

                  {/* Product list */}
                  <div
                        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                              openSeeProduct ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                        }`}
                  >
                        <div className='overflow-hidden'>
                              <div
                                    ref={productWrapperRef}
                                    className='mt-4 max-h-[260px] overflow-y-auto border-y border-[var(--border-color-input)] px-4 py-3 md:px-5'
                              >
                                    <div className='flex flex-col gap-3'>
                                          {carts?.cart_products.map((product) => (
                                                <div
                                                      key={product.product_id._id}
                                                      className='flex items-center gap-3 rounded-xl bg-[var(--bg-color-theme)]/45 p-2.5'
                                                >
                                                      <div className='relative shrink-0'>
                                                            <div className='flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border border-[var(--border-color-input)] bg-white'>
                                                                  {product.product_id.product_thumb_image ? (
                                                                        <img
                                                                              src={product.product_id.product_thumb_image.secure_url}
                                                                              alt={product.product_id.product_name}
                                                                              className='h-full w-full object-contain'
                                                                        />
                                                                  ) : (
                                                                        <ImageOff size={17} className='text-slate-300' />
                                                                  )}
                                                            </div>

                                                            <span className='absolute -right-2 -top-2 flex min-w-6 items-center justify-center rounded-full border border-[var(--border-color-input)] bg-color-section-theme px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 shadow-sm'>
                                                                  x{product.quantity}
                                                            </span>
                                                      </div>

                                                      <div className='min-w-0 flex-1'>
                                                            <p className='line-clamp-2 text-xs font-medium leading-5 text-text-theme'>
                                                                  {product.product_id.product_name}
                                                            </p>
                                                      </div>

                                                      <div className='shrink-0 text-xs font-semibold'>
                                                            <BoxMoney
                                                                  money={product.quantity * product.product_id.product_price}
                                                                  name='đ'
                                                            />
                                                      </div>
                                                </div>
                                          ))}
                                    </div>
                              </div>
                        </div>
                  </div>

                  {/* Price summary */}
                  <div className='px-4 pb-4 pt-4 md:px-5 md:pb-5'>
                        <div className='flex flex-col gap-3 text-xs'>
                              <div className='flex items-center justify-between gap-4'>
                                    <span className='text-slate-400'>Tạm tính</span>

                                    <span className='font-medium text-text-theme'>
                                          {new Intl.NumberFormat('vi-VN').format(price)} VNĐ
                                    </span>
                              </div>

                              <div className='flex items-center justify-between gap-4'>
                                    <span className='text-slate-400'>Giảm giá</span>
                                    <span className='font-medium text-green-500'>-0đ</span>
                              </div>
                        </div>

                        <div className='my-4 h-px w-full bg-[var(--border-color-input)]' />

                        <div className='flex items-start justify-between gap-4'>
                              <span className='pt-1 text-sm font-semibold'>Tổng tiền</span>

                              <div className='text-right'>
                                    <div className='text-lg font-bold text-blue-500'>
                                          <BoxMoney name='VNĐ' money={price} />
                                    </div>

                                    <p className='mt-1 text-[10px] text-slate-400'>(Đã bao gồm VAT nếu có)</p>
                              </div>
                        </div>

                        {!orderPaymentMutation.isSuccess && (
                              <button
                                    type='button'
                                    disabled={disable || orderPaymentMutation.isPending}
                                    onClick={handleVerifyBuy}
                                    className='mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(220,38,38,0.18)] transition-all hover:bg-red-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60'
                              >
                                    <span>
                                          Mua hàng ({carts?.cart_products.length})
                                    </span>

                                    {orderPaymentMutation.isPending && <BoxLoading />}
                              </button>
                        )}

                        {orderPaymentMutation.isSuccess && (
                              <Link
                                    to='/'
                                    className='mt-5 flex h-12 w-full items-center justify-center rounded-xl bg-color-main px-4 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90'
                              >
                                    Thanh toán thành công, nhấn để quay về
                              </Link>
                        )}
                  </div>
            </div>
      )
}

export default PaymentCart