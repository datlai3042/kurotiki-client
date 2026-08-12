import React, { useEffect, useRef, useState } from 'react'
import { ProductForm } from '../../../../types/product/product.type'
import { ChevronLeft, ChevronRight, ImageIcon, Package, ShoppingBag } from 'lucide-react'
import { useDebouncedCallback } from '@mantine/hooks'

type TProps = {
      productFormImage: {
            secure_url: string
            public_id: string
      }[]
      info: ProductForm
      buttonSubmit: React.ReactNode
}

const ProductReivew = ({ productFormImage, info, buttonSubmit }: TProps) => {
      const hasName = Boolean(info?.product_name)
      const hasPrice = Boolean(info?.product_price)
      const hasDescription = Boolean(info?.attribute?.description)

      return (
            <div className='hidden w-full max-w-[400px] flex-col gap-4 text-text-theme md:flex'>
                  <div className='overflow-hidden rounded-2xl border border-[var(--border-color-input)] bg-color-section-theme shadow-[0_8px_28px_rgba(0,0,0,0.06)]'>
                        {/* Preview image */}
                        <div className='relative aspect-[4/3] w-full overflow-hidden border-b border-[var(--border-color-input)] bg-slate-500/[0.035]'>
                              {productFormImage.length > 0 ? (
                                    <ProductFormSliderPreview arrayImage={[...productFormImage]} />
                              ) : (
                                    <div className='flex h-full w-full flex-col items-center justify-center gap-3 text-slate-400'>
                                          <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-500/10'>
                                                <ImageIcon size={26} strokeWidth={1.6} />
                                          </div>

                                          <div className='text-center'>
                                                <p className='text-[13px] font-medium text-text-theme'>Chưa có hình ảnh</p>
                                                <p className='mt-1 text-[11px] text-slate-500'>Ảnh sản phẩm sẽ hiển thị tại đây</p>
                                          </div>
                                    </div>
                              )}
                        </div>

                        {/* Product info */}
                        <div className='p-4'>
                              <div className='flex items-start justify-between gap-3'>
                                    <div className='min-w-0 flex-1'>
                                          <p className='text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400'>
                                                Tên sản phẩm
                                          </p>

                                          <h3
                                                title={info?.product_name}
                                                className={`mt-1 line-clamp-2 text-[16px] font-semibold leading-6 ${
                                                      hasName ? 'text-text-theme' : 'italic text-slate-400'
                                                }`}
                                          >
                                                {info?.product_name || 'Chưa có tên sản phẩm'}
                                          </h3>
                                    </div>

                                    <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500'>
                                          <Package size={17} />
                                    </div>
                              </div>

                              <div className='mt-4 rounded-xl border border-[var(--border-color-input)] bg-slate-500/[0.025] p-3'>
                                    <p className='text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400'>Giá bán</p>

                                    <p className={`mt-1 text-[20px] font-bold ${hasPrice ? 'text-emerald-500' : 'text-slate-400'}`}>
                                          {hasPrice ? `${Number(info.product_price).toLocaleString('vi-VN')} ₫` : 'Chưa có giá sản phẩm'}
                                    </p>
                              </div>

                              <div className='mt-4'>
                                    <p className='text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400'>Mô tả</p>

                                    <p
                                          className={`mt-1 max-h-[110px] overflow-y-auto pr-1 text-[12px] leading-5 ${
                                                hasDescription ? 'text-slate-500' : 'italic text-slate-400'
                                          }`}
                                    >
                                          {info?.attribute?.description || 'Chưa có mô tả sản phẩm'}
                                    </p>
                              </div>

                              <div className='mt-4 flex items-center justify-between rounded-xl border border-[var(--border-color-input)] px-3 py-2.5'>
                                    <div className='flex items-center gap-2'>
                                          <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500'>
                                                <ShoppingBag size={15} />
                                          </div>

                                          <div>
                                                <p className='text-[10px] text-slate-400'>Tồn kho</p>
                                                <p className='text-[12px] font-semibold text-text-theme'>
                                                      {info?.product_available || 0} sản phẩm
                                                </p>
                                          </div>
                                    </div>

                                    <span
                                          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                                                Number(info?.product_available || 0) > 0
                                                      ? 'bg-emerald-500/10 text-emerald-500'
                                                      : 'bg-slate-500/10 text-slate-400'
                                          }`}
                                    >
                                          {Number(info?.product_available || 0) > 0 ? 'Có hàng' : 'Chưa có hàng'}
                                    </span>
                              </div>

                              <div className='mt-4'>{buttonSubmit}</div>
                        </div>
                  </div>
            </div>
      )
}

type PropsSliderImages = {
      arrayImage: {
            secure_url: string
            public_id: string
      }[]
}

const ProductFormSliderPreview = ({ arrayImage }: PropsSliderImages) => {
      const wrapperRef = useRef<HTMLDivElement>(null)
      const timer = useRef<ReturnType<typeof setInterval> | null>(null)
      const [indexImage, setIndexImage] = useState(0)

      const moveTo = (index: number, animated = true) => {
            if (!wrapperRef.current) return

            wrapperRef.current.style.transform = `translateX(-${index * 100}%)`
            wrapperRef.current.style.transition = animated ? 'transform .35s ease' : 'none'
      }

      const onClickNext = () => {
            if (indexImage >= arrayImage.length - 1) return
            setIndexImage((prev) => prev + 1)
      }

      const onClickPrev = () => {
            if (indexImage <= 0) return
            setIndexImage((prev) => prev - 1)
      }

      const debounceResize = useDebouncedCallback(() => {
            moveTo(indexImage, false)
      }, 100)

      useEffect(() => {
            moveTo(indexImage)
      }, [indexImage])

      useEffect(() => {
            if (arrayImage.length <= 1) return

            timer.current = setInterval(() => {
                  setIndexImage((prev) => {
                        if (prev >= arrayImage.length - 1) return 0
                        return prev + 1
                  })
            }, 4000)

            return () => {
                  if (timer.current) clearInterval(timer.current)
            }
      }, [arrayImage.length])

      useEffect(() => {
            window.addEventListener('resize', debounceResize)

            return () => {
                  window.removeEventListener('resize', debounceResize)
            }
      }, [debounceResize])

      useEffect(() => {
            if (indexImage >= arrayImage.length) {
                  setIndexImage(Math.max(arrayImage.length - 1, 0))
            }
      }, [arrayImage.length, indexImage])

      return (
            <div className='group relative h-full w-full overflow-hidden'>
                  <div ref={wrapperRef} className='flex h-full w-full'>
                        {arrayImage.map((img) => (
                              <div key={img.public_id} className='h-full min-w-full'>
                                    <img src={img.secure_url} className='h-full w-full object-contain' alt='product preview' />
                              </div>
                        ))}
                  </div>

                  {arrayImage.length > 1 && (
                        <>
                              <button
                                    type='button'
                                    onClick={onClickPrev}
                                    disabled={indexImage === 0}
                                    className='absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100 disabled:cursor-default disabled:opacity-20'
                                    aria-label='Ảnh trước'
                              >
                                    <ChevronLeft size={18} />
                              </button>

                              <button
                                    type='button'
                                    onClick={onClickNext}
                                    disabled={indexImage === arrayImage.length - 1}
                                    className='absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100 disabled:cursor-default disabled:opacity-20'
                                    aria-label='Ảnh tiếp theo'
                              >
                                    <ChevronRight size={18} />
                              </button>

                              <div className='absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1.5 backdrop-blur-sm'>
                                    {arrayImage.map((_, index) => (
                                          <button
                                                type='button'
                                                key={index}
                                                onClick={() => setIndexImage(index)}
                                                className={`h-1.5 rounded-full transition-all ${
                                                      indexImage === index ? 'w-5 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
                                                }`}
                                                aria-label={`Xem ảnh ${index + 1}`}
                                          />
                                    ))}
                              </div>
                        </>
                  )}
            </div>
      )
}

export default ProductReivew
