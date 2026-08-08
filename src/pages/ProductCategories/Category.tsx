import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import FeaturedCategory from './Components/FeaturedCategory'
import NotFound from '../../component/Errors/NotFound'
import { ProductType } from '../../types/product/product.type'
import ProductSection from './ProductSection'
import FilterWrapper from './Components/FilterWrapper'
import ShopCategory from './ShopCategory'
import CategoryTitle from './Components/CategoryTitle'
import { ChevronRight } from 'lucide-react'

const productBook = ['Sách tiếng Việt', 'Sách tiếng Anh', 'Truyện tranh', 'Tiểu thuyết', 'Ngôn tình', 'Sach giáo khoa']
const productFood = ['Đồ đóng hộp', 'Bia', 'Nước ngọt', 'Bánh kẹo', 'Snacks']

type TProps = {
      product_type: ProductType
}

const onSetTitleProductType = ({ product_type }: { product_type: ProductType }): string[] => {
      switch (product_type) {
            case 'Book':
                  return productBook
            case 'Food':
                  return productFood
            default:
                  return []
      }
}

const onSetHeaderProductType = ({ product_type }: { product_type: ProductType }): string => {
      let header = ''
      switch (product_type) {
            case 'Book':
                  header = 'Nhà sách Tiki'
                  return header
            case 'Food':
                  header = 'Bách hóa Online'
                  return header
            default:
                  return header
      }
}

const Category = (props: TProps) => {
      const { product_type } = props
      const [activeData, setActiveData] = useState(true)
      const [categoryNotFound, setCategoryNotFound] = useState('')

      const onClickCategory = (nameCategory: string) => {
            setCategoryNotFound(nameCategory)
            setActiveData(false)
      }

      const onBack = () => {
            setActiveData(true)
      }

      return (
            <div className='mx-auto mb-[70px] mt-[70px] flex w-full max-w-[1450px] flex-col  px-4 text-[14px] text-text-theme xl:mt-0 xl:px-0'>
                  {/* Breadcrumb */}
                  <div className='flex items-center gap-2 text-sm text-slate-500 py-[16px]'>
                        <Link to='/' className='transition hover:text-blue-500'>
                              Trang chủ
                        </Link>
                        <ChevronRight size={14} />
                        <span className='font-semibold text-text-theme'>
                              {onSetHeaderProductType({ product_type })}
                        </span>
                  </div>

                  <div className='flex w-full items-start gap-4 xl:gap-5'>
                        {/* Left category navigation - keep old component/logic */}
                        <aside className='hidden w-[220px] shrink-0 xl:block'>
                              <div className='sticky top-[90px] overflow-hidden rounded-2xl border border-[var(--border-color-input)] bg-color-section-theme shadow-[0_10px_30px_rgba(0,0,0,0.15)]'>
                                    <div className='border-b border-[var(--border-color-input)] px-4 py-4'>
                                          <h3 className='font-semibold text-text-theme'>Danh mục</h3>
                                    </div>

                                    <CategoryTitle
                                          title={onSetTitleProductType({ product_type })}
                                          onGetNameCategory={onClickCategory}
                                    />
                              </div>
                        </aside>

                        <div className='min-h-[1000px] min-w-0 flex-1'>
                              {activeData ? (
                                    <header className='flex min-h-full w-full flex-col gap-4 overflow-hidden'>
                                          {/* Page title */}
                                          <div className='flex min-h-[64px] w-full items-center rounded-2xl border border-[var(--border-color-input)] bg-color-section-theme px-5 shadow-sm'>
                                                <h1 className='text-[22px] font-semibold tracking-[-0.02em] text-text-theme'>
                                                      {onSetHeaderProductType({ product_type })}
                                                </h1>
                                          </div>

                                          <FeaturedCategory type={product_type} />

                                          <div className='w-full overflow-hidden rounded-2xl border border-[var(--border-color-input)] bg-color-section-theme'>
                                                <ShopCategory product_type={product_type} />
                                          </div>

                                          <div className='w-full rounded-2xl border border-[var(--border-color-input)] bg-color-section-theme px-3 py-3'>
                                                <FilterWrapper product_type={product_type} />
                                          </div>

                                          <div className='w-full'>
                                                <ProductSection product_type={product_type} />
                                          </div>
                                    </header>
                              ) : (
                                    <div className='h-[500px] min-w-full w-full'>
                                          <NotFound
                                                ContentHeader={`Danh mục ${categoryNotFound} chưa được xây dựng`}
                                                countTime={false}
                                                onBack={onBack}
                                          />
                                    </div>
                              )}
                        </div>
                  </div>
            </div>
      )
}

export default Category