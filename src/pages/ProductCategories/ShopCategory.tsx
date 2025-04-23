import React, { useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import ShopApi from '../../apis/shop.api'
import { ProductType } from '../../types/product/product.type'
import { Link } from 'react-router-dom'
// import { shopData } from './books/utils/shopImageData'

// import shop_thumb1 from '../assets/img/ShopCategory/thumb1png.png'
// import shop_thumb2 from '../assets/img/ShopCategory/thum2png.png'

type TProps = {
      product_type: ProductType
}

const ShopCategory = (props: TProps) => {
      const { product_type } = props

      const queryShops = useQuery({
            queryKey: ['get-shop-has-product'],
            queryFn: () => ShopApi.foundShopHasProductType({ product_type }),
      })

      const shops = queryShops.data?.data.metadata.shops || []
      const ShopCount = Math.ceil(shops?.length / 2) || 0

      const wrapperRef = useRef<HTMLDivElement>(null)
      const [positionWrapper, setPositionWrapper] = useState<number>(0)
      const [countTranslate, setCountTranslate] = useState<number>(1)

      const onTranslateNext = () => {
            if (wrapperRef.current) {
                  const width = wrapperRef.current.getBoundingClientRect().width
                  const newPositionWrapper = positionWrapper - width
                  wrapperRef.current.style.transform = `translateX(${newPositionWrapper}px)`
                  wrapperRef.current.style.transition = ' all 1s'
                  setPositionWrapper(newPositionWrapper)
                  if (countTranslate === ShopCount) return
                  setCountTranslate((prev) => prev + 1)
            }
      }

      const onTranslatePrev = () => {
            if (wrapperRef.current) {
                  const width = wrapperRef.current.getBoundingClientRect().width
                  const newPositionWrapper = positionWrapper + width

                  wrapperRef.current.style.transform = `translateX(${newPositionWrapper}px)`
                  wrapperRef.current.style.transition = ' all 1s'
                  setPositionWrapper(newPositionWrapper)
                  if (countTranslate === 1) return
                  setCountTranslate((prev) => prev - 1)
            }
      }

      return (
            <div className='relative w-full h-[200px] rounded  xl:overflow-hidden'>
                  <div className=' flex gap-[16px] h-full w-full overflow-scroll xl:overflow-visible' ref={wrapperRef}>
                        {shops?.map((shop) => (
                              <div key={shop._id} className='flex gap-[18px] min-w-[100%]  xl:min-w-[50%]'>
                                    <div className='relative w-[36%] xl:w-[36%] flex  items-center justify-center overflow-hidden'>
                                          <div
                                                style={{
                                                      backgroundImage: `url(${shop.shop_avatar?.secure_url || shop.shop_avatar_default}) `,
                                                      filter: 'blur(10px)',
                                                }}
                                                className='min-w-full w-full h-full'
                                          ></div>
                                          <img
                                                src={shop.shop_avatar?.secure_url || shop.shop_avatar_default}
                                                className='absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-1 w-[70px] h-[70px] xl:w-[140px] xl:h-[140px] rounded'
                                                alt='avatar_shop'
                                          />
                                    </div>
                                    <Link to={`/shop/${shop._id}`} className='w-[60%] flex flex-col justify-center'>
                                          <h4>
                                                Cửa hàng: <span className='underline font-bold'>{shop.shop_name}</span>{' '}
                                          </h4>
                                    </Link>
                              </div>
                        ))}
                  </div>
                  <button
                        className='absolute  left-[0px]  bg-color-main h-[60px] w-[36px] top-[50%] translate-y-[-50%] hidden xl:flex items-center justify-center shadow-lg'
                        onClick={onTranslatePrev}
                        disabled={countTranslate === 1}
                  >
                        <ArrowLeft size={20} color='white' />
                  </button>
                  <button
                        className='absolute  right-[0px]  bg-color-main h-[60px] w-[36px] top-[50%] translate-y-[-50%] hidden xl:flex items-center justify-center shadow-lg'
                        onClick={onTranslateNext}
                        disabled={countTranslate === ShopCount}
                  >
                        <ArrowRight size={20} color='white' />
                  </button>
            </div>
            // <div className='w-[50%] bg-blue-800'></div>
      )
}

export default ShopCategory
