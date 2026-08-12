import React, { useEffect, useState } from 'react'

//@icon
import { Boxes, ImageIcon, PackageOpen, Send } from 'lucide-react'

//@api
import ProductApi, { ProductData } from '../../../apis/product.api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

//@form
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import * as z from 'zod'

//@components
import InputText from '../components/InputText'
import ButtonUpload from './components/ButtonUpload'
import InputNumber from '../components/InputNumber'
import { useDispatch } from 'react-redux'
import { addToast } from '../../../Redux/toast'
import { productBookSchema, productFoodSchema, productSchema } from '../types/product.schema'
import { ProductForm, ProductType, TCheckDescriptionImage, TProductDetail, TProfileImage } from '../../../types/product/product.type'
import UpdateMultipleImage from '../UpdateProductForm/components/UpdateMultipleImage'
import { Link, useNavigate } from 'react-router-dom'
import { sleep } from '../../../utils/sleep'
import ProductReivew from '../UpdateProductForm/components/ProductReivew'

//@Props - Product::Book

//@type form chính

//@schema chính
const ProductBookFormSchema = productSchema.merge(productBookSchema)
const ProductFoodFormSchema = productSchema.merge(productFoodSchema)
type SchemaProduct = typeof ProductBookFormSchema | typeof ProductFoodFormSchema
// type SchemaProduct = z.infer<typeof schema>

export const ui = {
      gapElementChild: 'gap-[6px]',
      gapElementChildButton: 'gap-[16px]',
      fontSizeError: 'text-[14px]',
      colorError: 'text-red-700',
}
type TProps<TimelineFieldName, TimelineLabel> = {
      mode?: 'UPLOAD' | 'UPDATE'
      product_id: string
      ProductType: ProductType
      ProductAttribute: React.ReactNode

      TimelineProps: {
            FieldName: keyof TimelineFieldName
            label: keyof TimelineLabel
      }[]
      defaultValues: ProductForm
      product?: TProductDetail
      public_id?: string
      public_id_array?: { secure_url: string; public_id: string }[]
      endpointUrl: string
}

