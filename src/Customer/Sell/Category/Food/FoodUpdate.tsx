import React, { useEffect } from 'react'
import { TProductDetail } from '../../../../types/product/product.type'
import ProductFormUpdate from '../../UpdateProductForm/ProductUpdate'
import {
      TimelineFoodFieldName,
      TimelineFoodLabel,
      timelineFieldNameFood,
      timelineLabelNameFood,
} from '../../../../types/timeline/timeline.food.type'
import { renderTimeLine } from '../../../../types/timeline/timeline.book.type'
import Food from './Food'
import { ProductFoodForm } from '../../../../types/product/product.food.type'

type TProps = {
      product: TProductDetail
}

const FoodUpdate: React.FC<TProps> = (props: TProps) => {
      const { product } = props
      useEffect(() => {}, [product])

      return (
            <div className='w-[1000px] mx-auto bg-color-section-theme text-text-theme px-[20px] flex justify-center'>
                  <ProductFormUpdate<TimelineFoodFieldName, TimelineFoodLabel>
                        ProductAttribute={<Food />}
                        product_id={product._id}
                        mode='UPDATE'
                        TimelineProps={renderTimeLine({
                              defaultFieldName: timelineFieldNameFood,
                              defaultLabelName: timelineLabelNameFood,
                        })}
                        product={product as TProductDetail}
                        defaultValues={product as unknown as ProductFoodForm}
                        public_id={product.product_thumb_image.public_id}
                        public_id_array={product.product_desc_image}
                        ProductType='Food'
                        endPointUrl='/v1/api/product/upload-product-food'
                  />
            </div>
      )
}

export default FoodUpdate
