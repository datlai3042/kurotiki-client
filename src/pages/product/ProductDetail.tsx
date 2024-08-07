import React, { useEffect, useRef, useState } from 'react'
import { TProductDetail } from '../../types/product/product.type'
import BoxModalImage from './BoxModalImage'
import { TImage } from './Product'

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
            isActive: 'border-[2px] border-blue-600',
      }

      return (
            <React.Fragment>
                  <div className='basis-[20%] md:basis-[35%] h-max flex justify-center rounded-xl p-[12px]  '>
                        <img
                              src={product!.product_thumb_image.secure_url}
                              className='cursor-pointer w-[90%] h-[360px] min-h-[240px] xl:min-h-[360px] xl:max-h-[360px]  transition-all duration-700 rounded-lg'
                              alt='product'
                              ref={image}
                              onClick={handleOpenModal}
                        />
                  </div>
                  <div className='flex px-[14px] gap-[8px] flex-wrap md:flex-nowrap rounded-lg'>
                        {imageArray.map((image) => (
                              <img
                                    src={image.secure_url}
                                    className={`${
                                          imageActive === image.secure_url ? styleEffect.isActive : 'border-[2px] border-slate-200'
                                    }  h-[180px] w-[47%] xl:w-[55px] xl:h-[55px] md:w-[60px] md:h-[80px]  rounded p-[4px]`}
                                    alt='product_sub'
                                    key={image.secure_url}
                                    onMouseLeave={handleMouseLeave}
                                    onMouseEnter={() => handleMouseEnter(image.secure_url)}
                                    onClick={() => handleClickImage(image.secure_url as string)}
                              />
                        ))}
                  </div>

                  {openModal && <BoxModalImage setOpenModal={setOpenModal} secure_url={imageArray} imageActive={imageActive} />}
            </React.Fragment>
      )
}

export default ProductDetail
