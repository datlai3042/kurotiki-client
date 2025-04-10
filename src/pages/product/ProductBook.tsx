import React from 'react'
import { IProductBook, ProductAttributeObject } from '../../types/product/product.type'
import { TTimeLineBookLabel } from '../../types/timeline/timeline.book.type'

type TProps = {
      product_attribute: Omit<IProductBook, 'product_id' | 'description'>
}

const book_label: Array<keyof TTimeLineBookLabel> = ['Nhà xuất bản', 'Tác giả', 'Thể loại của sách', 'Số trang']

const ProductBook = (props: TProps) => {
      const { product_attribute } = props

      const { author, type, page_number, publishing } = product_attribute

      const attribute = {
            publishing,
            author,
            type,
            page_number,
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
                                    <span className='min-w-[50%]'>{book_label[index]}</span>
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

export default ProductBook
