import React, { useEffect, useRef, useState } from 'react'
import { TProductDetail } from '../../types/product/product.type'

type TProps = {
      product: TProductDetail
}

const ProductDescription = (props: TProps) => {
      const { product } = props

      const [openMore, setOpenMore] = useState<boolean>(false)
      const wrapperConent = useRef<HTMLDivElement>(null)
      const [showBtn, setShowBtn] = useState<boolean>(false)

      const onReadMore = () => {
            if (openMore) {
                  document.getElementById('description')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }
            setOpenMore((prev) => !prev)
      }

      useEffect(() => {
            if (wrapperConent.current) {
                  if (wrapperConent.current.getBoundingClientRect().height > 200) {
                        setShowBtn(true)
                  }
            }
      }, [])
      return (
            <>
                  <div
                        style={{ height: openMore ? 'max-content' : 300 }}
                        className='relative bg-white w-full  px-[18px] pt-[18px] pb-[70px] overflow-y-hidden'
                  >
                        <header>
                              <p id='description' className='text-[18px] text-black font-semibold my-[20px]'>
                                    Mô tả sản phẩm
                              </p>
                        </header>

                        <div
                              className='min-h-[70px]  h-max w-full  bg-[#ffffff] grid grid-cols-2 md:grid-cols-3 xl:grid-cols-1 mb-[40px] '
                              ref={wrapperConent}
                        >
                              <img src={product.product_thumb_image.secure_url} className='w-[100%] h-[200px] xl:h-[555px]' alt='' />
                              {product.product_desc_image.map((image) => (
                                    <img key={image.public_id} src={image.secure_url} className='w-[100%] h-[200px] xl:h-[555px]' alt='' />
                              ))}
                        </div>

                        <pre className='whitespace-pre-wrap break-words '>
                              {product.attribute.description}
                        </pre>

                        {!openMore && (
                              <div
                                    style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0), rgb(255, 255, 255,1))' }}
                                    className='absolute bottom-0 left-0 w-full    h-[260px]'
                              ></div>
                        )}

                        {showBtn && (
                              <button
                                    className=' absolute bottom-0 w-[calc(100%-36px)] h-[60px] bg-transparent  flex items-center justify-center text-blue-600'
                                    onClick={onReadMore}
                              >
                                    {openMore ? 'Thu gọn' : 'Xem thêm'}
                              </button>
                        )}
                  </div>
            </>
      )
}

export default ProductDescription
