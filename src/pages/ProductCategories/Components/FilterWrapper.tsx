import { Filter } from 'lucide-react'
import React, { useState } from 'react'
import BoxFilterProduct from '../../../component/BoxUi/BoxFilterProduct'
import { ProductType } from '../../../types/product/product.type'

type TProps = {
      product_type: ProductType
}

const FilterWrapper = (props: TProps) => {
      const { product_type } = props
      const [openFilter, setOpenFilter] = useState(false)

      return (
            <div className='flex h-full w-full items-center'>
                  <button
                        className='flex h-10 min-w-[150px] items-center justify-center gap-2 rounded-xl border border-[var(--border-color-input)] bg-color-section-theme px-4 text-sm font-medium text-text-theme transition hover:border-blue-500 hover:text-blue-400'
                        onClick={() => setOpenFilter(true)}
                  >
                        <Filter size={17} />
                        <span>Lọc sản phẩm</span>
                  </button>

                  {openFilter && (
                        <BoxFilterProduct
                              product_type={product_type}
                              onClose={setOpenFilter}
                        />
                  )}
            </div>
      )
}

export default FilterWrapper