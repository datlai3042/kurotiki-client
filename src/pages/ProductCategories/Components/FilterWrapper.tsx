import { Filter } from 'lucide-react'
import React, { useState } from 'react'
import BoxFilterProduct from '../../../component/BoxUi/BoxFilterProduct'
import { ProductType } from '../../../types/product/product.type'

type TProps = {
      product_type: ProductType
}

const FilterWrapper = (props: TProps) => {
      const { product_type } = props
      const [openFilter, setOpenFilter] = useState<boolean>(false)

      return (
            <div className='w-full h-full flex items-center'>
                  <button
                        className='xl:ml-[32px] min-w-[100px] w-max flex items-center justify-center gap-[4px] h-[40px] bg-color-section-theme text-text-theme rounded-[999px] px-[32px] border-[1px] border-[var(--border-color-input)]'
                        onClick={() => setOpenFilter(true)}
                  >
                        <Filter />
                        <span>Lọc sản phẩm</span>
                  </button>

                  {openFilter && <BoxFilterProduct product_type={product_type} onClose={setOpenFilter} />}
            </div>
      )
}

export default FilterWrapper
