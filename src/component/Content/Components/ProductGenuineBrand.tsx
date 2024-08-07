import { useRef, useState } from 'react'
import img1 from '../assets/img/ThuongHieuChinhHang/item_1.jpg'
import img10 from '../assets/img/ThuongHieuChinhHang/item_10.jpg'
import img11 from '../assets/img/ThuongHieuChinhHang/item_11.jpg'
import img12 from '../assets/img/ThuongHieuChinhHang/item_12.jpg'
import img2 from '../assets/img/ThuongHieuChinhHang/item_2.jpg'
import img3 from '../assets/img/ThuongHieuChinhHang/item_3.jpg'
import img4 from '../assets/img/ThuongHieuChinhHang/item_4.jpg'
import img5 from '../assets/img/ThuongHieuChinhHang/item_5.jpg'
import img6 from '../assets/img/ThuongHieuChinhHang/item_6.jpg'
import img7 from '../assets/img/ThuongHieuChinhHang/item_7.jpg'
import img8 from '../assets/img/ThuongHieuChinhHang/item_8.jpg'
import img9 from '../assets/img/ThuongHieuChinhHang/item_9.jpg'

import { ChevronLeft, ChevronRight } from 'lucide-react'

const ProductGenuineBrand = () => {
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
            buttonNext: 2 === count ? 'xl:hidden' : 'xl:flex',
            disButtonPrev: count === 1 ? true : false,
            disButtonNext: 2 === count ? true : false,
      }

      return (
            <div className='relative flex-1 h-[80%]  px-[18px]'>
                  <div className='w-full h-full overflow-hidden'>
                        <div className='flex  gap-[20px] h-full overflow-x-scroll xl:overflow-visible' ref={wrapperListProductsRef}>
                              <img
                                    src={img1}
                                    className='h-full min-w-[calc((100%-120px)/2)] sm:min-w-[calc((100%-120px)/4)] xl:min-w-[calc((100%-120px)/6)]'
                                    alt=''
                              />
                              <img
                                    src={img2}
                                    className='h-full min-w-[calc((100%-120px)/2)] sm:min-w-[calc((100%-120px)/4)] xl:min-w-[calc((100%-120px)/6)]'
                                    alt=''
                              />
                              <img
                                    src={img3}
                                    className='h-full min-w-[calc((100%-120px)/2)] sm:min-w-[calc((100%-120px)/4)] xl:min-w-[calc((100%-120px)/6)]'
                                    alt=''
                              />
                              <img
                                    src={img4}
                                    className='h-full min-w-[calc((100%-120px)/2)] sm:min-w-[calc((100%-120px)/4)] xl:min-w-[calc((100%-120px)/6)]'
                                    alt=''
                              />
                              <img
                                    src={img5}
                                    className='h-full min-w-[calc((100%-120px)/2)] sm:min-w-[calc((100%-120px)/4)] xl:min-w-[calc((100%-120px)/6)]'
                                    alt=''
                              />
                              <img
                                    src={img6}
                                    className='h-full min-w-[calc((100%-120px)/2)] sm:min-w-[calc((100%-120px)/4)] xl:min-w-[calc((100%-120px)/6)]'
                                    alt=''
                              />
                              <img
                                    src={img7}
                                    className='h-full min-w-[calc((100%-120px)/2)] sm:min-w-[calc((100%-120px)/4)] xl:min-w-[calc((100%-120px)/6)]'
                                    alt=''
                              />
                              <img
                                    src={img8}
                                    className='h-full min-w-[calc((100%-120px)/2)] sm:min-w-[calc((100%-120px)/4)] xl:min-w-[calc((100%-120px)/6)]'
                                    alt=''
                              />
                              <img
                                    src={img9}
                                    className='h-full min-w-[calc((100%-120px)/2)] sm:min-w-[calc((100%-120px)/4)] xl:min-w-[calc((100%-120px)/6)]'
                                    alt=''
                              />
                              <img
                                    src={img10}
                                    className='h-full min-w-[calc((100%-120px)/2)] sm:min-w-[calc((100%-120px)/4)] xl:min-w-[calc((100%-120px)/6)]'
                                    alt=''
                              />
                              <img
                                    src={img11}
                                    className='h-full min-w-[calc((100%-120px)/2)] sm:min-w-[calc((100%-120px)/4)] xl:min-w-[calc((100%-120px)/6)]'
                                    alt=''
                              />
                              <img
                                    src={img12}
                                    className='h-full min-w-[calc((100%-120px)/2)] sm:min-w-[calc((100%-120px)/4)] xl:min-w-[calc((100%-120px)/6)]'
                                    alt=''
                              />
                        </div>
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

export default ProductGenuineBrand
