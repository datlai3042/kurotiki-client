import React, { useEffect, useState } from 'react'

//@icon
import { Check, Maximize, Minimize2 } from 'lucide-react'

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
import Timeline from '../components/Timeline'
import { useDispatch } from 'react-redux'
import { addToast } from '../../../Redux/toast'
import { productBookSchema, productFoodSchema, productSchema } from '../types/product.schema'
import { ProductForm, ProductType, TCheckDescriptionImage, TProductDetail, TProfileImage } from '../../../types/product/product.type'
import UpdateMultipleImage from '../UpdateProductForm/components/UpdateMultipleImage'
import { Link, useNavigate } from 'react-router-dom'
import { sleep } from '../../../utils/sleep'

//@Props - Product::Book

//@type form chính

//@schema chính
const ProductBookFormSchema = productSchema.merge(productBookSchema)
const ProductFoodFormSchema = productSchema.merge(productFoodSchema)
type SchemaProduct = typeof ProductBookFormSchema | typeof ProductFoodFormSchema
// type SchemaProduct = z.infer<typeof schema>

export const ui = {
      gapElementChild: 'gap-[6px]',
      gapElementChildButton: 'gap-[6px]',
      fontSizeError: 'text-[12px]',
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
      })

      //@lấy thông tin các hình
      const [urlProductMultipleImage, setUrlProductMultipleImage] = useState<TCheckDescriptionImage>({
            numberImage: 0,
            isUploadImage: false,
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
                  <div className='animate-mountComponent w-full h-auto flex gap-[16px] justify-center '>
                        <div className={`${expandTimeLine ? 'w-[full] md:w-[65%]' : 'w-full'}   h-full`}>
                              <FormProvider {...methods}>
                                    <form
                                          className='w-full md:w-[80%] flex flex-col gap-[24px]'
                                          onSubmit={methods.handleSubmit(onSubmit)}
                                          spellCheck={false}
                                    >
                                          <div className='text-[20px] font-semibold text-color-main'>Thông tin cơ bản về sản phẩm</div>
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
                                                mode={mode}
                                                product_id={product_id}
                                                labelMessage='Chọn hình đại diện cho sản phẩm'
                                                width={'xl:w-[32%]'}
                                                setUrlProductThumb={setUrlProductThumb}
                                                isSubmit={methods.formState.isSubmitted ? true : false}
                                          />

                                          <UpdateMultipleImage
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
                                                disabled={uploadProductFull.isSuccess}
                                                type='submit'
                                                className='min-w-[150px] px-[12px] py-[6px] bg-color-main opacity-80 hover:opacity-100 text-white flex justify-center items-center gap-[8px] disabled:cursor-not-allowed'
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

                        <div
                              className={`${
                                    expandTimeLine ? 'hidden lg:flex' : 'hidden'
                              } hidden h-max min-w-[160px] w-auto  flex-col gap-[28px]  py-[24px] pl-[8px] pr-[24px] bg-bgTimeLine border-r-4 border-blue-300 rounded-lg`}
                        >
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
                                    <Timeline<TimelineFieldName, typeof defaultValues>
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

                        <div className='hidden md:flex text-color-main  justify-end'>
                              {expandTimeLine ? (
                                    <Minimize2 onClick={() => setExpandTimeLine(false)}  className='cursor-pointer'/>
                              ) : (
                                    <Maximize onClick={() => setExpandTimeLine(true)}  className='cursor-pointer'/>
                              )}
                        </div>
                  </div>
            </React.Fragment>
      )
}

export default ProductFormUpload
