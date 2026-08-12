import React, { useState } from 'react'
import { TProductDetail, TypeBook } from '../../../types/product/product.type'
import { useQuery } from '@tanstack/react-query'
import ProductApi from '../../../apis/product.api'
import { BookOpen, Grid2X2, MoreHorizontal, Search, Sparkles } from 'lucide-react'
import LayoutTranslate from './LayoutTranslate'
import BoxResponsiveOverflow, { BoxResponsiveFlowClose } from '../../BoxUi/BoxResponsiveFlow'

export const CATEGORY_BOOK = [
      {
            label: 'Tất cả sản phẩm',
            value: 'All',
            path: 'All',
            id: 'All',
      },
      {
            label: 'Manga',
            value: 'Manga',
            path: 'Manga',
            id: 'Manga',
      },
      {
            label: 'Tiểu thuyết',
            value: 'Novel',
            path: 'Novel',
            id: 'Novel',
      },
      {
            label: 'Trinh thám',
            value: 'Detective',
            path: 'Detective',
            id: 'Detective',
      },
]

export type TypeFilterBook = 'All' | TypeBook

const CATEGORY_ICON = {
      All: Grid2X2,
      Manga: BookOpen,
      Novel: BookOpen,
      Detective: Search,
}

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

      const handleChangeType = (nextType: TypeFilterBook) => {
            setType(nextType)
      }

      const renderProducts = () => {
            if (!getProductBookAllType.isSuccess) return null

            switch (type) {
                  case 'Manga':
                        return <LayoutTranslate products={(productManga || []) as TProductDetail[]} />
                  case 'Novel':
                        return <LayoutTranslate products={(productNovel || []) as TProductDetail[]} />
                  case 'Detective':
                        return <LayoutTranslate products={(productDectective || []) as TProductDetail[]} />
                  default:
                        return <LayoutTranslate products={(productAll || []) as TProductDetail[]} />
            }
      }

      return (
            <section className='w-full max-w-full overflow-hidden rounded-2xl border border-[var(--border-color-input)] bg-color-section-theme text-text-theme shadow-sm'>
                  <div className='px-4 pt-5 sm:px-5 lg:px-6'>
                        <div className='flex flex-wrap items-start justify-between gap-3'>
                              <div>
                                    <div className='flex items-center gap-2'>
                                          <h3 className='text-base font-bold sm:text-lg'>Khám phá nhà sách</h3>
                                          <Sparkles size={17} className='text-blue-500' />
                                    </div>

                                    <p className='mt-1 text-xs text-slate-500 dark:text-slate-400'>
                                          Hàng triệu đầu sách hay đang chờ bạn khám phá
                                    </p>
                              </div>
                        </div>

                        <div className='mt-4'>
                              <BoxResponsiveOverflow
                                    items={CATEGORY_BOOK}
                                    gap={8}
                                    itemClassName='flex-1'
                                    getKey={(category) => category.id}
                                    renderItem={(category) => {
                                          const isActive = type === category.value
                                          const Icon = CATEGORY_ICON[category.value as keyof typeof CATEGORY_ICON]

                                          return (
                                                <button
                                                      key={category.label}
                                                      type='button'
                                                      onClick={() => handleChangeType(category.value as TypeFilterBook)}
                                                      className={`
                                                            flex h-10 w-full items-center justify-center gap-2 rounded-xl border px-3
                                                            text-xs font-semibold transition-all duration-200
                                                            ${
                                                                  isActive
                                                                        ? 'border-blue-500 bg-blue-500 text-white shadow-[0_6px_18px_rgba(59,130,246,0.2)]'
                                                                        : 'border-[var(--border-color-input)] bg-transparent text-text-theme hover:border-blue-500/40 hover:bg-blue-500/[0.05] hover:text-blue-500'
                                                            }
                                                      `}
                                                >
                                                      <Icon size={15} />
                                                      <span className='truncate'>{category.label}</span>
                                                </button>
                                          )
                                    }}
                                    renderMore={({ open }: any) => (
                                          <button
                                                type='button'
                                                onClick={open}
                                                className='flex h-10 w-[52px] items-center justify-center rounded-xl border border-dashed border-blue-400 bg-blue-50 text-blue-500 transition hover:bg-blue-100 dark:border-blue-500/50 dark:bg-blue-500/10'
                                          >
                                                <MoreHorizontal size={18} />
                                          </button>
                                    )}
                                    renderExpanded={({ items, close }: any) => (
                                          <BoxResponsiveFlowClose
                                                open
                                                onClose={close}
                                                title={
                                                      <div>
                                                            <h3 className='text-base font-bold dark:text-white'>Thể loại sách</h3>
                                                            <p className='mt-0.5 text-xs text-slate-500'>Chọn thể loại bạn muốn khám phá</p>
                                                      </div>
                                                }
                                          >
                                                <div className='grid grid-cols-2 gap-3'>
                                                      {items.map((category: (typeof CATEGORY_BOOK)[0]) => {
                                                            const isActive = category.value === type
                                                            const Icon = CATEGORY_ICON[category.value as keyof typeof CATEGORY_ICON]

                                                            return (
                                                                  <button
                                                                        key={category.label}
                                                                        type='button'
                                                                        onClick={() => {
                                                                              handleChangeType(category.value as TypeFilterBook)
                                                                              close()
                                                                        }}
                                                                        className={`
                                                                              flex h-11 items-center justify-center gap-2 rounded-xl border px-3
                                                                              text-xs font-semibold transition
                                                                              ${
                                                                                    isActive
                                                                                          ? 'border-blue-500 bg-blue-500 text-white'
                                                                                          : 'border-[var(--border-color-input)] text-text-theme hover:border-blue-500/40 hover:bg-blue-500/[0.05]'
                                                                              }
                                                                        `}
                                                                  >
                                                                        <Icon size={15} />
                                                                        {category.label}
                                                                  </button>
                                                            )
                                                      })}
                                                </div>
                                          </BoxResponsiveFlowClose>
                                    )}
                              />
                        </div>
                  </div>

                  <div className='relative mt-4 h-[360px] w-full overflow-hidden px-4 pb-4 sm:h-[380px] sm:px-5 lg:px-6'>
                        {renderProducts()}

                        {getProductBookAllType.isPending && (
                              <div className='flex h-full gap-3'>
                                    {Array(COUNT_SKELETON)
                                          .fill(0)
                                          .map((_, index) => (
                                                <div
                                                      key={index}
                                                      className='h-full min-w-[170px] flex-1 animate-pulse rounded-2xl border border-[var(--border-color-input)] bg-slate-200/70 dark:bg-slate-700/50'
                                                />
                                          ))}
                              </div>
                        )}

                        {getProductBookAllType.isSuccess && !getProductBookAllType.data?.data.metadata && (
                              <div className='flex h-full w-full items-center justify-center rounded-xl text-base font-semibold text-slate-500'>
                                    Không có thông tin các sản phẩm
                              </div>
                        )}
                  </div>
            </section>
      )
}

export default ContentBook