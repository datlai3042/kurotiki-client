import React, { useEffect, useRef, useState } from 'react'
import img1 from '../assets/img/SliderImage/img1png.webp'
import img2 from '../assets/img/SliderImage/img2.webp'
import img3 from '../assets/img/SliderImage/img3.webp'
import img4 from '../assets/img/SliderImage/img4.webp'
import img5 from '../assets/img/SliderImage/img5.webp'
import img6 from '../assets/img/SliderImage/img6.webp'
import BoxButtonCircle from '../../BoxUi/BoxButtonCircle'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useDebouncedCallback } from '@mantine/hooks'

const arrayImage = [img1, img2, img3, img4, img5, img6]

const SliderProductV2 = () => {
      const wrapperRef = useRef<HTMLDivElement>(null)
      const timer = useRef<NodeJS.Timeout | null>(null)
      const [newPosition, setNewPosition] = useState<number>(0)
      const [indexImage, setIndexImage] = useState<number>(1)
      const delay = 4000
      const LIMIT = window.innerWidth >= 1024 ? Math.ceil(arrayImage.length / 2) : arrayImage.length
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
                  if (check) return 'w-[24px] rounded-[999px] bg-blue-600 h-[2px]'
                  return 'w-[16px] rounded-[999px] bg-slate-300 h-[2px]'
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
                                    setIndexImage(1)
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
            timer.current = setInterval(() => {
                  if (indexImage === LIMIT) {
                        if (wrapperRef.current) {
                              const width = wrapperRef.current?.getBoundingClientRect().width * 1

                              const pos = 0
                              wrapperRef.current.style.transform = `translateX(${pos}px)`
                              wrapperRef.current.style.transition = 'all 0s'
                              setNewPosition(pos)
                              setIndexImage(1)
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

            return () => {
                  clearInterval(timer.current as NodeJS.Timeout)
            }
      }, [newPosition, indexImage, LIMIT])
      
      useEffect(() => {
            window.addEventListener('resize', debounceResize)

            return () => {
                  window.removeEventListener('resize', debounceResize)
            }
      }, [])
      return (
            <div className='relative group w-full h-full  '>
                  <div className='w-full h-full  overflow-x-hidden'>
                        <div className='min-w-full w-full  flex h-full gap-[20px] ' ref={wrapperRef}>
                              {arrayImage.map((img) => (
                                    <img
                                          src={img}
                                          key={img}
                                          className='min-w-[calc(100%-16px)] xl:min-w-[calc((100%-40px)/2)] h-full rounded-xl'
                                          alt=''
                                    />
                              ))}
                        </div>
                  </div>
                  <div className='absolute left-[50%] translate-x-[-50%] bottom-[-25px] w-[150px] h-[20px] flex items-center justify-center gap-[6px]'>
                        {Array(LIMIT)
                              .fill(0)
                              .map(
                                    (_, index) => (
                                          <button className={`${styleEffect.onActive(indexImage === index + 1)}`} key={index}></button>
                                    ),
                                    // <button className={`${styleEffect.onActive(indexImage === 2)}`}></button>
                                    // <button className={`${styleEffect.onActive(indexImage === 3)}`}></button>
                              )}
                  </div>

                  <BoxButtonCircle
                        className='hidden group-hover:flex  bg-color-main text-[#fff] absolute top-[50%] translate-x-[-50%] left-[20px]'
                        width={30}
                        height={30}
                        icon={<ChevronLeft className='#fff' />}
                        onClick={onClickPrev}
                        disabled={indexImage === 1}
                  />

                  <BoxButtonCircle
                        className='hidden group-hover:flex  bg-color-main text-[#fff] absolute top-[50%] translate-x-[-50%] right-[-10px]'
                        width={30}
                        height={30}
                        icon={<ChevronRight className='#fff' />}
                        onClick={onClickNext}
                        disabled={indexImage === LIMIT}
                  />
            </div>
      )
}

export default SliderProductV2
