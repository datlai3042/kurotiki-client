import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { ProductType } from '../../../types/product/product.type'
import FeaturedCategoryItem from './FeaturedCategoryItem'

type TProps = {
      title?: String
      type: ProductType
}

const FeaturedCategory = (props: TProps) => {
      const { type } = props

      const wrapperRef = useRef<HTMLDivElement>(null)
      const [positionWrapper, setPositionWrapper] = useState<number>(0)
      const [countTranslate, setCountTranslate] = useState<number>(1)

      const onTranslateNext = () => {
            if (wrapperRef.current) {
                  const width = wrapperRef.current.getBoundingClientRect().width
                  const x = wrapperRef.current.getBoundingClientRect().left
                  const newPositionWrapper = positionWrapper - width
                  wrapperRef.current.style.transform = `translateX(${newPositionWrapper}px)`
                  wrapperRef.current.style.transition = ' all 1s'
                  setPositionWrapper(newPositionWrapper)
                  if (countTranslate === productsLength) return
                  setCountTranslate((prev) => prev + 1)
            }
      }

      const onTranslatePrev = () => {
            if (wrapperRef.current) {
                  const width = wrapperRef.current.getBoundingClientRect().width
                  const x = wrapperRef.current.getBoundingClientRect().left
                  const newPositionWrapper = positionWrapper + width

                  wrapperRef.current.style.transform = `translateX(${newPositionWrapper}px)`
                  wrapperRef.current.style.transition = ' all 1s'
                  setPositionWrapper(newPositionWrapper)
                  if (countTranslate === 1) return
                  setCountTranslate((prev) => prev - 1)
            }
      }
      const productsLength = 12 / 6

      return (
            <div className='relative max-w-full overflow-hidden h-[270px] py-[12px] bg-color-section-theme text-text-theme flex flex-col '>
                  <h2 className='h-[18%] xl:h-[20%] px-[16px] text-[20px] '>Danh mục nổi bật</h2>
                  <div className=' flex-1 flex w-full overflow-x-hidden '>
                        <div
                              className='w-full flex gap-[28px] xl:gap-[8px] overflow-scroll xl:overflow-visible bg-color-section-theme  snap-x snap-mandatory xl:snap-none'
                              ref={wrapperRef}
                        >
                              <FeaturedCategoryItem />
                        </div>
                  </div>

                  <button
                        className='absolute bottom-[80px] disabled:cursor-not-allowed  left-[10px] w-[40px] h-[40px] bg-color-main rounded-full hidden xl:flex items-center justify-center shadow-lg'
                        onClick={onTranslatePrev}
                        disabled={countTranslate === 1}
                  >
                        <ArrowLeft size={20} color='white' />
                  </button>
                  <button
                        className='absolute bottom-[80px] disabled:cursor-not-allowed  right-[10px] w-[40px] h-[40px] bg-color-main rounded-full hidden xl:flex items-center justify-center shadow-lg'
                        onClick={onTranslateNext}
                        disabled={countTranslate === productsLength}
                  >
                        <ArrowRight size={20} color='white' />
                  </button>
            </div>
      )
}

export default FeaturedCategory
