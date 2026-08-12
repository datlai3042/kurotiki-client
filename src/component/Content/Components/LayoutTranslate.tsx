import React, { useEffect, useRef, useState } from 'react'
import ProductSmall from './ProductSmall'
import { TProductDetail } from '../../../types/product/product.type'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import useResetTransform from '../hooks/useResetTransform'
import Empty from '../assets/img/empty.webp'

type TProps = {
      products: TProductDetail[]
}

const LayoutTranslate = (props: TProps) => {
      const { products } = props

      const wrapperListProductsRef = useRef<HTMLDivElement>(null)
      const PositionScrollCurrent = useRef<number>(0)

      const [count, setCount] = useState(0)
      const [widthElemnet, setWidthElement] = useState(180)
      const [limitShowProduct, setLimitShowProduct] = useState<number>(0)

      const { widthContainer } = useResetTransform(wrapperListProductsRef, (width: number) => {
            setCount(0)

            const minCardWidth = window.innerWidth >= 1280 ? 180 : window.innerWidth >= 768 ? 170 : 155
            const columnCount = Math.max(1, Math.floor(width / minCardWidth))
            const result = width / columnCount

            setWidthElement(result)
            PositionScrollCurrent.current = 0
      })

      const handleClickNext = () => {
            if (!wrapperListProductsRef.current || count >= limitShowProduct) return

            setCount((prev) => prev + 1)

            const numberScroll = widthElemnet * Math.floor(widthContainer / widthElemnet)
            PositionScrollCurrent.current -= numberScroll

            wrapperListProductsRef.current.style.transform = `translate3d(${PositionScrollCurrent.current}px, 0, 0)`
            wrapperListProductsRef.current.style.transition = 'transform 500ms cubic-bezier(0.22, 1, 0.36, 1)'
      }

      const handleClickPrev = () => {
            if (!wrapperListProductsRef.current || count <= 0) return

            setCount((prev) => prev - 1)

            const numberScroll = widthElemnet * Math.floor(widthContainer / widthElemnet)
            PositionScrollCurrent.current += numberScroll

            wrapperListProductsRef.current.style.transform = `translate3d(${PositionScrollCurrent.current}px, 0, 0)`
            wrapperListProductsRef.current.style.transition = 'transform 500ms cubic-bezier(0.22, 1, 0.36, 1)'
      }

      useEffect(() => {
            if (!widthContainer || !widthElemnet) return

            const visibleCount = Math.max(1, Math.floor(widthContainer / widthElemnet))
            setLimitShowProduct(Math.max(0, Math.ceil(products.length / visibleCount) - 1))
      }, [products, widthContainer, widthElemnet])

      useEffect(() => {
            setCount(0)
            PositionScrollCurrent.current = 0

            if (wrapperListProductsRef.current) {
                  wrapperListProductsRef.current.style.transform = 'translate3d(0, 0, 0)'
            }
      }, [products])

      if (!products.length) {
            return (
                  <div className='flex h-full w-full flex-col items-center justify-center gap-3'>
                        <img src={Empty} className='h-[70%] w-full object-contain' alt='Không có sản phẩm' />
                        <span className='text-sm font-semibold text-slate-500'>Không có sản phẩm tương ứng</span>
                  </div>
            )
      }

      return (
            <div className='group relative h-full w-full overflow-hidden'>
                  <div
                        ref={wrapperListProductsRef}
                        className='flex h-full w-full gap-3 pb-1 will-change-transform'
                  >
                        {products.map((product) => (
                              <div
                                    style={{ flexBasis: widthElemnet, flexShrink: 0 }}
                                    key={product._id}
                                    className='h-full'
                              >
                                    <ProductSmall product={product} />
                              </div>
                        ))}
                  </div>

                  {count > 0 && (
                        <button
                              type='button'
                              onClick={handleClickPrev}
                              className='absolute left-2 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--border-color-input)] bg-color-section-theme text-text-theme shadow-lg transition hover:border-blue-500/40 hover:bg-blue-500 hover:text-white group-hover:flex'
                              aria-label='Sản phẩm trước'
                        >
                              <ChevronLeft size={19} />
                        </button>
                  )}

                  {count < limitShowProduct && (
                        <button
                              type='button'
                              onClick={handleClickNext}
                              className='absolute right-2 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--border-color-input)] bg-color-section-theme text-text-theme shadow-lg transition hover:border-blue-500/40 hover:bg-blue-500 hover:text-white group-hover:flex'
                              aria-label='Sản phẩm tiếp theo'
                        >
                              <ChevronRight size={19} />
                        </button>
                  )}
            </div>
      )
}

export default LayoutTranslate