import React, { useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Store } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import ShopApi from '../../apis/shop.api'
import { ProductType } from '../../types/product/product.type'
import { Link } from 'react-router-dom'

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
            <section className='relative w-full overflow-hidden'>
                  <div className='bg-color-section-theme flex items-center justify-between border-b border-[var(--border-color-input)] px-5 py-4'>
                        <div className='flex items-center gap-2'>
                              <Store size={17} className='text-blue-500' />
                              <h3 className='text-[16px] font-semibold text-text-theme'>Cửa hàng nổi bật</h3>
                        </div>

                        <span className='text-xs text-blue-500'>Xem tất cả</span>
                  </div>

                  <div
                        className='flex min-h-[170px] w-full gap-3 overflow-x-auto px-4 py-4 xl:overflow-visible'
                        ref={wrapperRef}
                  >
                        {shops?.map((shop) => (
                              <Link
                                    to={`/shop/${shop._id}`}
                                    key={shop._id}
                                    className='group flex min-w-[260px] items-center gap-3 rounded-xl border border-[var(--border-color-input)]  bg-color-section-theme p-3 transition hover:border-blue-500/40 hover:bg-blue-500/5 xl:min-w-[calc(25%-10px)]'
                              >
                                    <div className='relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-800'>
                                          <div
                                                style={{
                                                      backgroundImage: `url(${shop.shop_avatar?.secure_url || shop.shop_avatar_default})`,
                                                      backgroundSize: 'cover',
                                                      backgroundPosition: 'center',
                                                      filter: 'blur(8px)',
                                                }}
                                                className='absolute inset-0 opacity-60'
                                          />

                                          <img
                                                src={shop.shop_avatar?.secure_url || shop.shop_avatar_default}
                                                className='absolute inset-0 m-auto h-14 w-14 rounded-lg object-cover'
                                                alt='avatar_shop'
                                          />
                                    </div>

                                    <div className='min-w-0'>
                                          <h4 className='truncate text-sm font-semibold text-text-theme transition group-hover:text-blue-400'>
                                                {shop.shop_name}
                                          </h4>

                                          <p className='mt-1 text-xs text-slate-500'>
                                                Gian hàng nổi bật
                                          </p>
                                    </div>
                              </Link>
                        ))}
                  </div>

                  <button
                        className='absolute left-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#1c2635] text-white shadow-lg transition hover:bg-blue-600 disabled:opacity-30 xl:flex'
                        onClick={onTranslatePrev}
                        disabled={countTranslate === 1}
                  >
                        <ArrowLeft size={18} />
                  </button>

                  <button
                        className='absolute right-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#1c2635] text-white shadow-lg transition hover:bg-blue-600 disabled:opacity-30 xl:flex'
                        onClick={onTranslateNext}
                        disabled={countTranslate === ShopCount}
                  >
                        <ArrowRight size={18} />
                  </button>
            </section>
      )
}

export default ShopCategory