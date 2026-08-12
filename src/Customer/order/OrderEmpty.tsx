import React from 'react'
import { ArrowRight, PackageOpen, ShoppingBag, ShoppingCart, Star, Store } from 'lucide-react'
import { Link } from 'react-router-dom'

type EmptyMode = 'cart' | 'order' | 'review'

type TProps = {
      mode?: EmptyMode
}

const EMPTY_CONTENT: Record<
      EmptyMode,
      {
            icon: React.ReactNode
            badge: string
            title: string
            description: string
            action: string
            actionPath: string
      }
> = {
      cart: {
            icon: <ShoppingCart size={34} strokeWidth={1.7} />,
            badge: 'Giỏ hàng của bạn',
            title: 'Chưa có sản phẩm trong giỏ',
            description: 'Khám phá các sản phẩm phù hợp và thêm vào giỏ để bắt đầu mua sắm.',
            action: 'Khám phá sản phẩm',
            actionPath: '/',
      },
      order: {
            icon: <ShoppingBag size={34} strokeWidth={1.7} />,
            badge: 'Lịch sử mua hàng',
            title: 'Bạn chưa có đơn hàng nào',
            description: 'Sau khi hoàn tất mua sắm, các đơn hàng của bạn sẽ được lưu và hiển thị tại đây.',
            action: 'Bắt đầu mua sắm',
            actionPath: '/',
      },
      review: {
            icon: <Star size={34} strokeWidth={1.7} />,
            badge: 'Đánh giá sản phẩm',
            title: 'Chưa có đánh giá nào',
            description: 'Những sản phẩm bạn đã mua và đánh giá sẽ được tổng hợp tại khu vực này.',
            action: 'Xem sản phẩm đã mua',
            actionPath: '/customer/order',
      },
}

const OrderEmpty = ({ mode = 'order' }: TProps) => {
      const content = EMPTY_CONTENT[mode]

      return (
            <div className='relative flex  h-full w-full items-center justify-center overflow-hidden rounded-2xl  bg-color-section-theme px-5 py-10 text-text-theme'>
                  {/* soft background decoration */}
                  <div className='pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.04] blur-3xl' />

                  <div className='relative z-[1] flex w-full max-w-[520px] flex-col items-center text-center'>
                        <div className='relative'>
                              <div className='absolute inset-0 scale-125 rounded-[28px] bg-blue-500/10 blur-xl' />

                              <div className='relative flex h-[86px] w-[86px] items-center justify-center rounded-[26px] border border-blue-500/15 bg-blue-500/[0.08] text-blue-500 shadow-[0_12px_34px_rgba(59,130,246,0.12)]'>
                                    {content.icon}
                              </div>

                              <div className='absolute -bottom-1 -right-2 flex h-8 w-8 items-center justify-center rounded-full border-4 border-color-section-theme bg-blue-500 text-white shadow-md'>
                                    <PackageOpen size={14} />
                              </div>
                        </div>

                        <div className='mt-6 inline-flex items-center gap-1.5 rounded-full border border-blue-500/15 bg-blue-500/[0.06] px-3 py-1.5 text-[11px] font-semibold text-blue-500'>
                              <Store size={13} />
                              {content.badge}
                        </div>

                        <h3 className='mt-4 text-[20px] font-bold tracking-[-0.02em] sm:text-[22px]'>{content.title}</h3>

                        <p className='mt-2 max-w-[420px] text-[13px] leading-6 text-slate-500 dark:text-slate-400'>{content.description}</p>

                        <Link
                              to={content.actionPath}
                              className='mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-[13px] font-semibold text-white shadow-[0_8px_24px_rgba(37,99,235,0.2)] transition hover:bg-blue-500'
                        >
                              {content.action}
                              <ArrowRight size={16} />
                        </Link>

                        <div className='mt-7 flex items-center gap-2 text-[11px] text-slate-400'>
                              <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' />
                              Mọi đơn hàng đều được lưu tự động trong tài khoản
                        </div>
                  </div>
            </div>
      )
}

export default OrderEmpty
