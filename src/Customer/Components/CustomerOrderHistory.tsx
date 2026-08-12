import React, { useEffect, useRef, useState } from 'react'
import OrderHistory from '../order/OrderHistory'
import OrderCart from '../order/OrderCart'
import OrderComment from '../order/OrderComment'
import { useDebouncedCallback } from '@mantine/hooks'
import { MoreHorizontal, ShoppingBagIcon, ShoppingCartIcon, Star } from 'lucide-react'
import BoxResponsiveOverflow, { BoxResponsiveFlowClose } from '../../component/BoxUi/BoxResponsiveFlow'
import BoxWrapperCalcHeight from '../../component/BoxUi/BoxWrapperCalcHeight'

type Tab = 'CART' | 'ORDER' | 'Comment'
type Section = { text: string; shortText: string; code: Tab; icon: React.ReactNode }

const sectionName: Section[] = [
      { text: 'Sản phẩm trong giỏ', shortText: 'Giỏ hàng', icon: <ShoppingCartIcon className='h-[20px] w-[20px]' />, code: 'CART' },
      { text: 'Lịch sử mua hàng', shortText: 'Đã mua', icon: <ShoppingBagIcon className='h-[20px] w-[20px]' />, code: 'ORDER' },
      { text: 'Các đánh giá của bạn', shortText: 'Đánh giá', icon: <Star className='h-[20px] w-[20px]' />, code: 'Comment' },
]

const CustomerOrderHistory = () => {
      const [active, setActive] = useState<Tab>('CART')
      const [indexActive, setIndexActive] = useState(0)
      const wrapperOrderRef = useRef<HTMLDivElement>(null)

      const handleActive = (tab: Tab, index: number) => {
            setActive(tab)
            setIndexActive(index)
            if (wrapperOrderRef.current) {
                  const width = wrapperOrderRef.current.getBoundingClientRect().width
                  wrapperOrderRef.current.style.transform = `translate3d(${-width * index}px,0,0)`
                  wrapperOrderRef.current.style.transition = 'transform .2s ease'
            }
      }

      const debounceResize = useDebouncedCallback(() => {
            if (!wrapperOrderRef.current) return
            const width = wrapperOrderRef.current.getBoundingClientRect().width
            wrapperOrderRef.current.style.transform = `translate3d(${-width * indexActive}px,0,0)`
      }, 100)

      useEffect(() => {
            window.addEventListener('resize', debounceResize)
            return () => window.removeEventListener('resize', debounceResize)
      }, [debounceResize])

      return (
            <div className='relative flex h-max min-h-full w-full flex-col text-[12px] xl:text-[14px]'>
                  <div className='sticky top-[105px] z-[10] border-b border-[var(--border-color-input)] bg-color-section-theme pt-[16px] text-text-theme xl:top-[-1px] xl:pt-0'>
                        <BoxResponsiveOverflow
                              items={sectionName}
                              gap={4}
                              minVisible={2}
                              className='min-h-[64px] w-full'
                              itemContainerClassName='justify-start items-center'
                              itemClassName='shrink-0 flex-1 flex items-center justify-center'
                              getKey={(section) => section.code}
                              renderItem={(section, index) => {
                                    const isActive = active === section.code
                                    return (
                                          <button
                                                type='button'
                                                onClick={() => handleActive(section.code, index)}
                                                className={`relative flex h-[64px] min-w-[145px] shrink-0 items-center justify-center gap-2 px-[14px] font-medium transition-all sm:min-w-[175px] ${
                                                      isActive ? 'text-blue-600' : 'text-text-theme hover:bg-blue-500/5 hover:text-blue-500'
                                                }`}
                                          >
                                                {section.icon}
                                                <span className='whitespace-nowrap'>
                                                      <span className='sm:hidden'>{section.shortText}</span>
                                                      <span className='hidden sm:inline'>{section.text}</span>
                                                </span>
                                                {isActive && (
                                                      <span className='absolute inset-x-[14px] bottom-0 h-[3px] rounded-full bg-blue-600' />
                                                )}
                                          </button>
                                    )
                              }}
                              renderMore={({ open, hiddenCount }) => (
                                    <button
                                          type='button'
                                          onClick={open}
                                          title={`Xem thêm ${hiddenCount} mục`}
                                          className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-dashed border-blue-400 bg-blue-50 text-blue-500 dark:border-blue-500/50 dark:bg-blue-500/10'
                                    >
                                          <MoreHorizontal size={19} />
                                    </button>
                              )}
                              renderExpanded={({ items, close }) => (
                                    <BoxResponsiveFlowClose
                                          open
                                          onClose={close}
                                          title={
                                                <div>
                                                      <h3 className='text-base font-bold text-text-theme'>Quản lý mua hàng</h3>
                                                      <p className='mt-0.5 text-xs text-slate-500'>Chọn nội dung bạn muốn xem</p>
                                                </div>
                                          }
                                    >
                                          <div className='grid grid-cols-1 gap-[10px] sm:grid-cols-2'>
                                                {items.map((section) => {
                                                      const index = sectionName.findIndex((item) => item.code === section.code)
                                                      const isActive = active === section.code
                                                      return (
                                                            <button
                                                                  key={section.code}
                                                                  type='button'
                                                                  onClick={() => {
                                                                        handleActive(section.code, index)
                                                                        close()
                                                                  }}
                                                                  className={`flex min-h-[72px] items-center gap-3 rounded-xl border px-[14px] text-left transition ${
                                                                        isActive
                                                                              ? 'border-blue-500 bg-blue-500/10 text-blue-500'
                                                                              : 'border-[var(--border-color-input)] text-text-theme hover:border-blue-500/50 hover:bg-blue-500/5'
                                                                  }`}
                                                            >
                                                                  <div
                                                                        className={`flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full ${
                                                                              isActive ? 'bg-blue-500 text-white' : 'bg-slate-500/10'
                                                                        }`}
                                                                  >
                                                                        {section.icon}
                                                                  </div>
                                                                  <span className='text-[13px] font-medium'>{section.text}</span>
                                                            </button>
                                                      )
                                                })}
                                          </div>
                                    </BoxResponsiveFlowClose>
                              )}
                        />
                  </div>

                  <div className='mt-[10px] xl:mt-[32px] flex-1 bg-color-section-theme'>
                        <div className='w-full overflow-x-hidden'>
                              <BoxWrapperCalcHeight>
                                    <div ref={wrapperOrderRef} className='flex min-h-full w-full rounded-2xl'>
                                          <div className='w-full min-w-full max-w-full h-full'>{active === 'CART' && <OrderCart />}</div>
                                          <div className='w-full min-w-full max-w-full h-full'>{active === 'ORDER' && <OrderHistory />}</div>
                                          <div className='w-full min-w-full max-w-full h-full'>{active === 'Comment' && <OrderComment />}</div>
                                    </div>
                              </BoxWrapperCalcHeight>
                        </div>
                  </div>
            </div>
      )
}

export default CustomerOrderHistory
