import React, { useEffect } from 'react'
import { TProductDetail } from '../../../../types/product/product.type'
import {
      TTimeLineBookField,
      TTimeLineBookLabel,
      renderTimeLine,
      timelineFieldNameBook,
      timelineLabelNameBook,
} from '../../../../types/timeline/timeline.book.type'
import Book from './Book'
import { TRegisterFormBook } from '../../../../types/product/product.book.type'
import ProductFormUpdate from '../../UpdateProductForm/ProductUpdate'

export type TProps = {
      product: TProductDetail
}

const BookUpdate: React.FC<TProps> = (props: TProps) => {
      const { product } = props

      useEffect(() => {}, [product])

      return (
            <div className=' mx-auto bg-color-section-theme text-text-theme px-[20px] flex justify-center'>
                  <ProductFormUpdate<TTimeLineBookField, TTimeLineBookLabel>
                        ProductAttribute={<Book mode='UPDATE' />}
                        product_id={product._id}
                        mode='UPDATE'
                        TimelineProps={renderTimeLine({
                              defaultFieldName: timelineFieldNameBook,
                              defaultLabelName: timelineLabelNameBook,
                        })}
                        product={product as TProductDetail}
                        defaultValues={product as unknown as TRegisterFormBook}
                        public_id={product.product_thumb_image.public_id}
                        public_id_array={product.product_desc_image}
                        ProductType='Book'
                        endPointUrl='/v1/api/product/upload-product-book'
                  />
            </div>
      )
}

export default BookUpdate
// import React from 'react'

// const BookUpdate = () => {
//       return <div>BookUpdate</div>
// }

// export default BookUpdate
