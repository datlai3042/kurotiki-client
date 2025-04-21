import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { Select } from 'antd'
// import FormRegisterFood from './RegisterProductForm/FormRegisterFood'
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
import * as z from 'zod'
import { ProductFoodForm } from '../../types/product/product.food.type'
import {
      TimelineFoodFieldName,
      TimelineFoodLabel,
      timelineFieldNameFood,
      timelineLabelNameFood,
} from '../../types/timeline/timeline.food.type'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import image from './logistic.jpg'
// const version2 = t

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

// const a: keyof TTimeLineBook =

const RegisterSell = () => {
      const user = useSelector((state: RootState) => state.authentication.user) as UserResponse
      const [productType, setProductType] = useState<'Book' | 'Food'>()
      const [openSelect, setOpenSelect] = useState<boolean>(false)

      const createBaseProductId = useMutation({
            mutationKey: ['create-base-product-id'],
            mutationFn: () => ProductApi.createBaseProductId(),
      })

      if (!user.isOpenShop) {
            return (
                  <div className='w-full h-[500px] bg-color-section-theme text-text-theme rounded-lg flex flex-col gap-[12px] items-center justify-center text-[20px] font-semibold'>
                        <span>Chức năng chỉ dành cho các tài khoản đã đăng kí shop</span>
                        <Link
                              className='w-[150px] h-[40px] flex items-center justify-center  border-[1px] border-[var(--border-color-input)] rounded bg-color-main opacity-80 hover:opacity-100 text-[#fff] hover:border-transparent transition-none duration-300 text-[15px]'
                              to={'/customer/shop'}
                        >
                              Đăng kí shop
                        </Link>
                  </div>
            )
      }
      return (
            <div className='min-w-full flex-1  h-auto  flex flex-col items-center justify-center p-[20px] '>
                  {!openSelect && (
                        <div className='bg-color-section-theme py-[20px] flex justify-center items-center w-full'>
                              <button
                                    className='  min-w-[180px] px-[16px] w-max h-[40px] bg-color-main text-[#fff]    flex gap-[6px] items-center justify-center rounded-[4px]'
                                    onClick={() => setOpenSelect(true)}
                              >
                                    <Plus />
                                    <span>Đăng sản phẩm</span>
                              </button>
                        </div>
                  )}
                  {!openSelect && (
                        <div className='h-[300px] w-full mt-[20px] '>
                              <img src={image} className='min-w-full w-full max-h-full object-cover' />
                        </div>
                  )}
                  {openSelect && (
                        <div className='w-full h-full flex flex-col bg-color-section-theme py-[20px]'>
                              <div className='w-full h-[50px] flex px-[20px]'>
                                    <Select
                                          className='w-[150px] '
                                          placeholder='Loại sản phẩm'
                                          options={[
                                                { value: 'Book', label: 'Sách' },
                                                { value: 'Food', label: 'Đồ ăn' },
                                          ]}
                                          onChange={(type: 'Book' | 'Food') => {
                                                setProductType(type)
                                                createBaseProductId.mutate()
                                          }}
                                    />
                              </div>
                              {!createBaseProductId.isSuccess && (
                                    <div className='h-[300px] w-full mt-[20px] '>
                                          <img src={image} className='min-w-full w-full max-h-full object-cover' />
                                    </div>
                              )}
                              {createBaseProductId.isSuccess && (
                                    <div className='w-full h-max px-[20px]'>
                                          {productType === 'Book' && (
                                                <ProductFormUpload<TTimeLineBookField, TTimeLineBookLabel>
                                                      ProductType={'Book'}
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
                                                <>
                                                      <ProductFormUpload<TimelineFoodFieldName, TimelineFoodLabel>
                                                            ProductType={'Food'}
                                                            ProductAttribute={<Food />}
                                                            product_id={createBaseProductId.data.data.metadata.product_id}
                                                            TimelineProps={renderTimeLine({
                                                                  defaultFieldName: timelineFieldNameFood,
                                                                  defaultLabelName: timelineLabelNameFood,
                                                            })}
                                                            endpointUrl='v1/api/product/upload-product-food'
                                                            defaultValues={defaultValuesFood}
                                                      />
                                                </>
                                          )}
                                    </div>
                              )}

                              {createBaseProductId.isPending && <ProductFormSkeleton />}
                        </div>
                  )}
            </div>
      )
}

export default RegisterSell
