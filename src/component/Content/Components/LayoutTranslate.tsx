import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef, useState } from 'react'
import { TProductDetail } from '../../../types/product/product.type'
import ProductSmall from './ProductSmall'

type TProps = {
      products: TProductDetail[]
}

const LayoutTranslate = (props: TProps) => {
      const { products } = props

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

      const styleEffect = {
            buttonPrev: count === 1 ? 'xl:hidden' : 'xl:flex',

            disButtonPrev: count === 1 ? true : false,
            disButtonNext: 2 === count ? true : false,
            onHidden: (length: number) => (length === count ? 'xl:hidden' : 'xl:flex'),

            onDisable: (length: number) => (length === count ? true : false),

            onActive: (isActive: boolean) => {
                  if (isActive) return 'bg-blue-50 border-blue-600 text-blue-600'

                  return 'bg-transparent border-gray-400 text-slate-600'
            },
      }

      return (
            <>
                  {products.length > 0 && (
                        <div
                              className='h-full max-w-full flex gap-[20px] overflow-scroll xl:overflow-visible '
                              ref={wrapperListProductsRef}
                        >
                              {products?.map((product) => (
                                    <div
                                          key={product._id}
                                          className='h-full min-w-[calc((100%-40px)/2)] sm:min-w-[calc((100%-40px)/4)]  xl:min-w-[calc((100%-120px)/6)]'
                                    >
                                          <ProductSmall product={product} />
                                    </div>
                              ))}

                              <button
                                    className={`${styleEffect.buttonPrev} hidden xl:flex  absolute top-[50%] left-[0px] translate-y-[-50%]  bg-[#ffffff]  rounded-full shadow-3xl`}
                                    onClick={handleClickPrev}
                                    disabled={styleEffect.disButtonPrev}
                              >
                                    <ChevronLeft size={24} color='blue' />
                              </button>

                              <button
                                    className={`${styleEffect.onHidden(
                                          products?.length / 6 || 0,
                                    )} hidden xl:flex absolute top-[50%] right-[0px] translate-y-[-50%] bg-[#ffffff]  rounded-full shadow-3xl `}
                                    onClick={handleClickNext}
                                    disabled={styleEffect.onDisable(products?.length / 6 || 0)}
                              >
                                    <ChevronRight size={26} color='blue' />
                              </button>
                        </div>
                  )}
                  {products.length === 0 && (
                        <div className='w-full h-[300px] flex justify-center items-center'>Không tìm thấy sản phẩm</div>
                  )}
            </>
      )
}

export default LayoutTranslate
