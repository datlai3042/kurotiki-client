import React, { ReactNode, useRef, useState } from 'react'
import { ProductType, TProductDetail, TypeBook } from '../../../types/product/product.type'
import { useQuery } from '@tanstack/react-query'
import ProductApi from '../../../apis/product.api'
import ProductSmall from './ProductSmall'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import LayoutTranslate from './LayoutTranslate'

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
      const COUNT_SKELETON = window.innerWidth >= 1024 ? 6 : 3

      const styleEffect = {
            onActive: (isActive: boolean) => {
                  if (isActive) return 'bg-blue-50 border-blue-600 text-blue-600'

                  return 'bg-transparent border-gray-400 text-slate-600'
            },
      }

      const calcLength = (type: TypeFilterBook) => {
            switch (type) {
                  case 'All':
                        return Math.ceil((productAll?.length || 6) / 6)
                  case 'Manga':
                        return Math.ceil((productManga?.length || 6) / 6)
                  case 'Novel':
                        return Math.ceil((productNovel?.length || 6) / 6)
                  case 'Detective':
                        return Math.ceil((productDectective?.length || 6) / 6)
                  default:
                        return 1
            }
      }

      return (
            <div className='max-w-full w-full h-[485px] bg-color-section-theme text-text-theme rounded-lg p-[20px] flex flex-col gap-[16px]'>
                  <h3>Các sản phẩm về sách</h3>

                  <div className='overflow-hidden'>
                        <div className='h-[40px] max-w-full flex gap-[20px]  overflow-auto md:overflow-hidden'>
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

                  <div className='relative w-full h-[85%] overflow-hidden'>
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
                              <>
                                    {Array(COUNT_SKELETON)
                                          .fill(0)
                                          ?.map((_, index) => (
                                                <div className='animate-pulse w-full h-full rounded-lg bg-slate-400' key={index}></div>
                                          ))}
                              </>
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
