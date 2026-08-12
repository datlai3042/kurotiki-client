import React from 'react'
import { TProductDetail } from '../../../types/product/product.type'
import logoSun from '../../../pages/product/assets/img/sun.png'
import { Link } from 'react-router-dom'
import { Rate } from 'antd'
import { Heart, Truck } from 'lucide-react'

type TProps = {
      product: TProductDetail
}

const ProductSmall = (props: TProps) => {
      const { product } = props

      return (
            <Link
                  to={`product/${product._id}`}
                  className='group/card relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-[var(--border-color-input)] bg-color-section-theme text-text-theme transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500/30 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]'
            >
                  <div className='relative h-[55%] min-h-0 overflow-hidden  p-3'>
                        <img
                              src={product.product_thumb_image?.secure_url}
                              className='h-full w-full rounded-xl object-contain transition-transform duration-300 group-hover/card:scale-[.83]'
                              alt={product.product_name}
                        />

                        <button
                              type='button'
                              onClick={(event) => {
                                    event.preventDefault()
                                    event.stopPropagation()
                              }}
                              className='absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-color-input)] bg-color-section-theme/90 text-slate-400 shadow-sm backdrop-blur transition hover:border-red-400/40 hover:text-red-500'
                              aria-label='Yêu thích'
                        >
                              <Heart size={15} />
                        </button>
                  </div>

                  <div className='flex min-h-0 flex-1 flex-col px-3 pb-3 pt-2'>
                        <h4 className='line-clamp-2 min-h-[46px] text-[15px] font-medium leading-[23px] text-text-theme'>
                              {product.product_name}
                        </h4>

                        <div className='mt-1 flex items-center gap-1'>
                              <Rate disabled allowHalf defaultValue={product.product_votes} className='text-[11px] leading-none' />
                        </div>

                        <div className='mt-2 text-[14px] font-bold text-text-theme'>
                              {Number(product.product_price || 0).toLocaleString('vi-VN')}đ
                        </div>

                        <div className='mt-auto flex items-center gap-2 pt-5 text-[12px] font-medium text-cyan-500'>
                              <Truck size={17} strokeWidth={2.2} />
                              <span>Giao siêu nhanh</span>
                        </div>
                  </div>
            </Link>
      )
}

export default ProductSmall
