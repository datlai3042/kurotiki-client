// import { useEffect, useState } from 'react'

// //@icon
// import { Check } from 'lucide-react'

// //@api
// import ProductApi, { IFormDataProductFull } from '../../../apis/product.api'
// import { useMutation } from '@tanstack/react-query'

// //@form
// import { zodResolver } from '@hookform/resolvers/zod'
// import { FormProvider, useForm } from 'react-hook-form'

// //@components
// import InputText from '../components/InputText'
// import ButtonUpload from './components/ButtonUpload'
// import InputNumber from '../components/InputNumber'
// import ButtonUploadMultiple from './components/ButtonUploadMultiple'
// import Timeline from '../components/Timeline'
// import Book from '../Category/Book/Book'
// import { useDispatch } from 'react-redux'
// import { productBookSchema, productSchema } from '../types/product.schema'
// import { UploadImage, UploadImages } from '../types/product.type'

// //@Props - Product::Book
// export type BookProduct = {
//     book: {
//         book_publishing: string
//         book_pageNumber: number
//     }
// }

// //@type form chính
// export type TRegisterFormBook = {
//     product_name: string
//     product_price: number | null
//     product_thumb_image: { secure_url: string; public_id: string }
//     product_image_desc: string[]

//     //@attribute book
//     publishing: string
//     page_number: 0
//     author: string
//     description: string
//     book_type: 'Novel' | 'Comin' | 'Memoir'
// }

// //@schema chính
// const schema = productSchema.merge(productBookSchema)
// export const ui = {
//     gapElementChild: 'gap-[6px]',
//     gapElementChildButton: 'gap-[12px]',
//     fontSizeError: 'text-[12px]',
//     colorError: 'text-red-700',
// }

// //@Component
// const FormRegisterFood = () => {

//     const {}
//     //@trang thái submit
//     const [, setFormStateSubmit] = useState(false)
//     const dispatch = useDispatch()
//     //@lấy thông tin hình ảnh
//     const [urlProductThumb, setUrlProductThumb] = useState<UploadImage>({
//         product_thumb_image: { secure_url: '', public_id: '' },
//         FileName: '',
//         FileLength: 0,
//     })

//     //@lấy thông tin các hình
//     const [urlProductMultipleImage, setUrlProductMultipleImage] = useState<UploadImages[]>([])

//     //@lấy thông tin tên các hình
//     const [getFileName, setGetFileName] = useState<string[]>([])

//     //@useForm
//     const methods = useForm<TRegisterFormBook>({
//         defaultValues: {
//             product_name: '',
//             product_price: null,
//             product_thumb_image: { secure_url: '', public_id: '' },
//             product_image_desc: [],
//             publishing: '',
//             page_number: 0,
//             author: '',
//             description: '',
//         },
//         resolver: zodResolver(schema),
//     })

//     //@hàm upload sản phẩn
//     const uploadProductFull = useMutation({
//         mutationKey: ['upload-product-full'],
//         mutationFn: (data: IFormDataProductFull) => ProductApi.uploadProductFull(data),
//     })

//     //@hàm submit sản phẩm
//     const onSubmit = (data: TRegisterFormBook) => {
//         setFormStateSubmit(true)
//        console.log(([^)]+))

//         if (urlProductMultipleImage.length < 4) {
//         }

//         // chỉ submit khi có đủ image
//         if (urlProductThumb.product_thumb_image.secure_url && urlProductMultipleImage.length === 4) {
//             const formData: IFormDataProductFull = new FormData()
//             formData.append('_id ', product_id)

//             formData.append('product_name', data.product_name)
//             formData.append('product_price', data.product_price as number)
//             formData.append('product_thumb_image_url', urlProductThumb.product_thumb_image.secure_url)
//             formData.append('product_thumb_image_public_id', urlProductThumb.product_thumb_image.public_id)

//             // for (let index = 0; index < urlProductMultipleImage.length; index++) {
//             //     formData.append('product_description_image_public_id', urlProductMultipleImage[index].public_id)
//             //     formData.append('product_description_image_url', urlProductMultipleImage[index].secure_url)
//             // }

//             urlProductMultipleImage.forEach((url) => formData.append('product_image_description', JSON.stringify(url)))

//             formData.append('publishing', data.publishing)
//             formData.append('author', data.author)
//             formData.append('page_number', data.page_number)
//             formData.append('description', data.description)
//            console.log(([^)]+))
//             // uploadProductFull.mutate(formData)
//         }
//     }

