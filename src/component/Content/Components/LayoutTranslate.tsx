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
      const [widthElemnet, setWidthElement] = useState(150)
      const [limitShowProduct, setLimitShowProduct] = useState<number>(0)

      const { widthContainer } = useResetTransform(wrapperListProductsRef, (width: number) => {
            setCount(0)
            let result = width / Math.floor(width / 150)
            setWidthElement(result)
            PositionScrollCurrent.current = 0
      })
      const handleClickNext = () => {
            if (wrapperListProductsRef.current) {
                  setCount((prev) => prev + 1)
                  const numberScroll = widthElemnet * Math.floor(widthContainer / widthElemnet)
                  PositionScrollCurrent.current = PositionScrollCurrent.current - numberScroll
                  wrapperListProductsRef.current.style.transform = `translate3d(${PositionScrollCurrent.current}px, 0,0)`
                  wrapperListProductsRef.current.style.transition = `all 1s`
            }
      }

      const handleClickPrev = () => {
            if (wrapperListProductsRef.current) {
                  setCount((prev) => prev - 1)

                  const numberScroll = widthElemnet * Math.floor(widthContainer / widthElemnet)

                  PositionScrollCurrent.current = PositionScrollCurrent.current + numberScroll

                  wrapperListProductsRef.current.style.transform = `translate3d(${PositionScrollCurrent.current}px, 0,0)`
                  wrapperListProductsRef.current.style.transition = `all 1s`
            }
      }

      const styleEffect = {
            buttonPrev: count === 0 ? 'xl:hidden' : 'xl:flex',

            disButtonPrev: count === 0 ? true : false,
            disButtonNext: count === limitShowProduct ? true : false,
            onHidden: (length: number) => (length === count ? 'xl:hidden' : 'xl:flex'),

            onDisable: (length: number) => (length === count ? true : false),

            onActive: (isActive: boolean) => {
                  if (isActive) return 'bg-blue-50 border-blue-600 text-blue-600'

                  return 'bg-transparent border-gray-400 text-slate-600'
            },
      }

      useEffect(() => {
            if (wrapperListProductsRef.current) {
                  const num = Math.ceil(widthContainer / widthElemnet)
                  setLimitShowProduct(Math.ceil(products.length / num))
            }
      }, [products, widthContainer, widthElemnet])

      return (
            <>
                  {products.length > 0 ? (
                        <div className='group relative w-full h-[85%] overflow-hidden'>
                              <>
                                    <div className=' h-full w-full flex gap-[10px] pb-[8px] ' ref={wrapperListProductsRef}>
                                          {products?.map((product) => (
                                                <div
                                                      style={{ flexBasis: widthElemnet, flexShrink: 0 }}
                                                      key={product._id}
                                                      className='h-full '
                                                >
                                                      <ProductSmall product={product} />
                                                </div>
                                          ))}
                                    </div>
                                    <button
                                          className={` group-hover:flex hidden p-[4px] disabled:cursor-not-allowed absolute top-[50%] left-[0px] translate-y-[-50%]  bg-color-main text-[#fff]  rounded-full shadow-3xl`}
                                          onClick={handleClickPrev}
                                          disabled={styleEffect.disButtonPrev}
                                    >
                                          <ChevronLeft size={20} color='#fff' />
                                    </button>

                                    <button
                                          className={`group-hover:flex hidden p-[4px]  disabled:cursor-not-allowed absolute top-[50%] right-[0px] translate-y-[-50%] bg-color-main text-[#fff]  rounded-full shadow-3xl `}
                                          onClick={handleClickNext}
                                          disabled={styleEffect.disButtonNext}
                                    >
                                          <ChevronRight size={20} color='#fff' />
                                    </button>
                              </>
                        </div>
                  ) : (
                        <div className='w-full h-full flex flex-col items-center gap-[16px]'>
                              <img src={Empty} className='w-full h-[80%] object-contain' />
                              <span className='text-[20px] font-extrabold'>Không có sản phẩm tương ứng</span>
                        </div>
                  )}
            </>
      )
}

export default LayoutTranslate
