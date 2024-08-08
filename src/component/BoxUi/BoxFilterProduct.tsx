import { useMutation } from '@tanstack/react-query'
import { X } from 'lucide-react'
import React, { SetStateAction, useState } from 'react'
import { useDispatch } from 'react-redux'
import ProductApi from '../../apis/product.api'
import FilterProductPrice from '../../pages/ProductCategories/Components/FilterProductPrice'
import FilterProductVote from '../../pages/ProductCategories/Components/FilterProductVote'
import { fetchProduct } from '../../Redux/category.slice'
import { ProductType } from '../../types/product/product.type'
import BoxLoading from './BoxLoading'

export const MAX_PRICE = 1000000000
type TProps = {
      product_type: ProductType
      onClose: React.Dispatch<SetStateAction<boolean>>
}

export type ProductFilter = { product_vote: number; minPrice: number; maxPrice: number; product_type: ProductType; page: number }

const BoxFilterProduct = (props: TProps) => {
      const { product_type, onClose } = props
      const dispatch = useDispatch()

      const [filter, setFilter] = useState<{ onVote: number; minPrice: number; maxPrice: number }>({
            onVote: 1,
            minPrice: 1,
            maxPrice: MAX_PRICE,
      })

      const getProductFilter = useMutation({
            mutationKey: ['product-filter'],
            mutationFn: (params: ProductFilter) => ProductApi.getProductFilter({ params }),
            onSuccess: (axiosResponse) => {
                  const { products } = axiosResponse.data.metadata
                  dispatch(fetchProduct({ products }))
                  onClose(false)
                  setFilter({ onVote: 1, minPrice: 1, maxPrice: MAX_PRICE })
            },
      })

      const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            const payload: ProductFilter = {
                  product_vote: filter.onVote || 1,
                  minPrice: filter.minPrice || 1,
                  maxPrice: filter.maxPrice || MAX_PRICE,
                  product_type: product_type,
                  page: 1,
            }

            getProductFilter.mutate(payload)
      }

      return (
            <div className='fixed inset-0 bg-[rgba(0,0,0,.4)] h-screen flex items-center justify-center z-[500]'>
                  <form className='mx-[12px] xl:mx-0 w-[550px] h-[540px] xl:h-[700px] px-[20px] bg-[#ffffff] rounded flex flex-col' onSubmit={onSubmit}>
                        <header className='relative w-full h-[8%] flex items-center justify-center border-b-[1px] border-gray-200  '>
                              <h3 className='text-[18px] text-slate-800 font-extrabold'>Tất cả bộ lọc</h3>
                              <X
                                    className='absolute top-[50%] translate-y-[-50%] right-[20px] hover:cursor-pointer'
                                    onClick={() => onClose(false)}
                              />
                        </header>
                        <div className='flex-1 w-full scroll-common  overflow-y-scroll'>
                              <div className='w-full h-max flex '>
                                    <FilterProductVote setVote={setFilter} />
                              </div>
                              <div className='w-full h-[1px] bg-gray-200 my-[16px]'></div>

                              <div className='w-full h-max flex '>
                                    <FilterProductPrice setPrice={setFilter} parentController={filter} />
                              </div>
                        </div>
                        <footer className='w-full h-[12%] flex items-center justify-between'>
                              <button className='min-w-[100px] h-[60%] p-[8px_6px] border-[1px] border-gray-200 rounded'>Xóa tất cả</button>
                              <button
                                    className='min-w-[150px] w-max h-[60%] p-[8px_6px] border-[1px] border-gray-200 bg-blue-500 text-white rounded flex items-center gap-[6px] justify-center'
                                    type='submit'
                              >
                                    <span>Xem kết quả</span>
                                    {getProductFilter.isPending && <BoxLoading />}
                              </button>
                        </footer>
                  </form>
            </div>
      )
}

//un -> def

export default BoxFilterProduct
