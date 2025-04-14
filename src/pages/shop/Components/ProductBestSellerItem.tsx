import React from 'react'
import { TProductDetail } from '../../../types/product/product.type'
import Logo from '../../../component/Content/assets/img/Label/chinhHang.png'
import LogoNow from '../../../pages/product/assets/img/now.png'
import Top1 from '../../../component/Content/assets/img/rank/top1.svg'
import Top2 from '../../../component/Content/assets/img/rank/top2.svg'
import Top3 from '../../../component/Content/assets/img/rank/top3.svg'

import { Rate } from 'antd'
import { Link } from 'react-router-dom'

type TProps = {
      product: TProductDetail
      rank: number
}

const ProductBestSellerItem = (props: TProps) => {
      const { product, rank } = props
      const rankImage = rank === 1 ? Top1 : rank === 2 ? Top2 : Top3

      return (
            <Link
                  to={`/product/${product._id}`}
                  className='flex gap-[10px]  bg-color-section-theme text-text-theme rounded-md max-w-full h-full'
            >
                  <div className='w-[160px] h-full relative'>
                        <img src={product.product_thumb_image.secure_url} className='w-full h-full' alt='product' />
                        <img src={Logo} alt='logo' className='absolute top-0 left-0 w-[80px] h-[20px] ' />
                        {rank <= 3 && <img src={rankImage} alt='logo' className='absolute top-0 right-[-20px]  w-[80px] h-[60px] ' />}
                  </div>
                  <div className='w-[calc(100%-160px)] h-full flex-flex-col text-[12px] '>
                        <div className='flex-grow h-[calc(100%-30px)] flex flex-col  gap-[8px] '>
                              <p className=' line-clamp-4 xl:line-clamp-2  w-[calc(100%-16px)] break-words  '>{product.product_name}</p>
                              <div className='flex items-center gap-[4px] h-[16px]'>
                                    <span>{product.product_votes || 4.5}</span>
                                    <Rate defaultValue={1} count={1} disabled className='text-[13px]' />
                                    <span className='inline-block mx-[4px] w-[1px] h-full bg-[var(--border-color-input)] '></span>
                                    <span>
                                          Đã bán{' '}
                                          {product.product_is_bought > 1000 ? `${product.product_is_bought}+` : product.product_is_bought}
                                    </span>
                              </div>
                              <span className='text-[18px] font-semibold text-red-400'>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                                          .format(product.product_price)
                                          .replace('₫', 'VNĐ')}
                              </span>
                        </div>
                        <div className='flex items-center gap-[8px] h-[30px] pt-[8px] border-t-[2px] border-[var(--border-color-input)]'>
                              <img src={LogoNow} className='w-[30px] h-[15px]' alt='' />
                              <span>Giao siêu tốc 2h</span>
                        </div>
                  </div>
            </Link>
      )
}

export default ProductBestSellerItem