//     return (
//         <div className='animate-mountComponent w-full h-auto flex justify-center '>
//             <div className=' w-[full] lg:w-[65%]  h-full'>
//                 <FormProvider {...methods}>
//                     <form className='w-full lg:w-[60%]  flex flex-col gap-[24px] p-[16px]' onSubmit={methods.handleSubmit(onSubmit)}>
//                         <div className=''>Thông tin cơ bản về sản phẩm</div>
//                         <InputText
//                             methods={methods}
//                             FieldName='product_name'
//                             LabelMessage='Tên sản phẩm'
//                             placehorder='Nhập tên sản phẩm'
//                             width={'xl:w-[100%]'}
//                             autofocus={true}
//                             require={true}
//                         />

//                         <InputNumber
//                             FieldName='product_price'
//                             LabelMessage='Giá sản phẩm'
//                             placehorder='Nhập giá sản phẩm'
//                             width={'xl:w-[100%]'}
//                             require={true}
//                         />
//                         <ButtonUpload
//                             labelMessage='Chọn hình đại diện cho sản phẩm'
//                             width={'xl:w-[32%]'}
//                             setUrlProductThumb={setUrlProductThumb}
//                             isSubmit={methods.formState.isSubmitted ? true : false}
//                         />

//                         <ButtonUploadMultiple
//                             labelMessage='Chọn các hình description cho sản phẩm'
//                             width={'xl:w-[100%]'}
//                             setUrlProductMultipleImage={setUrlProductMultipleImage}
//                             setGetFileName={setGetFileName}
//                             product_id={urlProductThumb.product_id}
//                             isSubmit={methods.formState.isSubmitted ? true : false}
//                         />
//                         <Book mode='UPLOAD' />

//                         <button type='submit' className='min-w-[150px] px-[12px] py-[6px] bg-slate-700 text-white'>
//                             Đăng bán
//                         </button>
//                     </form>
//                 </FormProvider>
//             </div>
//             <div className='hidden h-max min-w-[160px] w-auto lg:flex flex-col gap-[24px]  py-[24px] pl-[8px] pr-[24px] bg-bgTimeLine border-r-4 border-blue-300 rounded-lg'>
//                 <Timeline methods={methods} FieldName='product_name' TimeLineName='Tên sản phẩm' type='Text' />
//                 <Timeline methods={methods} FieldName='product_price' TimeLineName='Giá sản phẩm' type='Money' />
//                 <Timeline
//                     TimeLineName='Hình đại diện sản phẩm'
//                     type='File'
//                     File={{
//                         FileName: urlProductThumb.FileName,
//                         CountFile: urlProductThumb.FileLength,
//                     }}
//                     isSubmit={methods.formState.isSubmitted ? true : false}
//                 />
//                 <Timeline
//                     TimeLineName='Các hình mô tả sản phẩm'
//                     type='Files'
//                     Files={{
//                         FileName: getFileName || '',
//                         CountFile: getFileName.length || 0,
//                     }}
//                     isSubmit={methods.formState.isSubmitted ? true : false}
//                 />
//                 <Timeline<TRegisterFormBook> methods={methods} FieldName='publishing' TimeLineName='Nhà xuất bản' type='Text' />

//                 <Timeline methods={methods} FieldName='page_number' TimeLineName='Số trang' type='Text' />
//                 <Timeline methods={methods} FieldName='author' TimeLineName='Tên tác giả' type='Text' />
//                 <Timeline methods={methods} FieldName='description' TimeLineName='Mô tả chi tiết' type='Text' />

//                 {/* <Timeline
//                     TimeLineName='Hình đại diện sản phẩm'
//                     type='Files'
//                     Files={{
//                         FileName: [urlProductThumb.FileName],
//                         CountFile: urlProductThumb.FileLength,
//                     }}
//                     isSubmit={methods.formState.isSubmitted ? true : false}
//                 /> */}

//                 <div className='flex items-center justify-center bg-blue-700 w-[20px] h-[20px] rounded-full'>
//                     <Check color='white' size={12} />
//                 </div>
//                 {/* <button className='bg-slate-700 text-white p-[12px] '>submit</button> */}
//             </div>
//         </div>
//     )
// }

// export default FormRegisterFood
import React from 'react'

const FormRegisterFood = () => {
      return <div>FormRegisterFood</div>
}

export default FormRegisterFood
