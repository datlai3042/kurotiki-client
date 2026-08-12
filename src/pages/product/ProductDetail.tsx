import React, { useEffect, useRef, useState } from 'react'
import { TProductDetail } from '../../types/product/product.type'
import { TImage } from './Product'
import BoxModalImage from './BoxModalImage'

type TProps = {
      product: TProductDetail
      isSuccess: boolean
}

const ProductDetail = (props: TProps) => {
      const { product, isSuccess } = props

      const image = useRef<HTMLImageElement | null>(null)
      const [imageActive, setImageActive] = useState<string>('')
      const [imageArray, setImageArray] = useState<TImage[]>([])
      const [openModal, setOpenModal] = useState<boolean>(false)

      const handleMouseEnter = (secure_url: string) => {
            if (image.current) {
                  image.current.src = secure_url
                  image.current.style.transition = 'all 2s'
            }
      }

      const handleMouseLeave = () => {
            if (image.current) {
                  image.current.src = imageActive
            }
      }

      const handleClickImage = (secure_url: string) => {
            setImageActive(secure_url)
      }

      const handleOpenModal = () => {
            setOpenModal(true)
      }

      useEffect(() => {
            if (isSuccess) {
                  setImageActive(product?.product_thumb_image.secure_url as string)
                  // product?.product_desc_image.unshift(product.product_thumb_image)
                  setImageArray(() => {
                        const array = product?.product_desc_image.map((img) => {
                              return { secure_url: img.secure_url }
                        })
                        array.unshift({ secure_url: product.product_thumb_image.secure_url })
                        return array
                  })
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [isSuccess, product])

      const styleEffect = {
            isActive: 'border-[1px] border-blue-600',
      }

      return (
            <React.Fragment>
                  <div className=' flex-1  h-full flex justify-center rounded-xl p-[12px]  '>
                        <img
                              src={product!.product_thumb_image.secure_url}
                              className='cursor-pointer object-cover object-top w-[460px] h-[400px] min-h-[240px] xl:min-h-[360px] max-h-[600px] xl:h-full  transition-all duration-700 rounded-lg'
                              alt='product'
                              ref={image}
                              onClick={handleOpenModal}
                        />
                  </div>
                  <div className='flex flex-col gap-[8px]'>
                        <div
                              className='
                  flex
                  flex-nowrap
                  gap-[12px]
                  overflow-x-auto
                  px-[14px]
                  pb-[4px]

                  md:flex-col
                  md:flex-nowrap
                  md:overflow-visible
                  md:gap-[16px]

                  [scrollbar-width:none]
                  [&::-webkit-scrollbar]:hidden
            '
                        >
                              {imageArray.map((image) => (
                                    <img
                                          src={image.secure_url}
                                          className={`
                              ${
                                    imageActive === image.secure_url
                                          ? styleEffect.isActive
                                          : 'border-[1px] border-[var(--border-color-input)] hover:border-blue-600'
                              }

                              h-[90px]
                              w-[90px]
                              min-w-[90px]
                              shrink-0
                              snap-start
                              rounded
                              object-contain
                              p-[4px]

                              md:h-[90px]
                              md:w-[60px]
                              md:min-w-[60px]

                              xl:h-[110px]
                              xl:w-[110px]
                              xl:min-w-[110px]
                        `}
                                          alt='product_sub'
                                          key={image.secure_url}
                                          onMouseLeave={handleMouseLeave}
                                          onMouseEnter={() => handleMouseEnter(image.secure_url)}
                                          onClick={() => handleClickImage(image.secure_url as string)}
                                    />
                              ))}
                        </div>

                        {imageArray.length > 3 && (
                              <div className='flex items-center justify-center gap-[4px] text-[11px] text-slate-400 md:hidden'>
                                    <span>Vuốt ngang để xem thêm</span>
                                    <span>→</span>
                              </div>
                        )}
                  </div>

                  {openModal && <BoxModalImage setOpenModal={setOpenModal} secure_url={imageArray} imageActive={imageActive} />}
            </React.Fragment>
      )
}

export default ProductDetail
