import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import React, { SetStateAction, useEffect, useRef, useState } from 'react'
import Portal from '../../component/Portal'
import { TImage } from './Product'

type TProps = {
      secure_url: TImage[]
      setOpenModal: React.Dispatch<SetStateAction<boolean>>
      imageActive: string
      transitionDuration?: number
}

const BoxModalImage = (props: TProps) => {
      const { setOpenModal, secure_url, imageActive, transitionDuration = 2 } = props
      const wrapperRef = useRef<HTMLDivElement>(null)
      const [posImage, setPosImage] = useState<number>(1)
      const widthAfter = useRef<number>(0)
      const indexActive = useRef<number>(0)

      const handleHideModal = () => {
            setOpenModal(false)
      }

      const handleNext = () => {
            if (wrapperRef.current) {
                  const width = wrapperRef.current.getBoundingClientRect().width
                  wrapperRef.current.style.transform = `translate3d(${-width + widthAfter.current}px,0px,0px)`
                  widthAfter.current = -width + widthAfter.current
                  wrapperRef.current.style.transition = 'all .5s'
                  setPosImage((prev) => (prev += 1))
            }
      }

      const handlePrev = () => {
            if (wrapperRef.current) {
                  const width = wrapperRef.current.getBoundingClientRect().width
                  wrapperRef.current.style.transform = `translate3d(${width + widthAfter.current}px, 0px,0px)`
                  widthAfter.current = width + widthAfter.current

                  wrapperRef.current.style.transition = 'all .5s'
                  setPosImage((prev) => (prev -= 1))
            }
      }

      const handleClickChangeImage = (index: number) => {
            if (wrapperRef.current) {
                  const width = wrapperRef.current.getBoundingClientRect().width
                  wrapperRef.current.style.transform = `translate3d(${-width * index}px, 0px,0px)`
                  widthAfter.current = -width * index
                  wrapperRef.current.style.transition = 'all .5s'
                  setPosImage(index + 1)
            }
      }

      //cho grandfather overflox hidden, parent thi khong

      useEffect(() => {
            const foundElementActive = secure_url.map((img) => img.secure_url).indexOf(imageActive)
            if (foundElementActive === 0 || foundElementActive === -1) return
            indexActive.current = foundElementActive
            if (wrapperRef.current) {
                  const width = wrapperRef.current.getBoundingClientRect().width
                  wrapperRef.current.style.transform = `translate3d(${-width * indexActive.current}px,0px,0px)`
                  widthAfter.current = -width * indexActive.current
                  wrapperRef.current.style.transition = `all ${transitionDuration}s`
                  setPosImage(indexActive.current + 1)
            }
      }, [imageActive, secure_url, transitionDuration])

      useEffect(() => {
            document.body.style.overflow = 'hidden'
            return () => {
                  document.body.style.overflow = 'scroll'
            }
      }, [])

      const styleEffect = {
            buttonPrev: posImage === 1 ? 'text-gray-500 border-gray-500' : 'text-white border-white-400',
            buttonNext: posImage === secure_url.length ? 'text-gray-500 border-gray-500' : 'text-white border-white-400',
            isActiveImage: 'border-[4px] border-blue-800',
      }

      return (
            <Portal>
                  <div className=' fixed inset-0 bg-[rgba(0,0,0,.93)] z-[6] flex flex-col content-between min-h-screen h-max px-[24px]'>
                        <div className='relative w-full h-[30%]  lg:h-[70%] mt-[100px] xl:mt-[24px]'>
                              <div className='w-full h-full flex justify-center items-center'>
                                    <div className='w-[250px] h-[250px] xl:w-[540px] xl:h-[540px] overflow-x-hidden'>
                                          <div className='w-full h-full flex     ' ref={wrapperRef}>
                                                {secure_url.map((image) => (
                                                      <img
                                                            className='w-full h-full min-w-full max-w-full'
                                                            src={image.secure_url}
                                                            alt='product'
                                                            key={image.secure_url}
                                                      />
                                                ))}
                                          </div>
                                    </div>
                              </div>

                              <button
                                    className={`${styleEffect.buttonPrev} absolute top-[50%]  translate-y-[-50%] left-[100px] 2xl:left-[250px] hidden lg:flex flex-col items-center gap-[8px] text-gray-500`}
                                    disabled={posImage === 1}
                                    onClick={handlePrev}
                              >
                                    <div
                                          className={`${styleEffect.buttonPrev} w-[60px]  h-[60px] bg-transparent border-[1px] border-gray-500 rounded-full flex flex-col gap-[4px] justify-center items-center `}
                                    >
                                          <ChevronLeft size={60} className='font-bold' />
                                    </div>
                                    <span>Xem ảnh trước</span>
                              </button>
                              <button
                                    className={`${styleEffect.buttonNext} absolute top-[50%] translate-y-[-50%] right-[100px] 2xl:right-[250px] hidden lg:flex flex-col items-center gap-[8px] `}
                                    disabled={posImage === secure_url.length}
                                    onClick={handleNext}
                              >
                                    <div
                                          className={`${styleEffect.buttonNext} w-[60px]  h-[60px] bg-transparent border-[1px]  rounded-full flex flex-col gap-[4px] justify-center items-center `}
                                    >
                                          <ChevronRight size={60} className='font-bold' />
                                    </div>
                                    <span>Xem ảnh sau</span>
                              </button>
                              <div
                                    className='absolute top-[-12px] xl:top-[12px] right-[-16px] xl:right-[40px] flex flex-row xl:flex-col gap-[4px] text-white items-center hover:cursor-pointer      '
                                    onClick={handleHideModal}
                              >
                                    <X color='white' size={30} />
                                    <span className='hidden xl:inline text-[16px]'>Đóng</span>
                              </div>
                        </div>

                        <div className='modelImage w-[340px] lg:w-[1000px] min-h-[200px] h-[280px] overflow-y-scroll xl:h-max mx-auto my-[20px] flex flex-col gap-[8px]'>
                              <p className='text-[20px] text-white pb-[2px] border-b-[3px] border-blue-600 max-w-max'>
                                    Hình ảnh từ Tiki ({secure_url.length})
                              </p>
                              <div className='flex gap-[8px] flex-wrap lg:flex-nowrap'>
                                    {secure_url.map((picture, index) => (
                                          <img
                                                src={picture.secure_url}
                                                key={picture.secure_url}
                                                className={`${
                                                      index + 1 === posImage ? styleEffect.isActiveImage : 'border-[3px] border-transparent'
                                                } w-[100px] h-[100px]  xl:w-[80px] xl:h-[80px] hover:cursor-pointer     `}
                                                alt='product-sub'
                                                onClick={() => handleClickChangeImage(index)}
                                          />
                                    ))}
                              </div>
                        </div>
                  </div>
            </Portal>
      )
}

export default BoxModalImage
