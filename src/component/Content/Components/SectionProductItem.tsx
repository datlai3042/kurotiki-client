import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductApi, { TProductReturn } from '../../../apis/product.api'
import BoxMoneyV2 from '../../BoxUi/BoxMoneyV2'
import ProductLoading from './ProductLoading'

type Props = {}

const SectionProductItem = (props: Props) => {
      const wrapperListProductsRef = useRef<HTMLDivElement>(null)
      const PositionScrollCurrent = useRef<number>(0)
      const [limitShowProduct, setLimitShowProduct] = useState<number>(0)
      const [count, setCount] = useState(1)

      const allProduct = useQuery({
            queryKey: ['get-all-product'],
            queryFn: () => ProductApi.getAllProduct({ page: 1, limit: 18 }),
            staleTime: 1000 * 60 * 5,
      })

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

      useEffect(() => {
            if (allProduct.isSuccess) {
                  setLimitShowProduct(Math.ceil(allProduct.data.data.metadata.products.length / 6))
            }
      }, [allProduct.isSuccess, allProduct?.data?.data.metadata.products.length])

      const styleEffect = {
            buttonPrev: count === 1 ? 'xl:hidden' : 'xl:flex',
            buttonNext: limitShowProduct === count ? 'xl:hidden' : 'xl:flex',
            disButtonPrev: count === 1 ? true : false,
            disButtonNext: limitShowProduct === count ? true : false,
      }

      return (
            <div className='h-[85%] mx-[4px] relative  overflow-x-scroll lg:overflow-x-hidden  '>
                  <div
                        ref={wrapperListProductsRef}
                        className=' h-full  flex  gap-[12px] xl:gap-[34px] px-[18px] w-[370px]  xl:w-full snap-mandatory	'
                  >
                        {allProduct.isSuccess &&
                              allProduct?.data?.data?.metadata.products.map((product: TProductReturn) => {
                                    return (
                                          <Link
                                                to={`/product/${product._id}`}
                                                className='flex flex-col w-[calc((100%-24px)/2)]    xl:w-[calc((100%-170px)/6)] h-full snap-always snap-start	 '
                                                key={product._id}
                                          >
                                                <div className='w-[160px] h-full flex flex-col gap-[12px]'>
                                                      <img
                                                            src={product?.product_thumb_image?.secure_url}
                                                            className='w-full h-[156px] max-h-[160px]'
                                                            alt='product'
                                                      />
                                                      <div className='w-full h-[20px] text-[16px]'>
                                                            <BoxMoneyV2 money={product.product_price} />
                                                      </div>
                                                      <div className='relative w-full h-[20px] flex items-center justify-center bg-red-200 rounded-[999px]'>
                                                            <div className='absolute top-0 left-0 w-[20px] h-full rounded-full bg-red-500'></div>
                                                            <span className='text-[11px] text-white'>Vừa mở bán</span>
                                                      </div>
                                                </div>
                                          </Link>
                                    )
                              })}

                        {allProduct.isPending && <ProductLoading />}
                  </div>
                  <button
                        className={`${styleEffect.buttonPrev} hidden xl:flex  absolute top-[50%] left-[0px] translate-y-[-50%]  bg-[#ffffff]  rounded-full shadow-3xl`}
                        onClick={handleClickPrev}
                        disabled={styleEffect.disButtonPrev}
                  >
                        <ChevronLeft size={24} color='blue' />
                  </button>

                  <button
                        className={`${styleEffect.buttonNext} hidden xl:flex absolute top-[50%] right-[0px] translate-y-[-50%] bg-[#ffffff]  rounded-full shadow-3xl `}
                        onClick={handleClickNext}
                        disabled={styleEffect.disButtonNext}
                  >
                        <ChevronRight size={26} color='blue' />
                  </button>
            </div>
      )
}

export default SectionProductItem