//@Component
const ProductFormUpload = <TimelineFieldName, TimelineLabel>(props: TProps<TimelineFieldName, TimelineLabel>) => {
      const { product_id, ProductAttribute, TimelineProps, mode = 'UPLOAD', defaultValues, endpointUrl, ProductType } = props

      //@trang thái submit
      const [, setFormStateSubmit] = useState(false)
      const dispatch = useDispatch()
      const navigate = useNavigate()
      const queryClient = useQueryClient()
      let schema
      if (ProductType === 'Book') {
            schema = productSchema.merge(productBookSchema)
      } else {
            schema = productSchema.merge(productFoodSchema)
      }
      //@lấy thông tin hình ảnh
      const [urlProductThumb, setUrlProductThumb] = useState<TProfileImage>({
            isUploadImage: false,
            FileName: '',
            FileLength: 0,
            info: {
                  secure_url: '',
                  public_id: '',
            },
      })

      //@lấy thông tin các hình
      const [urlProductMultipleImage, setUrlProductMultipleImage] = useState<TCheckDescriptionImage>({
            numberImage: 0,
            isUploadImage: false,
            info: [],
      })

      const [expandTimeLine, setExpandTimeLine] = useState(true)

      //@lấy thông tin tên các hình
      const [getFileName, setGetFileName] = useState<string[]>([])
      //@useForm
      const methods = useForm<typeof defaultValues>({
            defaultValues: defaultValues,
            resolver: zodResolver(schema),
      })

      //@hàm upload sản phẩn
      const uploadProductFull = useMutation({
            mutationKey: ['upload-product-full'],
            mutationFn: (data: ProductData) => ProductApi.uploadProductFull(data, endpointUrl),
      })
      //@hàm submit sản phẩm
      const onSubmit = (data: typeof defaultValues) => {
            setFormStateSubmit(true)

            // console.log({ demo: data })
            // return
            if (!urlProductMultipleImage.isUploadImage) {
                  dispatch(
                        addToast({
                              type: 'ERROR',
                              message: `Upload thêm ${4 - urlProductMultipleImage.numberImage} để đủ 4 ảnh bạn nhé`,
                              id: Math.random().toString(),
                        }),
                  )
            }

            if (!urlProductThumb.isUploadImage) {
                  dispatch(
                        addToast({
                              type: 'ERROR',
                              message: 'Hình đại diện sản phẩm là bắt buộc',
                              id: Math.random().toString(),
                        }),
                  )
            }

            // chỉ submit khi có đủ image
            if (urlProductThumb.isUploadImage && urlProductMultipleImage.isUploadImage) {
                  const uploadProduct = {
                        product_id,
                        product_name: data.product_name,
                        product_price: data.product_price,
                        product_available: data.product_available,
                  }
                  uploadProductFull.mutate({ product_id: product_id, uploadProduct, product_attribute: data.attribute, mode })
            }
      }

      useEffect(() => {
            const callAgain = async () => {
                  queryClient.invalidateQueries({
                        queryKey: ['get-all-product   '],
                        refetchType: 'active',
                  })
            }

            const showLink = async () => {
                  await sleep(2000)
                  navigate(`/product/${product_id}`)
            }

            if (uploadProductFull.isSuccess) {
                  callAgain()
                  dispatch(addToast({ id: Math.random().toString(), message: 'Bạn đã đăng sãn phẩm thành công', type: 'SUCCESS' }))
                  queryClient.invalidateQueries()
                  showLink()
            }
      }, [uploadProductFull.isSuccess, queryClient, dispatch, navigate, product_id])

      // console.log({ defaultValues: methods.formState.defaultValues })

      return (
            <React.Fragment>
                  <div className='animate-mountComponent w-full'>
                        <FormProvider {...methods}>
                              <form
                                    className='grid w-full grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px]'
                                    onSubmit={methods.handleSubmit(onSubmit)}
                                    spellCheck={false}
                                    id='upload_product'
                              >
                                    {/* LEFT */}
                                    <div className='min-w-0 space-y-5'>
                                          {/* Basic info */}
                                          <section className='overflow-hidden rounded-2xl border border-[var(--border-color-input)] bg-color-section-theme'>
                                                <div className='flex items-center gap-3 border-b border-[var(--border-color-input)] px-4 py-4 sm:px-5'>
                                                      <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500'>
                                                            <PackageOpen size={19} />
                                                      </div>

                                                      <div>
                                                            <h3 className='text-[15px] font-semibold text-text-theme'>Thông tin cơ bản</h3>

                                                            <p className='mt-0.5 text-[11px] text-slate-500'>
                                                                  Tên, giá bán và số lượng sản phẩm
                                                            </p>
                                                      </div>
                                                </div>

                                                <div className='grid grid-cols-1 gap-4 p-4 sm:p-5 md:grid-cols-2'>
                                                      <div className='md:col-span-2'>
                                                            <InputText
                                                                  methods={methods}
                                                                  FieldName='product_name'
                                                                  LabelMessage='Tên sản phẩm'
                                                                  placehorder='Nhập tên sản phẩm'
                                                                  width='w-full'
                                                                  autofocus={true}
                                                                  require={true}
                                                            />
                                                      </div>

                                                      <InputNumber
                                                            FieldName='product_price'
                                                            LabelMessage='Giá sản phẩm'
                                                            placehorder='Nhập giá sản phẩm'
                                                            width='w-full'
                                                            require={true}
                                                      />

                                                      <InputNumber
                                                            FieldName='product_available'
                                                            LabelMessage='Số lượng sản phẩm'
                                                            placehorder='Nhập số lượng sản phẩm'
                                                            width='w-full'
                                                            require={true}
                                                      />
                                                </div>
                                          </section>

                                          {/* Images */}
                                          <section className='overflow-hidden rounded-2xl border border-[var(--border-color-input)] bg-color-section-theme'>
                                                <div className='flex items-center gap-3 border-b border-[var(--border-color-input)] px-4 py-4 sm:px-5'>
                                                      <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500'>
                                                            <ImageIcon size={19} />
                                                      </div>

                                                      <div>
                                                            <h3 className='text-[15px] font-semibold text-text-theme'>Hình ảnh sản phẩm</h3>

                                                            <p className='mt-0.5 text-[11px] text-slate-500'>
                                                                  Thêm ảnh đại diện và bộ ảnh mô tả sản phẩm
                                                            </p>
                                                      </div>
                                                </div>

                                                <div className='grid grid-cols-1 gap-5 p-4 sm:p-5 lg:grid-cols-2'>
                                                      <div className='rounded-xl border border-dashed border-[var(--border-color-input)] bg-slate-500/[0.02] p-3'>
                                                            <ButtonUpload
                                                                  mode={mode}
                                                                  product_id={product_id}
                                                                  labelMessage='Ảnh đại diện sản phẩm'
                                                                  width='w-full'
                                                                  setUrlProductThumb={setUrlProductThumb}
                                                                  isSubmit={methods.formState.isSubmitted}
                                                            />
                                                      </div>

                                                      <div className='rounded-xl border border-dashed border-[var(--border-color-input)] bg-slate-500/[0.02] p-3'>
                                                            <UpdateMultipleImage
                                                                  mode={mode}
                                                                  labelMessage='Ảnh mô tả sản phẩm'
                                                                  width='w-full'
                                                                  setUrlProductMultipleImage={setUrlProductMultipleImage}
                                                                  setGetFileName={setGetFileName}
                                                                  product_id={product_id}
                                                                  isSubmit={methods.formState.isSubmitted}
                                                            />
                                                      </div>
                                                </div>
                                          </section>

                                          {/* Product attributes */}
                                          <section className='overflow-hidden rounded-2xl border border-[var(--border-color-input)] bg-color-section-theme'>
                                                <div className='flex items-center gap-3 border-b border-[var(--border-color-input)] px-4 py-4 sm:px-5'>
                                                      <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500'>
                                                            <Boxes size={19} />
                                                      </div>

                                                      <div>
                                                            <h3 className='text-[15px] font-semibold text-text-theme'>
                                                                  Thuộc tính sản phẩm
                                                            </h3>

                                                            <p className='mt-0.5 text-[11px] text-slate-500'>
                                                                  Điền thông tin chi tiết theo loại sản phẩm
                                                            </p>
                                                      </div>
                                                </div>

                                                <div className='p-4 sm:p-5'>{ProductAttribute}</div>
                                          </section>

                                          {/* Mobile submit */}
                                          <div className='lg:hidden'>
                                                <button
                                                      disabled={uploadProductFull.isSuccess || uploadProductFull.isPending}
                                                      type='submit'
                                                      className='flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60'
                                                >
                                                      <Send size={16} />

                                                      <span>
                                                            {!uploadProductFull.isSuccess ? 'Đăng sản phẩm' : 'Đăng sản phẩm thành công'}
                                                      </span>

                                                      {uploadProductFull.isPending && (
                                                            <span
                                                                  className='inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent'
                                                                  role='status'
                                                            />
                                                      )}
                                                </button>
                                          </div>
                                    </div>

                                    {/* RIGHT - PREVIEW */}
                                    <aside className='min-w-0'>
                                          <div className='sticky top-[90px] overflow-hidden rounded-2xl border border-[var(--border-color-input)] bg-color-section-theme'>
                                                <div className='border-b border-[var(--border-color-input)] px-4 py-4'>
                                                      <h3 className='text-[15px] font-semibold text-text-theme'>Tổng quan sản phẩm</h3>

                                                      <p className='mt-0.5 text-[11px] text-slate-500'>
                                                            Xem trước thông tin trước khi đăng bán
                                                      </p>
                                                </div>

                                                <div className='p-4'>
                                                      <ProductReivew
                                                            productFormImage={[urlProductThumb.info]
                                                                  .concat(urlProductMultipleImage.info)
                                                                  .filter((image) => image.secure_url)}
                                                            info={methods.watch()}
                                                            buttonSubmit={
                                                                  <button
                                                                        form='upload_product'
                                                                        disabled={
                                                                              uploadProductFull.isSuccess || uploadProductFull.isPending
                                                                        }
                                                                        type='submit'
                                                                        className='hidden h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 lg:flex'
                                                                  >
                                                                        <Send size={16} />

                                                                        <span>
                                                                              {!uploadProductFull.isSuccess
                                                                                    ? 'Đăng bán'
                                                                                    : 'Đăng sản phẩm thành công'}
                                                                        </span>

                                                                        {uploadProductFull.isPending && (
                                                                              <span
                                                                                    className='inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent'
                                                                                    role='status'
                                                                              />
                                                                        )}
                                                                  </button>
                                                            }
                                                      />
                                                </div>
                                          </div>
                                    </aside>
                              </form>
                        </FormProvider>
                  </div>
            </React.Fragment>
      )
}

export default ProductFormUpload
