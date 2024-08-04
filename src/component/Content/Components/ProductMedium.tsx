import React from 'react'
import { TProductDetail } from '../../../types/product/product.type'
import logoSun from '../../../pages/product/assets/img/sun.png'
import logoNow from '../../../pages/product/assets/img/now.png'

import { Link } from 'react-router-dom'
import { Rate } from 'antd'
import ProductLabel from '../../../pages/product/ProductLabel'
import TikiBestLogo from '../assets/img/Label/TikiBest.png'
//w-175 - h-285
//item-iamge / h-[175]

type TProps = {
      product: TProductDetail
      TikiBest?: boolean
      ship?: boolean
}

const ProductMedium = (props: TProps) => {
      const { product, TikiBest = false, ship = false } = props

      return (
            <Link
                  to={`/product/${product._id}`}
                  className='w-full h-full  flex flex-col  gap-[10px] border-[1px] border-slate-200  rounded-lg bg-[#ffffff] hover:shadow-xl p-1'
            >
                  <div className='relative w-full h-[60%]'>
                        <img src={product.product_thumb_image?.secure_url} className='w-full h-[77%] rounded-t-lg' alt='' />
                        <div className=' absolute bottom-0 left-0 px-[10px] flex flex-col gap-[5px]'>
                              {TikiBest && <img src={TikiBestLogo} className='w-[80px]' alt='logo-tiki-best' />}
                              <ProductLabel content='Chính hãng' />
                        </div>
                  </div>
                  <div className='px-[10px] gap-[7px] flex-1 flex flex-col '>
                        <span className='w-[95%] break-words  line-clamp-2 text-[12px] font-normal'>{product.product_name}</span>
                        <Rate disabled allowHalf defaultValue={product.product_votes} className='text-[12px]' />
                  </div>
                  <span className='px-[10px] flex-1 break-words line-clamp-2 text-[14px] font-medium'>{product.product_price} VNĐ</span>
                  <div className='h-[40px] flex items-center gap-[8px] px-[10px] pt-[4px] border-t-[1px] border-slate-200'>
                        {ship ? (
                              <img src={logoNow} className='hidden xl:inline w-[30px] h-[16px] rounded-xl' alt='' />
                        ) : (
                              <img src={logoSun} className='hidden xl:inline w-[30px] h-[16px] rounded-xl' alt='' />
                        )}
                        <span className='text-[11px]'>Giao chiều mai</span>
                  </div>
            </Link>
      )
}

export default ProductMedium
