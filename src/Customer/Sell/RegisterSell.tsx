import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { useMutation } from '@tanstack/react-query'
import ProductApi from '../../apis/product.api'
import Book from './Category/Book/Book'
import {
      TTimeLineBookField,
      TTimeLineBookLabel,
      renderTimeLine,
      timelineFieldNameBook,
      timelineLabelNameBook,
} from '../../types/timeline/timeline.book.type'
import { TRegisterFormBook } from '../../types/product/product.book.type'
import ProductFormSkeleton from './RegisterProductForm/components/ProductFormSkeleton'
import { UserResponse } from '../../types/user.type'
import ProductFormUpload from './RegisterProductForm/ProductFormUpload'
import Food from './Category/Food/Food'
import { ProductFoodForm } from '../../types/product/product.food.type'
import {
      TimelineFoodFieldName,
      TimelineFoodLabel,
      timelineFieldNameFood,
      timelineLabelNameFood,
} from '../../types/timeline/timeline.food.type'
import { Link } from 'react-router-dom'
import { BookOpen, Check, ChevronLeft, ChevronRight, Plus, ShoppingBasket } from 'lucide-react'

const defaultValuesForm: TRegisterFormBook = {
      product_id: '',
      product_name: '',
      product_price: null,
      product_available: 0,
      attribute: {
            publishing: '',
            page_number: 0,
            author: '',
            description: '',
            type: 'Novel',
      },
}

const defaultValuesFood: ProductFoodForm = {
      product_id: '',
      product_name: '',
      product_price: null,
      product_available: 0,
      attribute: {
            product_food_Manufacturers_Name: '',
            product_food_origin: '',
            description: '',
            product_food_unit: 'Kilogram',
            type: 'Canned Goods',
      },
}

type ProductType = 'Book' | 'Food'

const productTypes: {
      value: ProductType
      title: string
      description: string
      icon: React.ReactNode
}[] = [
      {
            value: 'Book',
            title: 'Sách',
            description: 'Sách giấy, truyện, giáo trình và các ấn phẩm',
            icon: <BookOpen size={22} strokeWidth={1.8} />,
      },
      {
            value: 'Food',
            title: 'Đồ ăn',
            description: 'Thực phẩm, đồ uống và các sản phẩm tiêu dùng',
            icon: <ShoppingBasket size={22} strokeWidth={1.8} />,
      },
]

