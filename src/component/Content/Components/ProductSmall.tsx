import React from 'react'
import { TProductDetail } from '../../../types/product/product.type'
import logoSun from '../../../pages/product/assets/img/sun.png'
import { Link } from 'react-router-dom'
import { Rate } from 'antd'
//w-175 - h-285
//item-iamge / h-[175]

type TProps = {
      product: TProductDetail
}

const ProductSmall = (props: TProps) => {
      const { product } = props

      return (
            <Link
                  to={`product/${product._id}`}
                  className='w-full h-full  flex flex-col  gap-[10px] border-[1px] border-[var(--border-color-input)]  rounded-lg bg-color-section-theme text-text-theme p-1'
            >
                  <div className='relative w-full h-[60%]'>
                        <img src={product.product_thumb_image?.secure_url} className='object-contain w-full h-[85%] rounded-t-lg' alt='' />
                  </div>
                  <div className='px-[10px] gap-[7px] flex-1 flex flex-col '>
                        <span className='w-[80%] break-words  line-clamp-2 text-[12px] font-normal'>{product.product_name}</span>
                        <Rate disabled allowHalf defaultValue={product.product_votes} className='text-[12px]' />
                  </div>
                  <span className='px-[10px] flex-1 break-words line-clamp-2 text-[14px] font-medium'>{product.product_price}</span>
                  <div className='h-[30px] flex items-center gap-[8px] px-[10px] pt-[4px] border-t-[1px] border-[var(--border-color-input)]'>
                        <img src={logoSun} className='hidden xl:inline w-[30px] h-[16px] rounded-xl' alt='' />
                        <span className='text-[11px]'>Giao chiều mai</span>
                  </div>
            </Link>
      )
}

export default ProductSmall
