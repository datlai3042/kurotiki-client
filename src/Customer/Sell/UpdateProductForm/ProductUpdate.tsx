import React, { useEffect, useState } from 'react'

//@icon
import { Check } from 'lucide-react'

//@api
import { useMutation, useQueryClient } from '@tanstack/react-query'
import ProductApi, { ProductData } from '../../../apis/product.api'

//@form
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'

//@components
import { useDispatch } from 'react-redux'
import { addOneToastError } from '../../../Redux/toast'
import { ProductForm, TCheckDescriptionImage, TProductDetail, TProfileImage } from '../../../types/product/product.type'
import InputNumber from '../components/InputNumber'
import InputText from '../components/InputText'
import Timeline from '../components/Timeline'
import ButtonUpload from '../RegisterProductForm/components/ButtonUpload'
import { TCloudinaryImage } from '../types/cloudinary.typs'
import { productBookSchema, productFoodSchema, productSchema } from '../types/product.schema'
import UpdateMultipleImage from './components/UpdateMultipleImage'

//@Props - Product::Book

//@type form chính

//@schema chính

export const ui = {
      gapElementChild: 'gap-[6px]',
      gapElementChildButton: 'gap-[12px]',
      fontSizeError: 'text-[12px]',
      colorError: 'text-red-700',
}
type TProps<T, K> = {
      mode?: 'UPLOAD' | 'UPDATE'
      product_id: string
      ProductAttribute: React.ReactNode
      TimelineProps: {
            FieldName: keyof T
            label: keyof K
      }[]
      defaultValues: ProductForm
      product?: TProductDetail
      public_id?: string
      public_id_array?: { secure_url: string; public_id: string }[]
      ProductType: 'Book' | 'Food'
      endPointUrl: string
}