const RegisterSell = () => {
      const user = useSelector((state: RootState) => state.authentication.user) as UserResponse

      const [productType, setProductType] = useState<ProductType>()
      const [openSelect, setOpenSelect] = useState(false)

      const createBaseProductId = useMutation({
            mutationKey: ['create-base-product-id'],
            mutationFn: () => ProductApi.createBaseProductId(),
      })

      const handleSelectProductType = (type: ProductType) => {
            if (productType === type && createBaseProductId.isSuccess) return

            setProductType(type)
            createBaseProductId.mutate()
      }

      const handleBack = () => {
            setOpenSelect(false)
            setProductType(undefined)
            createBaseProductId.reset()
      }

      if (!user.isOpenShop) {
            return (
                  <div className='flex h-[500px] w-full flex-col items-center justify-center gap-[12px] rounded-lg bg-color-section-theme text-center text-[20px] font-semibold text-text-theme'>
                        <span>Chức năng chỉ dành cho các tài khoản đã đăng kí shop</span>

                        <Link
                              className='flex h-[40px] w-[150px] items-center justify-center rounded border border-[var(--border-color-input)] bg-color-main text-[15px] text-white opacity-80 transition-opacity hover:border-transparent hover:opacity-100'
                              to='/customer/shop'
                        >
                              Đăng kí shop
                        </Link>
                  </div>
            )
      }

      return (
            <div className='flex h-auto min-w-full flex-1 flex-col items-center text-[13px]'>
                  {!openSelect && (
                        <button
                              onClick={() => setOpenSelect(true)}
                              type='button'
                              className='group flex w-full items-center justify-between rounded-xl border border-blue-500/30 bg-gradient-to-r from-blue-500/[0.07] to-blue-500/[0.02] px-4 py-3 text-left transition hover:border-blue-500/60 hover:from-blue-500/[0.12] hover:to-blue-500/[0.05]'
                        >
                              <div className='flex items-center gap-3'>
                                    <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-white shadow-sm'>
                                          <Plus size={18} />
                                    </div>

                                    <div>
                                          <p className='text-sm font-semibold text-text-theme'>Đăng sản phẩm mới</p>
                                          <p className='mt-0.5 text-[11px] text-slate-500'>Tạo sản phẩm mới và bắt đầu bán hàng</p>
                                    </div>
                              </div>

                              <ChevronRight size={18} className='text-blue-500 transition group-hover:translate-x-1' />
                        </button>
                  )}

                  {openSelect && (
                        <div className='w-full overflow-hidden rounded-2xl border border-[var(--border-color-input)] bg-color-section-theme'>
                              {/* Header */}
                              <div className='flex items-center justify-between border-b border-[var(--border-color-input)] px-4 py-4 sm:px-5'>
                                    <div className='flex min-w-0 items-center gap-3'>
                                          <button
                                                type='button'
                                                onClick={handleBack}
                                                className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--border-color-input)] text-slate-500 transition hover:border-blue-500/40 hover:bg-blue-500/5 hover:text-blue-500'
                                                aria-label='Quay lại'
                                          >
                                                <ChevronLeft size={18} />
                                          </button>

                                          <div className='min-w-0'>
                                                <h3 className='text-[15px] font-semibold text-text-theme sm:text-base'>
                                                      Chọn loại sản phẩm
                                                </h3>

                                                <p className='mt-1 text-[11px] text-slate-500 sm:text-xs'>
                                                      Chọn nhóm sản phẩm trước khi bắt đầu nhập thông tin đăng bán
                                                </p>
                                          </div>
                                    </div>
                              </div>

                              {/* Category selector */}
                              <div className='p-4 sm:p-5'>
                                    <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                                          {productTypes.map((item) => {
                                                const isActive = productType === item.value

                                                return (
                                                      <button
                                                            type='button'
                                                            key={item.value}
                                                            disabled={createBaseProductId.isPending}
                                                            onClick={() => handleSelectProductType(item.value)}
                                                            className={`group relative flex min-h-[92px] items-center gap-3 rounded-xl border p-4 text-left transition ${
                                                                  isActive
                                                                        ? 'border-blue-500 bg-blue-500/10 text-blue-500'
                                                                        : 'border-[var(--border-color-input)] text-text-theme hover:border-blue-500/40 hover:bg-blue-500/[0.04]'
                                                            } disabled:cursor-wait disabled:opacity-70`}
                                                      >
                                                            <div
                                                                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition ${
                                                                        isActive
                                                                              ? 'bg-blue-500 text-white'
                                                                              : 'bg-slate-500/10 text-slate-500 group-hover:bg-blue-500/10 group-hover:text-blue-500'
                                                                  }`}
                                                            >
                                                                  {item.icon}
                                                            </div>

                                                            <div className='min-w-0 flex-1'>
                                                                  <p className='text-sm font-semibold'>{item.title}</p>

                                                                  <p
                                                                        className={`mt-1 text-[11px] leading-5 ${
                                                                              isActive ? 'text-blue-500/80' : 'text-slate-500'
                                                                        }`}
                                                                  >
                                                                        {item.description}
                                                                  </p>
                                                            </div>

                                                            {isActive && (
                                                                  <div className='absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white'>
                                                                        <Check size={14} strokeWidth={2.2} />
                                                                  </div>
                                                            )}
                                                      </button>
                                                )
                                          })}
                                    </div>

                                    {!productType && !createBaseProductId.isPending && (
                                          <div className='mt-4 rounded-xl border border-dashed border-[var(--border-color-input)] bg-slate-500/[0.02] px-4 py-3 text-center'>
                                                <p className='text-[11px] text-slate-500'>Chọn một loại sản phẩm để mở biểu mẫu đăng bán</p>
                                          </div>
                                    )}
                              </div>

                              {/* Form */}
                              {createBaseProductId.isPending && (
                                    <div className='border-t border-[var(--border-color-input)] p-4 sm:p-5'>
                                          <ProductFormSkeleton />
                                    </div>
                              )}

                              {createBaseProductId.isSuccess && productType && (
                                    <div className='border-t border-[var(--border-color-input)]'>
                                          <div className='border-b border-[var(--border-color-input)] px-4 py-3 sm:px-5'>
                                                <div className='flex items-center gap-3'>
                                                      <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500'>
                                                            {productType === 'Book' ? <BookOpen size={19} /> : <ShoppingBasket size={19} />}
                                                      </div>

                                                      <div>
                                                            <p className='text-[13px] font-semibold text-text-theme'>
                                                                  Thông tin sản phẩm {productType === 'Book' ? 'sách' : 'đồ ăn'}
                                                            </p>

                                                            <p className='mt-0.5 text-[10px] text-slate-500'>
                                                                  Điền đầy đủ thông tin bên dưới để đăng bán
                                                            </p>
                                                      </div>
                                                </div>
                                          </div>

                                          <div className='w-full'>
                                                {productType === 'Book' && (
                                                      <ProductFormUpload<TTimeLineBookField, TTimeLineBookLabel>
                                                            ProductType='Book'
                                                            ProductAttribute={<Book mode='UPLOAD' />}
                                                            product_id={createBaseProductId.data.data.metadata.product_id}
                                                            TimelineProps={renderTimeLine({
                                                                  defaultFieldName: timelineFieldNameBook,
                                                                  defaultLabelName: timelineLabelNameBook,
                                                            })}
                                                            endpointUrl='v1/api/product/upload-product-book'
                                                            defaultValues={defaultValuesForm}
                                                      />
                                                )}

                                                {productType === 'Food' && (
                                                      <ProductFormUpload<TimelineFoodFieldName, TimelineFoodLabel>
                                                            ProductType='Food'
                                                            ProductAttribute={<Food />}
                                                            product_id={createBaseProductId.data.data.metadata.product_id}
                                                            TimelineProps={renderTimeLine({
                                                                  defaultFieldName: timelineFieldNameFood,
                                                                  defaultLabelName: timelineLabelNameFood,
                                                            })}
                                                            endpointUrl='v1/api/product/upload-product-food'
                                                            defaultValues={defaultValuesFood}
                                                      />
                                                )}
                                          </div>
                                    </div>
                              )}
                        </div>
                  )}
            </div>
      )
}

export default RegisterSell
