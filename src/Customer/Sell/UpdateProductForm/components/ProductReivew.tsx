import React, { useEffect, useRef, useState } from 'react'
import { ProductForm } from '../../../../types/product/product.type'
import BoxButtonCircle from '../../../../component/BoxUi/BoxButtonCircle'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useDebouncedCallback } from '@mantine/hooks'
type TProps = {
      productFormImage: {
            secure_url: string
            public_id: string
      }[]
      info: ProductForm
      buttonSubmit: React.ReactNode
}
const ProductReivew = (props: TProps) => {
      const { productFormImage, info, buttonSubmit } = props

      const renderActive = (state: boolean) => (!state ? 'text-color-main' : 'font-bold text-[14px]')

      return (
            <div className='sticky mb-[10px] max-w-[360px] w-[360px] top-[100px] hidden md:flex   flex-col gap-[16px] text-text-theme'>
                  <span className='font-bold text-[16px] text-color-main'>Tổng quan sản phẩm</span>
                  {productFormImage.length > 0 && <ProductFormSliderPreview arrayImage={[...productFormImage]} />}
                  <div className='flex flex-col gap-[12px]'>
                        <div className='flex justify-between items-center'>
                              <span
                                    title={info?.product_name}
                                    className={`${renderActive(!!info?.product_name)} max-w-[80%] text-color-main truncate text-[20px]`}
                              >
                                    {info?.product_name || '[Chưa có tên sản phẩm]'}
                              </span>
                        </div>
                        <div>
                              <span className={`${renderActive(!!info?.product_price)} text-green-500`}>
                                    {info?.product_price || '[Chưa có giá sản phẩm]'}
                              </span>
                        </div>
                        <span
                              className={`${renderActive(
                                    !!info?.attribute?.description,
                              )} max-h-[160px] pr-[16px] text-justify overflow-auto`}
                        >
                              {info?.attribute?.description || '[Chưa có mô tả sản phẩm]'}
                        </span>
                  </div>
                  {buttonSubmit}
            </div>
      )
}

type PropsSliderImages = {
      arrayImage: { secure_url: string; public_id: string }[]
}

const ProductFormSliderPreview = (props: PropsSliderImages) => {
      const { arrayImage } = props
      const wrapperRef = useRef<HTMLDivElement>(null)
      const timer = useRef<NodeJS.Timeout | null>(null)
      const [newPosition, setNewPosition] = useState<number>(0)
      const [indexImage, setIndexImage] = useState<number>(0)
      const delay = 4000
      const LIMIT = 1
      const onClickNext = () => {
            if (wrapperRef.current) {
                  const width = wrapperRef.current?.getBoundingClientRect().width * -1
                  const pos = newPosition + width
                  wrapperRef.current.style.transform = `translateX(${pos}px)`
                  wrapperRef.current.style.transition = 'all 1s'
                  setNewPosition(pos)
                  setIndexImage((prev) => prev + 1)
            }
      }

      const onClickPrev = () => {
            if (wrapperRef.current) {
                  const width = wrapperRef.current?.getBoundingClientRect().width * 1
                  const pos = newPosition + width
                  wrapperRef.current.style.transform = `translateX(${pos}px)`
                  wrapperRef.current.style.transition = 'all 1s'
                  setNewPosition(pos)
                  setIndexImage((prev) => prev - 1)
            }
      }

      const styleEffect = {
            onActive: (check: boolean) => {
                  if (check) return 'w-[16px] rounded-[999px] bg-blue-600 h-[16px]'
                  return 'w-[16px] rounded-[999px] bg-slate-300 h-[16px]'
            },
      }
      const debounceResize = useDebouncedCallback(() => {
            clearInterval(timer.current as NodeJS.Timeout)

            if (wrapperRef.current) {
                  timer.current = setInterval(() => {
                        if (indexImage === LIMIT) {
                              if (wrapperRef.current) {
                                    const width = wrapperRef.current?.getBoundingClientRect().width * 1

                                    const pos = 0
                                    wrapperRef.current.style.transform = `translateX(${pos}px)`
                                    wrapperRef.current.style.transition = 'all 0s'
                                    setNewPosition(pos)
                                    setIndexImage(0)
                              }
                              return
                        }

                        if (wrapperRef.current) {
                              const width = wrapperRef.current?.getBoundingClientRect().width * -1
                              const pos = newPosition + width
                              wrapperRef.current.style.transform = `translateX(${pos}px)`
                              wrapperRef.current.style.transition = 'all 1s'
                              setNewPosition(pos)
                              setIndexImage((prev) => prev + 1)
                        }
                  }, delay)
            }
      }, 100)
      useEffect(() => {
            if (indexImage === 0) {
                  if (wrapperRef.current) {
                        const width = wrapperRef.current?.getBoundingClientRect().width * 1

                        const pos = 0
                        wrapperRef.current.style.transform = `translateX(${pos}px)`
                        wrapperRef.current.style.transition = 'all 1s'
                        setNewPosition(pos)
                  }
                  return
            }

            if (wrapperRef.current) {
                  const width = wrapperRef.current?.getBoundingClientRect().width * -1
                  const pos = width * indexImage
                  wrapperRef.current.style.transform = `translateX(${pos}px)`
                  wrapperRef.current.style.transition = 'all .4s'
                  setNewPosition(pos)
            }

            return () => {
                  clearInterval(timer.current as NodeJS.Timeout)
            }
      }, [indexImage, LIMIT])

      useEffect(() => {
            window.addEventListener('resize', debounceResize)

            return () => {
                  window.removeEventListener('resize', debounceResize)
            }
      }, [])
      return (
            <div className='relative group w-full h-full flex flex-col gap-[20px] '>
                  <div className='w-full h-full  overflow-x-hidden'>
                        <div className='w-[420px]  flex h-[240px]  ' ref={wrapperRef}>
                              {arrayImage.map((img) => (
                                    <img
                                          src={img.secure_url}
                                          key={img.public_id}
                                          className=' w-[420px] min-w-[420px]  h-full object-cover rounded-[6px] object-center'
                                          alt=''
                                    />
                              ))}
                        </div>
                  </div>
                  <div className='  h-[20px] flex items-center justify-center gap-[10px]'>
                        {Array(arrayImage.length)
                              .fill(0)
                              .map(
                                    (_, index) => (
                                          <button
                                                onClick={() => setIndexImage(index)}
                                                className={`${styleEffect.onActive(indexImage === index)}`}
                                                key={index}
                                          ></button>
                                    ),
                                    // <button className={`${styleEffect.onActive(indexImage === 2)}`}></button>
                                    // <button className={`${styleEffect.onActive(indexImage === 3)}`}></button>
                              )}
                  </div>

                  <BoxButtonCircle
                        className='hidden group-hover:flex bg-color-main text-[#fff] absolute top-[50%] translate-x-[-50%] left-[0px]'
                        width={30}
                        height={30}
                        icon={<ChevronLeft className='#fff' />}
                        onClick={onClickPrev}
                        disabled={indexImage === 0}
                  />

                  <BoxButtonCircle
                        className='hidden group-hover:flex  bg-color-main text-[#fff] absolute top-[50%] translate-x-[-50%] right-[-32px]'
                        width={30}
                        height={30}
                        icon={<ChevronRight className='#fff' />}
                        onClick={onClickNext}
                        disabled={indexImage + 1 === arrayImage.length}
                  />
            </div>
      )
}

export default ProductReivew
