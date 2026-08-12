import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useRef, useState } from 'react'
import ProductApi from '../../apis/product.api'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ProductItemMini from './Components/ProductItemMini'
import { TProductDetail } from '../../types/product/product.type'

type TProps = {
      product: TProductDetail
}

const ELEMENT_PAGE = 12

const ProductSimiliar = ({ product }: TProps) => {
      const [count, setCount] = useState(1)
      const [showMobileHint, setShowMobileHint] = useState(true)

      const mobileScrollRef = useRef<HTMLDivElement>(null)

      const allProduct = useQuery({
            queryKey: ['get-all-product', product._id, product.product_type],
            queryFn: () =>
                  ProductApi.getProductSimilar({
                        product_type: product.product_type,
                        type: product.attribute.type,
                        product_id: product._id,
                  }),
            staleTime: 1000 * 60 * 5,
      })

      const productData = allProduct.data?.data.metadata.products || []
      const totalPage = Math.ceil(productData.length / ELEMENT_PAGE)

      const pages = Array.from({ length: totalPage }, (_, index) =>
            productData.slice(index * ELEMENT_PAGE, (index + 1) * ELEMENT_PAGE),
      )

      const handleClickNext = () => {
            if (count >= totalPage) return
            setCount((prev) => prev + 1)
      }

      const handleClickPrev = () => {
            if (count <= 1) return
            setCount((prev) => prev - 1)
      }

      const updateMobileHint = () => {
            const el = mobileScrollRef.current
            if (!el) return

            const isAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8
            setShowMobileHint(!isAtEnd)
      }

      const handleMobileNext = () => {
            const el = mobileScrollRef.current
            if (!el) return

            el.scrollBy({
                  left: Math.max(el.clientWidth * 0.75, 150),
                  behavior: 'smooth',
            })
      }

      useEffect(() => {
            setShowMobileHint(true)
      }, [product._id])

      return (
            <div className='relative mx-[16px] flex h-full flex-col gap-[16px] overflow-hidden py-[24px]'>
                  <div className='flex items-center justify-between gap-[12px]'>
                        <p className='text-[16px] font-semibold'>Sản phẩm tương tự</p>

                        {productData.length > 2 && (
                              <button
                                    type='button'
                                    onClick={handleMobileNext}
                                    className='flex shrink-0 items-center gap-[2px] rounded-full border border-blue-400/40 bg-blue-500/10 px-[8px] py-[4px] text-[11px] font-medium text-blue-400 xl:hidden'
                              >
                                    Vuốt xem thêm
                                    <ChevronRight size={13} />
                              </button>
                        )}
                  </div>

                  {!allProduct.isPending && productData.length === 0 && (
                        <div className='flex min-h-[220px] w-full items-center justify-center rounded-lg bg-color-section-theme text-[20px] font-semibold text-text-theme'>
                              Không có thông tin các sản phẩm khác
                        </div>
                  )}

                  {productData.length > 0 && (
                        <>
                              {/* MOBILE / TABLET */}
                              <div className='relative xl:hidden'>
                                    <div
                                          ref={mobileScrollRef}
                                          onScroll={updateMobileHint}
                                          className='
                                                flex
                                                snap-x
                                                snap-mandatory
                                                items-stretch
                                                gap-[12px]
                                                overflow-x-auto
                                                pb-[10px]
                                                pr-[52px]
                                                [scrollbar-width:none]
                                                [&::-webkit-scrollbar]:hidden
                                          '
                                    >
                                          {productData.map((item) => (
                                                <div
                                                      key={item._id}
                                                      className='
                                                            w-[140px]
                                                            min-w-[140px]
                                                            snap-start
                                                            sm:w-[160px]
                                                            sm:min-w-[160px]
                                                      '
                                                >
                                                      <ProductItemMini product={item} />
                                                </div>
                                          ))}
                                    </div>

                                    {productData.length > 2 && showMobileHint && (
                                          <>
                                                <div className='pointer-events-none absolute bottom-[10px] right-0 top-0 z-10 w-[54px] bg-gradient-to-l from-color-section-theme via-color-section-theme/80 to-transparent' />

                                                <button
                                                      type='button'
                                                      onClick={handleMobileNext}
                                                      aria-label='Xem thêm sản phẩm'
                                                      className='absolute right-[6px] top-1/2 z-20 flex h-[34px] w-[34px] -translate-y-1/2 items-center justify-center rounded-full border border-blue-300/60 bg-blue-500 text-white shadow-lg'
                                                >
                                                      <ChevronRight size={20} />
                                                </button>
                                          </>
                                    )}
                              </div>

                              {/* DESKTOP */}
                              <div className='relative hidden overflow-hidden xl:block'>
                                    <div
                                          className='flex transition-transform duration-500 ease-in-out'
                                          style={{
                                                transform: `translate3d(-${(count - 1) * 100}%, 0, 0)`,
                                          }}
                                    >
                                          {pages.map((page, pageIndex) => (
                                                <div
                                                      key={pageIndex}
                                                      className='grid h-full w-full min-w-full grid-cols-6 grid-rows-2 gap-[18px]'
                                                >
                                                      {page.map((item) => (
                                                            <ProductItemMini product={item} key={item._id} />
                                                      ))}
                                                </div>
                                          ))}
                                    </div>
                              </div>
                        </>
                  )}

                  {/* DESKTOP PAGINATION */}
                  {totalPage > 1 && (
                        <div className='absolute bottom-[10px] left-1/2 hidden h-[3px] -translate-x-1/2 justify-center gap-[8px] xl:flex'>
                              {Array.from({ length: totalPage }).map((_, index) => (
                                    <button
                                          type='button'
                                          key={index}
                                          onClick={() => setCount(index + 1)}
                                          aria-label={`Trang ${index + 1}`}
                                          className={`h-full w-[40px] rounded-full ${
                                                index + 1 === count ? 'bg-blue-400' : 'bg-slate-400'
                                          }`}
                                    />
                              ))}
                        </div>
                  )}

                  {/* DESKTOP PREV */}
                  {count > 1 && !allProduct.isPending && (
                        <button
                              type='button'
                              className='absolute left-0 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-xl xl:flex'
                              onClick={handleClickPrev}
                              disabled={count <= 1}
                              aria-label='Sản phẩm trước'
                        >
                              <ChevronLeft size={28} className='text-blue-600' />
                        </button>
                  )}

                  {/* DESKTOP NEXT */}
                  {count < totalPage && !allProduct.isPending && (
                        <button
                              type='button'
                              className='absolute right-0 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-xl xl:flex'
                              onClick={handleClickNext}
                              disabled={count >= totalPage}
                              aria-label='Sản phẩm tiếp theo'
                        >
                              <ChevronRight size={28} className='text-blue-600' />
                        </button>
                  )}
            </div>
      )
}

export default ProductSimiliar