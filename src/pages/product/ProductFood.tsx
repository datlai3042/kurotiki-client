import React from 'react'
import { IProductFood } from '../../types/product/product.food.type'
import { ProductAttributeObject } from '../../types/product/product.type'

type TProps = {
      product_attribute: IProductFood
}

const food_label = ['Xưởng sản xuất', 'Xuất xứ', 'Loại thực phẩm', 'Khối lượng']

const ProductFood = (props: TProps) => {
      const { product_attribute } = props

      const { product_food_Manufacturers_Name, product_food_origin, product_food_unit, type } = product_attribute

      const attribute = {
            product_food_Manufacturers_Name,
            product_food_origin,
            product_food_unit,
            type,
      }

      return (
            <div className='w-full py-[16px] text-[14px] text-slate-500 flex flex-col gap-[8px] xl:gap-[16px] '>
                  {Object.keys(attribute).map((attri, index) => {
                        if (attri === 'product_id' || attri === 'description') {
                              return null
                        }
                        return (
                              <div
                                    className=' w-full flex flex-wrap items-center  gap-[8px] pb-[6px] border-b-[1px] border-[var(--border-color-input)] last:border-transparent'
                                    key={attri + index}
                              >
                                    <span className='min-w-[50%]'>{food_label[index]}</span>
                                    <span>
                                          {(product_attribute as unknown as ProductAttributeObject)[attri] ||
                                                'Không có thông tin về sản phẩm'}
                                    </span>
                              </div>
                        )
                  })}
            </div>
      )
}

export default ProductFood
