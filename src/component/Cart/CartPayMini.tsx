import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import CartService from '../../apis/cart.service'
import { useNavigate } from 'react-router-dom'
import BoxMoney from '../BoxUi/BoxMoney'
import { useDispatch } from 'react-redux'
import { addToast } from '../../Redux/toast'
import { BadgeCheck,  Receipt,  ShieldCheck } from 'lucide-react'

const CartPayMini = () => {
      const [price, setPrice] = useState(0)
      const dispatch = useDispatch()
      const navigate = useNavigate()

      const payQuery = useQuery({
            queryKey: ['v1/api/cart/cart-pay'],
            queryFn: () => CartService.calculatorPrice(),
      })

      const handleNavigate = () => {
            if (payQuery.isPending) return
            if (payQuery.isSuccess) {
                  if (payQuery.data.data.metadata.carts.cart_products.length === 0) {
                        dispatch(
                              addToast({
                                    type: 'WARNNING',
                                    message: 'Vui lòng chọn sản phẩm để thanh toán',
                                    id: Math.random.toString(),
                              }),
                        )
                        return
                  }
                  navigate('/payment')
                  return
            }
      }

      useEffect(() => {
            if (payQuery.isSuccess) {
                  if (payQuery?.data.data.metadata.carts) {
                        setPrice(() => {
                              let result: number = 0
                              payQuery?.data?.data?.metadata?.carts.cart_products &&
                                    payQuery?.data?.data?.metadata?.carts.cart_products.forEach((cartItem) => {
                                          result += cartItem.product_id.product_price * cartItem.quantity
                                    })
                              return result
                        })
                  } else {
                        setPrice(0)
                  }
            }
      }, [payQuery.isSuccess, payQuery.isPending, payQuery.data?.data.metadata.carts])

      const selectedCount = payQuery.data?.data?.metadata?.carts?.cart_products?.length || 0

      return (
            <React.Fragment>
                  <div className='overflow-hidden rounded-2xl border border-slate-200/70 bg-color-section-theme text-text-theme shadow-[0_5px_20px_rgba(15,23,42,0.035)] dark:border-white/[0.07]'>
                        <div className='flex items-center gap-2 border-b border-slate-200/60 px-4 py-4 dark:border-white/[0.06]'>
                              <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500'>
                                    <Receipt size={17} />
                              </div>

                              <div>
                                    <h4 className='text-[15px] font-semibold'>Thanh toán</h4>
                                    <p className='mt-0.5 text-[11px] text-slate-400'>
                                          Tóm tắt giá trị giỏ hàng
                                    </p>
                              </div>
                        </div>

                        <div className='px-4 py-4'>
                              <div className='flex flex-col gap-3 text-[13px]'>
                                    <div className='flex items-center justify-between gap-4'>
                                          <span className='text-slate-500 dark:text-slate-400'>Tạm tính</span>
                                          <span className='font-medium text-text-theme'>
                                                <BoxMoney money={price} name='VNĐ' />
                                          </span>
                                    </div>

                                    <div className='flex items-center justify-between gap-4'>
                                          <span className='text-slate-500 dark:text-slate-400'>Giảm giá</span>
                                          <span className='font-medium text-slate-500'>0 VNĐ</span>
                                    </div>

                                    <div className='flex items-center justify-between gap-4'>
                                          <span className='text-slate-500 dark:text-slate-400'>Phí vận chuyển</span>
                                          <span className='font-medium text-slate-500'>0 VNĐ</span>
                                    </div>
                              </div>

                              <div className='my-4 h-px w-full bg-slate-200/70 dark:bg-white/[0.06]' />

                              <div className='flex items-start justify-between gap-4'>
                                    <div>
                                          <p className='text-[14px] font-semibold text-text-theme'>Tổng tiền</p>
                                          <p className='mt-1 text-[11px] text-slate-400'>(Đã bao gồm VAT nếu có)</p>
                                    </div>

                                    <p className='text-right text-[20px] font-bold text-blue-600 dark:text-blue-400'>
                                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                                                .format(price)
                                                .replace('₫', '')}
                                          <span className='ml-1 text-[13px] font-semibold'>VNĐ</span>
                                    </p>
                              </div>

                              <button
                                    onClick={handleNavigate}
                                    disabled={payQuery.isPending}
                                    className='mt-5 flex h-12 w-full items-center justify-center rounded-xl bg-red-600 px-4 text-[15px] font-semibold text-white shadow-[0_8px_20px_rgba(220,38,38,0.16)] transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60'
                              >
                                    Mua hàng ({selectedCount})
                              </button>

                              <div className='mt-4 flex items-start gap-2 rounded-xl bg-emerald-500/[0.06] px-3 py-2.5'>
                                    <ShieldCheck size={15} className='mt-[2px] shrink-0 text-emerald-500' />
                                    <p className='text-[11px] leading-5 text-slate-500 dark:text-slate-400'>
                                          Thông tin thanh toán và địa chỉ của bạn được bảo mật.
                                    </p>
                              </div>
                        </div>
                  </div>

                  <div className='grid grid-cols-3 gap-2 rounded-2xl border border-slate-200/70 bg-color-section-theme px-3 py-4 text-center text-text-theme shadow-[0_5px_20px_rgba(15,23,42,0.035)] dark:border-white/[0.07]'>
                        <div className='flex flex-col items-center'>
                              <BadgeCheck size={20} className='text-blue-500' />
                              <p className='mt-2 text-[11px] font-medium'>Hàng thật</p>
                        </div>

                        <div className='flex flex-col items-center'>
                              <ShieldCheck size={20} className='text-blue-500' />
                              <p className='mt-2 text-[11px] font-medium'>An toàn</p>
                        </div>

                        <div className='flex flex-col items-center'>
                              <Receipt size={20} className='text-blue-500' />
                              <p className='mt-2 text-[11px] font-medium'>Rõ ràng</p>
                        </div>
                  </div>
            </React.Fragment>
      )
}

export default CartPayMini