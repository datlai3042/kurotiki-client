import React, { useEffect, useRef, useState } from 'react'
import img1 from '../assets/img/ThuongHieuChinhHang/item_1.jpg'
import img2 from '../assets/img/ThuongHieuChinhHang/item_2.jpg'
import img3 from '../assets/img/ThuongHieuChinhHang/item_3.jpg'
import img4 from '../assets/img/ThuongHieuChinhHang/item_4.jpg'
import img5 from '../assets/img/ThuongHieuChinhHang/item_5.jpg'
import img6 from '../assets/img/ThuongHieuChinhHang/item_6.jpg'
import img7 from '../assets/img/ThuongHieuChinhHang/item_7.jpg'
import img8 from '../assets/img/ThuongHieuChinhHang/item_8.jpg'
import img9 from '../assets/img/ThuongHieuChinhHang/item_9.jpg'
import img10 from '../assets/img/ThuongHieuChinhHang/item_10.jpg'
import img11 from '../assets/img/ThuongHieuChinhHang/item_11.jpg'
import img12 from '../assets/img/ThuongHieuChinhHang/item_12.jpg'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { debounce } from 'lodash'
import useResetTransform from '../hooks/useResetTransform'

const ProductGenuineBrand = () => {
      const containerRef = useRef<HTMLDivElement>(null)
      const wrapperListProductsRef = useRef<HTMLDivElement>(null)
      const PositionScrollCurrent = useRef<number>(0)
      const [count, setCount] = useState(0)
      const [widthElemnet, setWidthElement] = useState(160)
      const { widthContainer } = useResetTransform(wrapperListProductsRef, (width: number) => {
            setCount(0)
            let result = width / Math.floor(width / 160) - 16
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
            buttonNext: 2 === count ? 'xl:hidden' : 'xl:flex',
            disButtonPrev: count === 0 ? true : false,
            disButtonNext: 2 === count ? true : false,
      }

      return (
            <div className='relative group flex-1 h-[80%]  px-[18px] bg-color-section-theme text-text-theme'>
                  <div className='w-full h-full overflow-hidden'>
                        <div className='flex  gap-[20px] h-full w-full pb-[8px]' ref={wrapperListProductsRef}>
                              <img
                                    style={{ flexBasis: widthElemnet, flexShrink: 0, width: widthElemnet }}
                                    src={img1}
                                    className='h-full '
                                    alt=''
                              />
                              <img
                                    style={{ flexBasis: widthElemnet, flexShrink: 0, width: widthElemnet }}
                                    src={img2}
                                    className='h-full '
                                    alt=''
                              />
                              <img
                                    style={{ flexBasis: widthElemnet, flexShrink: 0, width: widthElemnet }}
                                    src={img3}
                                    className='h-full '
                                    alt=''
                              />
                              <img
                                    style={{ flexBasis: widthElemnet, flexShrink: 0, width: widthElemnet }}
                                    src={img4}
                                    className='h-full '
                                    alt=''
                              />
                              <img
                                    style={{ flexBasis: widthElemnet, flexShrink: 0, width: widthElemnet }}
                                    src={img5}
                                    className='h-full '
                                    alt=''
                              />
                              <img
                                    style={{ flexBasis: widthElemnet, flexShrink: 0, width: widthElemnet }}
                                    src={img6}
                                    className='h-full '
                                    alt=''
                              />
                              <img
                                    style={{ flexBasis: widthElemnet, flexShrink: 0, width: widthElemnet }}
                                    src={img7}
                                    className='h-full '
                                    alt=''
                              />
                              <img
                                    style={{ flexBasis: widthElemnet, flexShrink: 0, width: widthElemnet }}
                                    src={img8}
                                    className='h-full '
                                    alt=''
                              />
                              <img
                                    style={{ flexBasis: widthElemnet, flexShrink: 0, width: widthElemnet }}
                                    src={img9}
                                    className='h-full '
                                    alt=''
                              />
                              <img
                                    style={{ flexBasis: widthElemnet, flexShrink: 0, width: widthElemnet }}
                                    src={img10}
                                    className='h-full '
                                    alt=''
                              />
                              <img
                                    style={{ flexBasis: widthElemnet, flexShrink: 0, width: widthElemnet }}
                                    src={img11}
                                    className='h-full '
                                    alt=''
                              />
                              <img
                                    style={{ flexBasis: widthElemnet, flexShrink: 0, width: widthElemnet }}
                                    src={img12}
                                    className='h-full '
                                    alt=''
                              />
                        </div>
                  </div>
                  <button
                        className={`flex md:hidden group-hover:flex  disabled:cursor-not-allowed p-[4px]  absolute top-[50%] left-[0px] translate-y-[-50%]   bg-color-main text-[#fff]  rounded-full shadow-3xl`}
                        onClick={handleClickPrev}
                        disabled={styleEffect.disButtonPrev}
                  >
                        <ChevronLeft size={20} color='#fff' />
                  </button>

                  <button
                        className={`flex md:hidden group-hover:flex  disabled:cursor-not-allowed p-[4px] absolute top-[50%] right-[0px] translate-y-[-50%]  bg-color-main text-[#fff]  rounded-full shadow-3xl `}
                        onClick={handleClickNext}
                        disabled={styleEffect.disButtonNext}
                  >
                        <ChevronRight size={20} color='#fff' />
                  </button>
            </div>
      )
}

export default ProductGenuineBrand
