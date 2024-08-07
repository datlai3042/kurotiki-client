import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef, useState } from 'react'
import ProductApi from '../../apis/product.api'
import { TProductDetail } from '../../types/product/product.type'
import ProductItemMini from './Components/ProductItemMini'

type TProps = {
      product: TProductDetail
}

const ProductSimiliar = (props: TProps) => {
      const { product } = props

      const allProduct = useQuery({
            queryKey: ['get-all-product', product._id, product.product_type],
            queryFn: () =>
                  ProductApi.getProductSimilar({
                        product_type: product.product_type,
                        type: product.attribute.type,
                        product_id: product._id,
                  }),
            staleTime: 1000 * 60 * 5,
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
      const productData = allProduct.data?.data.metadata.products
      const totalPage = Math.ceil(Number(productData?.length) / 8)
      const styleEffect = {
            buttonPrev: count === 1 ? 'xl:hidden' : 'xl:flex',
            buttonNext: totalPage === count ? 'xl:hidden' : 'xl:flex',
            disButtonPrev: count === 1 ? true : false,
            disButtonNext: totalPage === count ? true : false,
            onActive: (check: boolean) => {
                  return check ? 'bg-blue-400 rounded-[999px]' : 'bg-slate-400 rounded-[999px]'
            },
      }

      const page1 = productData?.slice(0, 8)
      const page2 = productData?.slice(8, 16)
      const page3 = productData?.slice(16, 24)
      const page4 = productData?.slice(24, 32)

      return (
            <div className='relative h-full overflow-hidden flex flex-col gap-[16px] mx-[16px] py-[24px]'>
                  <p className='text-[16px] font-semibold'>Sản phẩm tương tự</p>
                  {productData && productData.length === 0 && (
                        <div className='w-full min-h-full h-full flex items-center justify-center text-[20px] font-semibold text-slate-700 bg-[#ffffff] rounded-lg'>
                              Không có thông tin các sản phẩm khác
                        </div>
                  )}
                  {productData && (
                        <div className='flex xl:w-full  xl:gap-0    overflow-scroll xl:overflow-visible ' ref={wrapperListProductsRef}>
                              <div className=' w-max xl:min-w-full    grid grid-flow-col auto-cols-[130px] auto-rows-[220px] grid-cols-[130px] xl:grid-cols-4 grid-rows-[220px_220px] gap-[18px] '>
                                    {page1 && page1?.map((product) => <ProductItemMini product={product} key={product._id} />)}
                              </div>

                              <div className=' w-max xl:min-w-full    grid grid-flow-col auto-cols-[130px] auto-rows-[220px] grid-cols-[130px] xl:grid-cols-4 grid-rows-[220px_220px] gap-[18px] '>
                                    {page2 && page2?.map((product) => <ProductItemMini product={product} key={product._id} />)}
                              </div>

                              <div className=' w-max xl:min-w-full    grid grid-flow-col auto-cols-[130px] auto-rows-[220px] grid-cols-[130px] xl:grid-cols-4 grid-rows-[220px_220px] gap-[18px] '>
                                    {page3 && page3?.map((product) => <ProductItemMini product={product} key={product._id} />)}
                              </div>

                              <div className=' w-max xl:min-w-full    grid grid-flow-col auto-cols-[130px] auto-rows-[220px] grid-cols-[130px] xl:grid-cols-4 grid-rows-[220px_220px] gap-[18px] '>
                                    {page4 && page4?.map((product) => <ProductItemMini product={product} key={product._id} />)}
                              </div>
                        </div>
                  )}

                  <div className='absolute bottom-[10px] left-[50%] translate-x-[-50%] flex justify-center min-w-[180px] w-max h-[3px] gap-[8px]  '>
                        {Array(totalPage || 1)
                              .fill(0)
                              .map((_, index) => (
                                    <p className={`${styleEffect.onActive(index + 1 === count)} w-[40px] h-full`} key={index}></p>
                              ))}
                  </div>

                  {allProduct.isPending && (
                        <div className='flex xl:w-full  xl:gap-0    overflow-scroll xl:overflow-visible ' ref={wrapperListProductsRef}>
                              <div className=' w-max xl:min-w-full mx-[50px] xl:mx-0 grid grid-flow-col auto-cols-[130px] auto-rows-[230px] grid-cols-[130px] xl:grid-cols-4 grid-rows-[230px_230px] gap-[18px] '>
                                    {Array(8)
                                          .fill(0)
                                          ?.map((_, index) => <div className='animate-pulse bg-slate-400' key={index}></div>)}
                              </div>
                        </div>
                  )}

                  <button
                        className={`${styleEffect.buttonPrev} hidden xl:flex  absolute top-[50%] left-[0px] translate-y-[30%]  bg-[#ffffff]  rounded-full shadow-3xl`}
                        onClick={handleClickPrev}
                        disabled={styleEffect.disButtonPrev || allProduct.isPending}
                  >
                        <ChevronLeft size={28} color='blue' />
                  </button>

                  <button
                        className={`${styleEffect.buttonNext} hidden xl:flex absolute top-[50%] right-[0px] translate-y-[30%] bg-[#ffffff]  rounded-full shadow-3xl `}
                        onClick={handleClickNext}
                        disabled={styleEffect.disButtonNext || allProduct.isPending}
                  >
                        <ChevronRight size={26} color='blue' />
                  </button>
            </div>
      )
}

export default ProductSimiliar
