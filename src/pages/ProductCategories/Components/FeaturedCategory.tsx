import { ArrowLeft, ArrowRight } from 'lucide-react'
import React, { useRef, useState } from 'react'
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
            <section className='relative flex h-[220px] max-w-full flex-col overflow-hidden rounded-2xl border border-[var(--border-color-input)] bg-color-section-theme text-text-theme shadow-sm'>
                  <div className='flex items-center justify-between px-5 pb-2 pt-4'>
                        <h2 className='text-[17px] font-semibold'>Danh mục nổi bật</h2>

                        <span className='text-xs text-blue-500'>Khám phá nhanh</span>
                  </div>

                  <div className='flex min-h-0 flex-1 items-center overflow-hidden px-4'>
                        <div
                              className='flex w-full gap-4 overflow-x-auto bg-transparent pb-2 snap-x snap-mandatory xl:gap-5 xl:overflow-visible xl:snap-none'
                              ref={wrapperRef}
                        >
                              <FeaturedCategoryItem />
                        </div>
                  </div>

                  <button
                        className='absolute left-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#1c2635] text-white shadow-lg transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-30 xl:flex'
                        onClick={onTranslatePrev}
                        disabled={countTranslate === 1}
                  >
                        <ArrowLeft size={18} />
                  </button>

                  <button
                        className='absolute right-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#1c2635] text-white shadow-lg transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-30 xl:flex'
                        onClick={onTranslateNext}
                        disabled={countTranslate === productsLength}
                  >
                        <ArrowRight size={18} />
                  </button>
            </section>
      )
}

export default FeaturedCategory