//@Component
const ProductFormUpdate = <T, K>(props: TProps<T, K>) => {
      const { product_id, ProductAttribute, TimelineProps, mode = 'UPDATE', product, defaultValues, ProductType, endPointUrl } = props
      //@trang thái submit
      const [, setFormStateSubmit] = useState(false)
      const dispatch = useDispatch()
      let schema
      if (ProductType === 'Book') {
            schema = productSchema.merge(productBookSchema)
      } else {
            schema = productSchema.merge(productFoodSchema)
      }

      const queryClient = useQueryClient()
      //@lấy thông tin hình ảnh
      const [urlProductThumb, setUrlProductThumb] = useState<TProfileImage>({
            isUploadImage: true,
            FileName: product?.product_thumb_image.secure_url as string,
            FileLength: 1,
      })

      //@lấy thông tin các hình
      const [urlProductMultipleImage, setUrlProductMultipleImage] = useState<TCheckDescriptionImage>({
            numberImage: 0,
            isUploadImage: false,
      })

      //@lấy thông tin tên các hình
      const [getFileName, setGetFileName] = useState<string[]>([])
      //console.log(([^)]+))
      //@useForm
      const methods = useForm<typeof defaultValues>({
            defaultValues: product as unknown as typeof defaultValues,
            resolver: zodResolver(schema),
      })

      //@hàm upload sản phẩn
      const uploadProductFull = useMutation({
            mutationKey: ['upload-product-full'],
            mutationFn: (data: ProductData) => ProductApi.uploadProductFull(data, endPointUrl),
      })

      //@hàm submit sản phẩm
      const onSubmit = (data: typeof defaultValues) => {
            setFormStateSubmit(true)

            // return
            if (!urlProductMultipleImage.isUploadImage) {
                  dispatch(
                        addOneToastError({
                              toast_item: {
                                    type: 'ERROR',
                                    core: {
                                          message: `Upload thêm ${4 - urlProductMultipleImage.numberImage} để đủ 4 ảnh bạn nhé`,
                                    },
                                    _id: Math.random().toString(),
                                    toast_title: 'Có lỗi xảy ra',
                              },
                        }),
                  )
            }

            if (!urlProductThumb.isUploadImage) {
                  dispatch(
                        addOneToastError({
                              toast_item: {
                                    type: 'ERROR',
                                    core: {
                                          message: 'Hình đại diện sản phẩm là bắt buộc',
                                    },
                                    _id: Math.random().toString(),
                                    toast_title: 'Có lỗi xảy ra',
                              },
                        }),
                  )
            }

            // chỉ submit khi có đủ image
            if (urlProductThumb.isUploadImage && urlProductMultipleImage.isUploadImage) {
                  //console.log(([^)]+))

                  const uploadProduct = {
                        product_id,
                        product_name: data.product_name,
                        product_price: data.product_price,
                        product_available: data.product_available,
                  }

                  uploadProductFull.mutate({ product_id: product_id, uploadProduct, product_attribute: data.attribute, mode: 'UPDATE' })
            }
      }

      useEffect(() => {
            const callAgain = async () => {
                  queryClient.invalidateQueries({
                        queryKey: ['get-all-product'],
                        refetchType: 'active',
                  })
            }

            if (uploadProductFull.isSuccess) {
                  callAgain()
                  queryClient.invalidateQueries()
            }
      }, [uploadProductFull.isSuccess, queryClient])

      //console.log(([^)]+))

      return (
            <React.Fragment>
                  <div className='mb-[70px] animate-mountComponent w-full h-auto flex justify-center '>
                        <div className=' w-[full] lg:w-[65%]  h-full'>
                              <FormProvider {...methods}>
                                    <form
                                          className='w-full lg:w-[60%]  flex flex-col gap-[24px] p-[16px]'
                                          onSubmit={methods.handleSubmit(onSubmit)}
                                          spellCheck={false}
                                    >
                                          <div className=''>Thông tin cơ bản về sản phẩm</div>
                                          <InputText
                                                methods={methods}
                                                FieldName='product_name'
                                                LabelMessage='Tên sản phẩm'
                                                placehorder='Nhập tên sản phẩm'
                                                width={'xl:w-[100%]'}
                                                autofocus={true}
                                                require={true}
                                          />

                                          <InputNumber
                                                FieldName='product_price'
                                                LabelMessage='Giá sản phẩm'
                                                placehorder='Nhập giá sản phẩm'
                                                width={'xl:w-[100%]'}
                                                require={true}
                                          />
                                          <ButtonUpload
                                                mode='UPDATE'
                                                CloudinaryImage={product?.product_thumb_image}
                                                product_id={product_id}
                                                labelMessage='Chọn hình đại diện cho sản phẩm'
                                                width={'xl:w-[32%]'}
                                                setUrlProductThumb={setUrlProductThumb}
                                                isSubmit={methods.formState.isSubmitted ? true : false}
                                          />

                                          <UpdateMultipleImage
                                                CloudinaryImage={product?.product_desc_image as TCloudinaryImage[]}
                                                mode={mode}
                                                labelMessage='Chọn các hình description cho sản phẩm'
                                                width={'xl:w-[100%]'}
                                                setUrlProductMultipleImage={setUrlProductMultipleImage}
                                                setGetFileName={setGetFileName}
                                                product_id={product_id}
                                                isSubmit={methods.formState.isSubmitted ? true : false}
                                          />

                                          <InputNumber
                                                FieldName='product_available'
                                                LabelMessage='Số lượng sản phẩm'
                                                placehorder='Nhập số lượng sản phẩm'
                                                width={'xl:w-[100%]'}
                                                require={true}
                                          />
                                          <>{ProductAttribute}</>
                                          <button
                                                type='submit'
                                                className='min-w-[150px] px-[12px] py-[6px] bg-slate-700 text-white flex justify-center items-center gap-[8px]'
                                          >
                                                <span>{!uploadProductFull.isSuccess ? 'Đăng bán' : 'Đăng sản phẩm thành công'}</span>

                                                {uploadProductFull.isPending && (
                                                      <span
                                                            className='inline-block h-[25px] w-[25px] text-white animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]'
                                                            role='status'
                                                      ></span>
                                                )}
                                          </button>
                                    </form>
                              </FormProvider>
                        </div>

                        <div className='hidden h-max min-w-[160px] w-auto lg:flex flex-col gap-[28px]  py-[24px] pl-[8px] pr-[24px] bg-bgTimeLine border-r-4 border-blue-300 rounded-lg'>
                              <Timeline
                                    attribute={false}
                                    methods={methods}
                                    value={methods.watch('product_name')}
                                    FieldName='product_name'
                                    TimeLineName='Tên sản phẩm'
                                    type='Text'
                              />

                              <Timeline
                                    attribute={false}
                                    methods={methods}
                                    value={methods.watch('product_price')?.toString()}
                                    FieldName='product_price'
                                    TimeLineName='Giá sản phẩm'
                                    type='Money'
                              />
                              <Timeline
                                    attribute={false}
                                    TimeLineName='Hình đại diện sản phẩm'
                                    type='File'
                                    File={{
                                          isUploadImage: urlProductThumb.isUploadImage,
                                          FileName: urlProductThumb.FileName,
                                    }}
                                    isSubmit={methods.formState.isSubmitted ? true : false}
                              />
                              <Timeline
                                    attribute={false}
                                    TimeLineName='Các hình mô tả sản phẩm'
                                    type='Files'
                                    Files={{
                                          FileName: getFileName || '',
                                          isUploadImages: urlProductMultipleImage.isUploadImage,
                                    }}
                                    isSubmit={methods.formState.isSubmitted ? true : false}
                              />

                              <Timeline
                                    attribute={false}
                                    methods={methods}
                                    value={methods.watch('product_available').toString()}
                                    FieldName='product_available'
                                    TimeLineName='Số lượng sản phẩm'
                                    type='Text'
                              />

                              {TimelineProps.map((timeline) => (
                                    <Timeline<T, typeof defaultValues>
                                          attribute={true}
                                          methods={methods}
                                          type='Text'
                                          FieldName={timeline.FieldName}
                                          TimeLineName={timeline.label as string}
                                    />
                              ))}

                              <div className='flex items-center justify-center bg-blue-700 w-[20px] h-[20px] rounded-full'>
                                    <Check color='white' size={12} />
                              </div>
                        </div>
                  </div>

                  {/* {methods.formState.isSubmitted && (
                        <>
                              <Link to={`/product/${product_id}`}>Đường dẫn của sản phẩm</Link>
                        </>
                  )} */}
            </React.Fragment>
      )
}

export default ProductFormUpdate
