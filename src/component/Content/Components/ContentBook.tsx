import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import ProductApi from '../../../apis/product.api'
import { TProductDetail, TypeBook } from '../../../types/product/product.type'
import LayoutTranslate from './LayoutTranslate'
import ProductLoading from './ProductLoading'

export const CATEGORY_BOOK = [
      {
            label: 'Tất cả sản phẩm',
            value: 'All',
      },

      {
            label: 'Manga',
            value: 'Manga',
      },
      {
            label: 'Tiểu thuyết',
            value: 'Novel',
      },

      {
            label: 'Trinh thám',
            value: 'Detective',
      },
]

export type TypeFilterBook = 'All' | TypeBook

const ContentBook = () => {
      const getProductBookAllType = useQuery({
            queryKey: ['/v1/api/product/get-product-book-all-type'],
            queryFn: () => ProductApi.getProductBookAllType(),
      })

      const [type, setType] = useState<TypeFilterBook>('All')

      const productAll = getProductBookAllType.data?.data.metadata.products
      const productManga = getProductBookAllType.data?.data.metadata.manga
      const productNovel = getProductBookAllType.data?.data.metadata.novel
      const productDectective = getProductBookAllType.data?.data.metadata.detective

      const styleEffect = {
            onActive: (isActive: boolean) => {
                  if (isActive) return 'bg-blue-50 border-blue-600 text-blue-600'

                  return 'bg-transparent border-gray-400 text-slate-600'
            },
      }

      // const calcLength = (type: TypeFilterBook) => {
      //       switch (type) {
      //             case 'All':
      //                   return Math.ceil((productAll?.length || 6) / 6)
      //             case 'Manga':
      //                   return Math.ceil((productManga?.length || 6) / 6)
      //             case 'Novel':
      //                   return Math.ceil((productNovel?.length || 6) / 6)
      //             case 'Detective':
      //                   return Math.ceil((productDectective?.length || 6) / 6)
      //             default:
      //                   return 1
      //       }
      // }

      return (
            <div className='max-w-full w-full h-[485px] bg-[#ffffff] rounded-lg p-[20px] flex flex-col gap-[16px]'>
                  <h3>Các sãn phẩm về sách</h3>

                  <div className='overflow-hidden'>
                        <div className='h-[40px] max-w-full flex gap-[20px] overflow-scroll'>
                              {CATEGORY_BOOK.map((btn) => (
                                    <button
                                          key={btn.label}
                                          className={`${styleEffect.onActive(btn.value === type)} min-w-[150px] max-w-full rounded-[999px]`}
                                          onClick={() => setType(btn.value as TypeFilterBook)}
                                    >
                                          {btn.label}
                                    </button>
                              ))}
                        </div>
                  </div>

                  <div className='relative w-full h-[80%] overflow-hidden'>
                        {getProductBookAllType.isSuccess && type === 'All' && <LayoutTranslate products={productAll as TProductDetail[]} />}
                        {getProductBookAllType.isSuccess && type === 'Manga' && (
                              <LayoutTranslate products={productManga as TProductDetail[]} />
                        )}
                        {getProductBookAllType.isSuccess && type === 'Novel' && (
                              <LayoutTranslate products={productNovel as TProductDetail[]} />
                        )}
                        {getProductBookAllType.isSuccess && type === 'Detective' && (
                              <LayoutTranslate products={productDectective as TProductDetail[]} />
                        )}

                        {getProductBookAllType.isPending && (
                              <div
                                    className='gap-[20px] xl:gap-[16px] grid grid-rows-[300px]  grid-flow-col auto-cols-[calc((100%-40px)/2)] sm:auto-cols-[calc((100%-80px)/4)]   xl:auto-cols-[calc((100%-96px)/6)]  h-full overflow-x-scroll xl:overflow-visible 
                   '
                              >
                                    <ProductLoading />
                              </div>
                        )}
                  </div>
                  {getProductBookAllType.isSuccess && !getProductBookAllType.data?.data.metadata && (
                        <div className='w-full h-[80%] flex items-center justify-center text-[20px] font-semibold text-slate-700 bg-[#ffffff] rounded-lg'>
                              Không có thông tin các sản phẩm
                        </div>
                  )}
            </div>
      )
}

export default ContentBook
