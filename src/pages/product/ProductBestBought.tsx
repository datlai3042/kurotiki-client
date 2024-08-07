import { useQuery } from '@tanstack/react-query'
import React, { useRef, useState } from 'react'
import ProductApi from '../../apis/product.api'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ProductItemMini from './Components/ProductItemMini'
const ELEMENT_PAGE = 8

const ProductBestBought = () => {
      const getAllProductBest = useQuery({
            queryKey: ['/v1/api/product/get-product-best-bought'],
            queryFn: () => ProductApi.getProductBestBought({ page: 1, limit: 18 }),
      })

      const wrapperListProductsRef = useRef<HTMLDivElement>(null)
      const PositionScrollCurrent = useRef<number>(0)
      const [count, setCount] = useState(1)

      const handleClickNext = () => {
            if (wrapperListProductsRef.current) {
                  setCount((prev) => prev + 1)
                  const width = wrapperListProductsRef.current.getBoundingClientRect().width
                  PositionScrollCurrent.current = PositionScrollCurrent.current - width
                  wrapperListProductsRef.current.style.transform = `translate3d(${PositionScrollCurrent.current}px, 0,0)`
                  wrapperListProductsRef.current.style.transition = `all 1s`
            }
      }

      const handleClickPrev = () => {
            if (wrapperListProductsRef.current) {
                  setCount((prev) => prev - 1)

                  const width = wrapperListProductsRef.current.getBoundingClientRect().width
                  PositionScrollCurrent.current = PositionScrollCurrent.current + width

                  //console.log(([^)]+))
                  wrapperListProductsRef.current.style.transform = `translate3d(${PositionScrollCurrent.current}px, 0,0)`
                  wrapperListProductsRef.current.style.transition = `all 1s`
            }
      }

      const productAllPage = getAllProductBest.data?.data.metadata.products

      const _page1 = productAllPage?.slice(0, ELEMENT_PAGE * 1)
      const _page2 = productAllPage?.slice(ELEMENT_PAGE, ELEMENT_PAGE * 2)
      const _page3 = productAllPage?.slice(ELEMENT_PAGE * 2, ELEMENT_PAGE * 3)

      const totalPage = Math.ceil(Number(productAllPage?.length) / 4)

      const styleEffect = {
            buttonPrev: count === 1 ? 'xl:hidden' : 'xl:flex',
            buttonNext: totalPage === count ? 'xl:hidden' : 'xl:flex',
            disButtonPrev: count === 1 ? true : false,
            disButtonNext: totalPage === count ? true : false,
            onActive: (check: boolean) => {
                  return check ? 'bg-blue-400 rounded-[999px]' : 'bg-slate-400 rounded-[999px]'
            },
      }

      return (
            <div className='relative min-h-[320px] h-max bg-[#ffffff] rounded-lg flex flex-col gap-[16px] p-[16px] overflow-hidden'>
                  <h4 className='text-[16px] font-medium px-[12px] xl:px-0'>Tiki best</h4>

                  <div className=' flex  w-full    overflow-scroll xl:overflow-visible ' ref={wrapperListProductsRef}>
                        {_page1 && (
                              <div className='   xl:w-full  w-max grid grid-flow-col auto-cols-[130px] auto-rows-[225px] grid-cols-[130px] xl:grid-cols-[130px] grid-rows-[225px] gap-[18px] '>
                                    {_page1?.map((product) => <ProductItemMini product={product} key={product._id} />)}
                              </div>
                        )}

                        {_page2 && (
                              <div className='   xl:w-full w-max  ml-[100%]  grid grid-flow-col auto-cols-[130px] auto-rows-[225px] grid-cols-[130px] xl:grid-cols-[130px] grid-rows-[225px] gap-[18px] '>
                                    {_page2?.map((product) => <ProductItemMini product={product} key={product._id} />)}
                              </div>
                        )}
                        {_page3 && (
                              <div className='   xl:w-full ml-[100%]   grid grid-flow-col auto-cols-[130px] auto-rows-[225px] grid-cols-[130px] xl:grid-cols-[130px] grid-rows-[225px] gap-[18px] '>
                                    {_page3?.map((product) => <ProductItemMini product={product} key={product._id} />)}
                              </div>
                        )}
                  </div>

                  <div className='absolute bottom-[10px] left-[50%] translate-x-[-50%] my-[8px] flex justify-center min-w-[180px] w-max h-[3px] gap-[8px]  '>
                        {Array(totalPage || 1)
                              .fill(0)
                              .map((_, index) => (
                                    <p className={`${styleEffect.onActive(index + 1 === count)} w-[40px] h-full`} key={index}></p>
                              ))}
                  </div>

                  <button
                        className={`${styleEffect.buttonPrev} hidden xl:flex  absolute top-[50%] left-[0px] translate-y-[30%]  bg-[#ffffff]  rounded-full shadow-3xl`}
                        onClick={handleClickPrev}
                        disabled={styleEffect.disButtonPrev || getAllProductBest.isPending}
                  >
                        <ChevronLeft size={28} color='blue' />
                  </button>

                  <button
                        className={`${styleEffect.buttonNext} hidden xl:flex absolute top-[50%] right-[0px] translate-y-[30%] bg-[#ffffff]  rounded-full shadow-3xl `}
                        onClick={handleClickNext}
                        disabled={styleEffect.disButtonNext || getAllProductBest.isPending}
                  >
                        <ChevronRight size={26} color='blue' />
                  </button>
            </div>
      )
}

export default ProductBestBought
