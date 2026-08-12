import React from 'react'
import { TProductDetail } from '../../../types/product/product.type'
import { Rate } from 'antd'
import { Link } from 'react-router-dom'
import { Star, StarIcon } from 'lucide-react'

type TProps = {
      product: TProductDetail
}

const ProductItemMini = (props: TProps) => {
      const { product } = props

      return (
            <Link
                  to={`/product/${product._id}`}
                  className=' w-full max-h-full h-full px-1  flex flex-col gap-[10px] border-[1px] border-[var(--border-color-input)]  rounded-lg py-[10px] hover:shadow-lg'
            >
                  <div className='w-full h-[65%] p-2'>
                        <img src={product.product_thumb_image?.secure_url} className='w-full h-full object-contain  rounded-t-lg' alt='' />
                  </div>
                  <div className='px-[6px]  flex-1 flex flex-col gap-[10px]  justify-between text-[8px]'>
                        <div className='min-h-[20px] h-max w-full'>
                              <span className='w-full break-words   line-clamp-2 text-[12px] '>{product.product_name}</span>
                        </div>
                        <p className='text-[14px] opacity-80 leading-3 mt-[2px]'>
                              {product.product_is_bought > 1000 ? 'Đã bán 1000+' : `Đã bán ${product.product_is_bought}` || ''}
                        </p>
                        <div className='flex justify-between items-center'>
                              <p className=' break-words line-clamp-2 text-[14px] font-medium'>
                                    <span>
                                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                                                product.product_price,
                                          )}
                                    </span>
                              </p>
                              <div className='text-yellow-500 flex items-center font-semibold gap-[3px]'>
                                    <span className='text-[14px]'>{product.product_votes}</span>
                                    <Rate defaultValue={1} count={1} className='text-[14px] mt-[-2px]' />
                              </div>
                        </div>
                  </div>
            </Link>
      )
}
// ;<Rate disabled allowHalf defaultValue={product.product_votes} className='text-[11px]' />

export default ProductItemMini
