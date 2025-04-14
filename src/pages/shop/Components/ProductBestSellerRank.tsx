import React from 'react'
import { TProductDetail } from '../../../types/product/product.type'
import ProductBestSellerItem from './ProductBestSellerItem'

type TProps = {
      products: TProductDetail[]
}

const ProductBestSellerRank = (props: TProps) => {
      const { products } = props

      return (
            <div className='min-h-[240px] h-max p-[20px_16px] flex flex-col gap-[10px] bg-color-section-theme text-text-theme w-max xl:w-full rounded-lg'>
                  <h3 className='text-[18px] font-semibold '>Bán chạy nhất</h3>
                  <div className='grid grid-cols-[300px] xl:grid-cols-3  grid-flow-col xl:grid-flow-row  auto-cols-[300px] xl:auto-rows-[180px] xl:gap-[40px]  w-full gap-[20px] flex-grow'>
                        {products.map((product, index) => (
                              <ProductBestSellerItem product={product} rank={index + 1 <= 3 ? index + 1 : 999} key={product._id} />
                        ))}
                  </div>
            </div>
      )
}

export default ProductBestSellerRank
