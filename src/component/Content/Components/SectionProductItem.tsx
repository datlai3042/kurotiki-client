import { useEffect, useState, useRef } from 'react'
import PositionIcon from '../../BoxUi/BoxAbsolute'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import BoxCenter from '../../BoxUi/BoxCenter'
import BoxIsBought from '../../BoxUi/BoxIsBought'
import BoxAbsolute from '../../BoxUi/BoxAbsolute'
import { useQuery } from '@tanstack/react-query'
import ProductApi, { TProduct, TProductReturn } from '../../../apis/product.api'
import { Link } from 'react-router-dom'
import BoxMoneyV2 from '../../BoxUi/BoxMoneyV2'

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
            <div className='h-[85%] mx-[4px] relative overflow-auto md:overflow-hidden pb-[8px] bg-color-section-theme text-text-theme '>
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

                        {allProduct.isPending &&
                              Array(6)
                                    .fill(0)
                                    .map((_, index) => {
                                          return (
                                                <div
                                                      className='animate-pulse bg-gray-100 flex flex-col min-w-[40%] md:min-w-[30%] lg:min-w-[15%] h-[160px] snap-always snap-start	 '
                                                      key={index}
                                                >
                                                      <div className='bg-gray-200 w-full min-h-full flex rounded'>
                                                            <div className='bg-slate-300 min-w-full min-h-[85%] max-h-[85%] rounded'></div>
                                                            <p className='bg-slate-300 w-full text-center h-[20px] rounded'></p>
                                                      </div>
                                                </div>
                                          )
                                    })}
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
