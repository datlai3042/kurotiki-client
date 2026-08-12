import React, { useEffect, useRef, useState } from 'react'
import ProductApi from '../../../apis/product.api'
import { useQuery } from '@tanstack/react-query'
import ProductSimplify from './ProductSimplify'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import useResetTransform from '../hooks/useResetTransform'

const ProductCare = () => {
      const wrapperListProductsRef = useRef<HTMLDivElement>(null)
      const PositionScrollCurrent = useRef<number>(0)
      const [limitShowProduct, setLimitShowProduct] = useState<number>(0)
      const [count, setCount] = useState(0)
      const [widthElemnet, setWidthElement] = useState(160)
      const { widthContainer } = useResetTransform(wrapperListProductsRef, (width: number) => {
            setCount(0)
            let result = width / Math.floor(width / 160) 
            setWidthElement(result)
            PositionScrollCurrent.current = 0
      })
      const allProduct = useQuery({
            queryKey: ['get-product-care'],
            queryFn: () => ProductApi.getAllProductCare(),
            staleTime: 1000 * 60 * 5,
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

                  // (Math.trunc(width))
                  wrapperListProductsRef.current.style.transform = `translate3d(${PositionScrollCurrent.current}px, 0,0)`
                  wrapperListProductsRef.current.style.transition = `all 1s`
            }
      }

      useEffect(() => {
            if (allProduct.isSuccess) {
                  if (wrapperListProductsRef.current) {
                        const num = Math.round(widthContainer / widthElemnet)
                        setLimitShowProduct(Math.ceil(allProduct.data.data.metadata.products.length / num - 1))
                  }
            }
      }, [allProduct.isSuccess, allProduct?.data?.data.metadata.products.length, widthContainer, widthElemnet])

      const styleEffect = {
            buttonPrev: count === 0 ? 'xl:hidden' : 'xl:flex',
            buttonNext: limitShowProduct === count ? 'xl:hidden' : 'xl:flex',
            disButtonPrev: count === 0 ? true : false,
            disButtonNext: limitShowProduct === count ? true : false,
      }
      const products = allProduct.data?.data.metadata.products

      return (
            <div className='relative group flex-1 h-max max-w-full px-3 sm:px-4'>
                  <div className='w-full  overflow-hidden'>
                        {products && products?.length > 0 && (
                              <div className='flex h-full w-full gap-3 pb-1 sm:gap-4' ref={wrapperListProductsRef}>
                                    {products &&
                                          products.map((product) => (
                                                <div
                                                      style={{ flexBasis: widthElemnet, flexShrink: 0 }}
                                                      className='h-full py-1'
                                                      key={product._id}
                                                >
                                                      <ProductSimplify product={product} />
                                                </div>
                                          ))}

                                    {allProduct.isPending && (
                                          <>
                                                {Array(6)
                                                      .fill(0)
                                                      ?.map((_, index) => (
                                                            <div
                                                                  className='animate-pulse w-full h-[300px] rounded-lg bg-slate-400'
                                                                  key={index}
                                                            ></div>
                                                      ))}
                                          </>
                                    )}
                              </div>
                        )}
                        {products && products.length === 0 && (
                              <div className=' w-full min-h-[298px] flex items-center justify-center text-[20px] font-semibold text-text-theme bg-color-section-theme rounded-lg'>
                                    Không có thông tin các sản phẩm khác
                              </div>
                        )}
                  </div>

                  <button
                        className={`flex md:hidden group-hover:flex  disabled:cursor-not-allowed  bg-color-main text-[#fff] p-[4px]   absolute top-[50%] left-[0px] translate-y-[-50%]     rounded-full shadow-3xl`}
                        onClick={handleClickPrev}
                        disabled={styleEffect.disButtonPrev}
                  >
                        <ChevronLeft size={20} color='#fff' />
                  </button>

                  <button
                        className={`flex md:hidden group-hover:flex  disabled:cursor-not-allowed  bg-color-main text-[#fff] p-[4px]  absolute top-[50%] right-[0px] translate-y-[-50%]   rounded-full shadow-3xl `}
                        onClick={handleClickNext}
                        disabled={styleEffect.disButtonNext}
                  >
                        <ChevronRight size={20} color='#fff' />
                  </button>
            </div>
      )
}

export default ProductCare
