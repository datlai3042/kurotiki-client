import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useRef, useState } from 'react'
import CartService from '../../apis/cart.service'
import CartItem from '../../component/Cart/CartItem'
import OrderHistory from '../order/OrderHistory'
import OrderCart from '../order/OrderCart'
import OrderComment from '../order/OrderComment'
import { useDebouncedCallback } from '@mantine/hooks'
import { ShoppingBagIcon, ShoppingCartIcon, Star } from 'lucide-react'

type Tab = 'CART' | 'ORDER' | 'Comment'

const sectionName: { text: string; code: Tab; icon: React.ReactNode }[] = [
      {
            text: 'Sản phẩm trong giỏ',
            icon: <ShoppingCartIcon className='w-[20px] h-[20px]' />,
            code: 'CART',
      },
      {
            text: 'Sản phẩm đã mua',
            icon: <ShoppingBagIcon className='w-[20px] h-[20px]' />,
            code: 'ORDER',
      },

      {
            text: 'Các đánh giá của bạn',
            icon: <Star className='w-[20px] h-[20px]' />,
            code: 'Comment',
      },
]

const CustomerOrderHistory = () => {
      const [active, setActive] = useState<Tab>('CART')

      const widthSection = `calc(100%/${sectionName.length})`
      const [indexActive, setIndexActive] = useState<number>(0)
      const wrapperOrderRef = useRef<HTMLDivElement>(null)

      const handleActive = (string: Tab, index: number) => {
            setActive(string)
            setIndexActive(index)
            if (wrapperOrderRef.current) {
                  const width = wrapperOrderRef.current.getBoundingClientRect().width
                  wrapperOrderRef.current.style.transform = `translate3d(${-width * index - 1 + 1}px,0,0)`
                  wrapperOrderRef.current.style.transition = `all .2s`
            }
      }

      const styleEffect = {
            left: indexActive === 0 ? 0 : `calc(100%/${sectionName.length}*${indexActive})`,
      }

      const debounceResize = useDebouncedCallback(() => {
            if (wrapperOrderRef.current) {
                  const width = wrapperOrderRef.current.getBoundingClientRect().width
                  wrapperOrderRef.current.style.transform = `translate3d(${-width * indexActive - 1 + 1}px,0,0)`
                  wrapperOrderRef.current.style.transition = `all .2s`
            }
      }, 100)
      useEffect(() => {
            window.addEventListener('resize', debounceResize)

            return () => {
                  window.removeEventListener('resize', debounceResize)
            }
      }, [])

      return (
            <div className='relative flex flex-col  min-h-full h-max w-full text-[12px] xl:text-[14px]'>
                  <div className='sticky top-[75px] xl:top-[-1px] pt-[16px] xl:pt-0  bg-color-section-theme text-text-theme flex flex-col gap-[8px]   z-[10] border-b-[1px] border-[var(--border-color-input)]'>
                        <div className='flex w-full h-full'>
                              {sectionName.map((section, index) => (
                                    <button
                                          key={section.code}
                                          style={{ width: widthSection }}
                                          className={`${active === section.code ? 'text-[#2d68f9]' : ''} font-medium w-full h-full  flex items-center gap-2 justify-center py-[20px]`}
                                          onClick={() => handleActive(section.code, index)}
                                    >
                                          <>{section.icon}</>
                                          {section.text}
                                    </button>
                              ))}
                        </div>
                        <div
                              style={{
                                    width: widthSection,
                                    left: styleEffect.left,
                              }}
                              className={`bottom-0 absolute  h-[3px] bg-blue-600 transition-all duration-200`}
                        ></div>
                  </div>

                  <div className='flex-1 mt-[32px] bg-color-section-theme'>
                        <div className='w-full overflow-x-hidden'>
                              <div style={{ width: '100%' }} ref={wrapperOrderRef} className='flex  min-h-[350px] h-max rounded-2xl'>
                                    {/* {active === 'CART' &&  */}
                                    <div className='min-w-full max-w-full w-full'>{active === 'CART' && <OrderCart />}</div>
                                    <div className='min-w-full max-w-full w-full'>{active === 'ORDER' && <OrderHistory />}</div>

                                    <div className='min-w-full'>{active === 'Comment' && <OrderComment />}</div>
                                    {/* } */}

                                    {/* {active === 'ORDER' */}
                                    {/* && */}
                                    {/* } */}
                              </div>
                        </div>
                  </div>
            </div>
      )
}

export default CustomerOrderHistory
