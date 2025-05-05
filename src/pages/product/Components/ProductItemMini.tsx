import React from 'react'
import { TProductDetail } from '../../../types/product/product.type'
import { Rate } from 'antd'
import { Link } from 'react-router-dom'

type TProps = {
      product: TProductDetail
}

const ProductItemMini = (props: TProps) => {
      const { product } = props

      return (
            <Link
                  to={`/product/${product._id}`}
                  className=' w-full max-h-full  flex flex-col gap-[20px] border-[1px] border-[var(--border-color-input)]  rounded-lg pb-[5px] hover:shadow-lg'
            >
                  <img src={product.product_thumb_image?.secure_url} className='w-full h-[55%] object-contain  rounded-t-lg' alt='' />
                  <div className='px-[6px]  flex-1 flex flex-col gap-[10px]  justify-between text-[8px]'>
                        <div className='min-h-[20px] h-max w-full'>
                              <span className='w-full break-words   line-clamp-2 text-[12px] '>
                                    {product.product_name}
                              </span>
                              <Rate disabled allowHalf defaultValue={product.product_votes} className='text-[11px]' />
                        </div>
                        <p className=' break-words line-clamp-2 text-[14px] font-medium'>
                              <span>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.product_price)}
                              </span>
                        </p>
                  </div>
            </Link>
      )
}

export default ProductItemMini
