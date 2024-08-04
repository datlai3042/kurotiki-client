import React, { SetStateAction, useEffect, useId, useRef, useState } from 'react'

//@modal và icon
import { Image, ImagePlus, View, X } from 'lucide-react'
import BoxModal from '../../../../component/BoxUi/BoxModal'

//@dispatch toast
import { useDispatch } from 'react-redux'

//@api
import { useMutation } from '@tanstack/react-query'
import ProductApi, { IFormDataDeleteImage, IFormDataImage } from '../../../../apis/product.api'
import { TCheckDescriptionImage } from '../../../../types/product/product.type'
import { ui } from '../../RegisterProductForm/ProductFormUpload'
import { TCloudinaryImage } from '../../types/cloudinary.typs'
import { addOneToastSuccess, addOneToastWarning } from '../../../../Redux/toast'

//@Props
interface IProps {
      mode?: 'UPLOAD' | 'UPDATE'
      //@tên nút button
      labelMessage: string

      //@witdh mà cái này sắp bỏ rồi
      width?: string

      //@toàn bộ dữ liệu từ việc upload 4 hình ảnh sẽ được trả cho form parent để xử lí
      setUrlProductMultipleImage: React.Dispatch<SetStateAction<TCheckDescriptionImage>>

      //@do form t chia ra làm 3 phần, 2 phần hình 1 phần text nên product_id là cái liên kết duy nhất của cả 3
      product_id: string

      //@lấy tên của 4 file cho timeline hiển thị
      setGetFileName: React.Dispatch<SetStateAction<string[]>>
      CloudinaryImage?: TCloudinaryImage[]
      //@trạng thái submit
      isSubmit: boolean
}

//@Component
const UpdateMultipleImage = (props: IProps) => {
      const {
            labelMessage,
            width,
            product_id,
            isSubmit,
            setUrlProductMultipleImage,
            setGetFileName,
            mode = 'UPLOAD',
            CloudinaryImage,
      } = props

      //@Input upload chính
      const inputRef = useRef<HTMLInputElement>(null)

      //@dùng cho label match với input
      const id = useId()

      //@dispatch toast
      const dispatch = useDispatch()

      //@dùng để lưu link blob
      const [cloudinaryImage, setCloudinaryImage] = useState<TCloudinaryImage[]>(() => {
            if (mode === 'UPLOAD') return []
            return CloudinaryImage as TCloudinaryImage[]
      })
      const [countLoading, setCountLoading] = useState<number>(0)

      //@model xem trước [dùng potarl]
      const [modalFilePreview, setModalFilePreview] = useState(false)

      const [selectImageModal, setSelectImageModal] = useState<string>('')

      //@hàm kích hoạt xóa, đây là lấy cần dùng cái product_id nè
      const deleteImages = useMutation({
            mutationKey: ['delete-product-image-full'],
            mutationFn: ({ id }: { id: string }) => ProductApi.deleteImages({ id: product_id }),
      })

      const uploadProductDescriptionImageOne = useMutation({
            mutationKey: ['uploadProductDescriptionImageOne'],
            mutationFn: ({ formData }: { formData: IFormDataImage }) => ProductApi.uploadProductDescriptionImageOne({ formData }),
            onSuccess: (axiosResponse) => {
                  setCloudinaryImage((cloudinaryLocal) => {
                        const newArray = [...cloudinaryLocal]
                        newArray.push({
                              secure_url: axiosResponse.data.metadata.product.secure_url,
                              public_id: axiosResponse.data.metadata.product.public_id,
                        })
                        return newArray
                  })
            },
      })

      const deleteProductDescriptionImageOne = useMutation({
            mutationKey: ['deleteProductDescriptionImageOne'],
            mutationFn: (formData: IFormDataDeleteImage) => ProductApi.deleteProductDescriptionImageOne(formData),
      })

      //@Click vào button, kích hoạt inputRef click
      const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            //@chặn submit tới form cha
            e.preventDefault()
            if (inputRef.current) {
                  inputRef.current.click()
            }
      }

      //@kích hoạt onChange input
      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            //@nếu file vượt quá 4 thì xét 3 state chính lại mặc định và mount toast
            if (cloudinaryImage.length > 4 || e.target.files!.length > 4) {

                  dispatch(
                        addOneToastWarning({
                              toast_item: {
                                    type: 'WARNING',
                                    _id: Math.random().toString(),
                                    core: {
                                          message: 'Chỉ upload tối đa 4 files'
                                    },
                                    toast_title: 'Lỗi upload',
                              },
                        }),
                  )

                  return
            }

            //@nếu file bé hơn 4, lưu ý là bé hơn chứ không = 4, bé hơn thì khả năng người dùng còn chọn thêm file mới nữa
            if (e.target.files && e.target.files!.length <= 4 && cloudinaryImage.length < 4) {
                  //@nếu số file người dùng push vào + với số file sẵn có từ lần trước mà quá hơn 4 thì mount toast
                  if (cloudinaryImage.length + e.target.files.length > 4) {
                      
                        dispatch(
                              addOneToastWarning({
                                    toast_item: {
                                          type: 'WARNING',
                                          _id: Math.random().toString(),
                                          core: {
                                                message: `Chỉ upload tối đa 4 files`,
                                          },
                                          toast_title: 'Lỗi upload',
                                    },
                              }),
                        )
                      
                       
                        inputRef!.current!.value = ''

                        return
                  }
                  setCountLoading(e.target.files.length)
                  for (let index = 0; index < e.target.files.length; index++) {
                        const formData: IFormDataImage = new FormData()
                        formData.append('file', e.target.files[index])
                        formData.append('product_id', product_id)
                        uploadProductDescriptionImageOne.mutate({ formData })
                  }
                  return
            }

            if (e.target.files && e.target.files.length <= 4) {
                  setCountLoading(e.target.files.length)

                  for (let index = 0; index < e.target.files.length; index++) {
                        const formData: IFormDataImage = new FormData()
                        formData.append('file', e.target.files[index])
                        formData.append('product_id', product_id)

                        uploadProductDescriptionImageOne.mutate({ formData })
                  }
            }
            inputRef!.current!.value = ''
      }

      const handleDeleteProductDescriptionImageOne = ({ public_id, secure_url }: { public_id: string; secure_url: string }) => {
            setCloudinaryImage((cloud) => cloud.filter((filter) => filter.public_id !== public_id && filter.secure_url !== secure_url))
            const formData: IFormDataDeleteImage = new FormData()
            formData.append('product_id', product_id)
            formData.append('public_id', public_id)
            deleteProductDescriptionImageOne.mutate(formData)
      }

      const handleDeleteProductImages = () => {
            //api
            if (inputRef) {
                  inputRef!.current!.value = ''
                  inputRef.current?.click()
            }

            setGetFileName([])
            setCloudinaryImage([])
            setUrlProductMultipleImage({ numberImage: 0, isUploadImage: false })
            deleteImages.mutate({ id: product_id })
      }

      useEffect(() => {
            setGetFileName(() => {
                  const newArrayFile = []
                  for (let index = 0; index < cloudinaryImage.length; index++) {
                        newArrayFile.push(cloudinaryImage[index].secure_url)
                  }
                  return newArrayFile
            })
      }, [cloudinaryImage, setGetFileName])

      useEffect(() => {
            if (cloudinaryImage.length === 4) {
                  setUrlProductMultipleImage({ numberImage: cloudinaryImage.length, isUploadImage: true })
                  return
            }
            setUrlProductMultipleImage({ numberImage: cloudinaryImage.length, isUploadImage: false })
      }, [cloudinaryImage, setUrlProductMultipleImage])

      useEffect(() => {
            if (uploadProductDescriptionImageOne.isSuccess && cloudinaryImage.length === 4) {
               
                  dispatch(
                        addOneToastSuccess({
                              toast_item: {
                                    type: 'SUCCESS',
                                    core: {message: 'Đã upload đủ ảnh' },
                                    _id: Math.random().toString(),
                                    toast_title: 'Thành công',
                              },
                        }),
                  )
            }
      }, [uploadProductDescriptionImageOne.isSuccess])

      const styleEffect = {
            withContainer: width ? width : 'w-full',
            widthContainerImage: uploadProductDescriptionImageOne.isPending
                  ? cloudinaryImage.length > 0
                        ? 100 * cloudinaryImage.length
                        : 80
                  : '100%',
            // heightWrapperFilePreview: filePreview.length > 0 ? 'w-[350px] ' : 'w-[80px] min-h-[60px]',
            stateButton:
                  isSubmit && cloudinaryImage.length === 0
                        ? 'border-[2px] border-red-700 text-red-700 bg-white'
                        : 'text-white bg-slate-900 border-[2px] border-slate-900',

            flexContainerModal: cloudinaryImage.length === 1 ? 'flex-row' : cloudinaryImage.length > 2 ? 'flex-row' : `flex-col`,
            widthImageModal:
                  cloudinaryImage.length === 1
                        ? 'w-full h-full'
                        : cloudinaryImage.length > 2
                        ? `calc(90%/${cloudinaryImage.length - 1})`
                        : `calc(90%/${cloudinaryImage.length})`,

            gap: ui.gapElementChildButton || 'gap-[8px]',
            fontSizeError: ui.fontSizeError || 'text-[12px]',
            colorError: ui.colorError || 'text-red-700',
      }

      return (
            <div className={`${styleEffect.withContainer} ${styleEffect.gap} relative min-h-[80px] h-auto flex flex-col`}>
                  <div className='w-full flex items-center gap-[6px]'>
                        <label htmlFor={id}>{labelMessage}</label>
                        <ImagePlus size={20} />
                  </div>
                  <input type='file' id={id} hidden ref={inputRef} multiple onChange={(e) => handleInputChange(e)} />

                  {/* {@số lượng file review} */}
                  {cloudinaryImage && cloudinaryImage.length > 0 && (
                        <p>
                              Tổng số lượng hình ảnh{' '}
                              <span className='text-green-700 text-[28px] font-semibold'>{cloudinaryImage.length}</span> / 4
                        </p>
                  )}

                  {/* {@các hình review} */}
                  <div className='w-full flex gap-[8px]'>
                        {cloudinaryImage.length > 0 && (
                              <React.Fragment>
                                    <div style={{ width: styleEffect.widthContainerImage }} className='animate-mountComponent'>
                                          <div className='min-w-full min-h-full flex items-center flex-wrap gap-[20px]'>
                                                {cloudinaryImage.map((preview, index) => {
                                                      return (
                                                            <div
                                                                  className='relative w-[65px] h-[72px] bg-gray-300 animate-pulseCustome flex justify-center items-center'
                                                                  key={preview.secure_url}
                                                                  onClick={() => {
                                                                        setSelectImageModal(preview.secure_url! as string)
                                                                        setModalFilePreview(true)

                                                                        // handleDeleteImageOne({})
                                                                  }}
                                                            >
                                                                  <img src={preview.secure_url} alt='preview' className='w-full h-full' />

                                                                  <div
                                                                        className='absolute top-[-15px] right-[-15px] bg-red-700 h-[24px] w-[24px] p-[2px] flex items-center justify-center'
                                                                        onClick={(e) => {
                                                                              e.stopPropagation()
                                                                              e.preventDefault()
                                                                              handleDeleteProductDescriptionImageOne({
                                                                                    public_id: preview.public_id,
                                                                                    secure_url: preview.secure_url,
                                                                              })
                                                                        }}
                                                                  >
                                                                        <X size={20} color='white' />
                                                                  </div>
                                                            </div>
                                                      )
                                                })}
                                          </div>
                                    </div>
                              </React.Fragment>
                        )}
                        {uploadProductDescriptionImageOne.isPending && (
                              <div className='animate-pulse  bg-gray-200 w-full h-[80px] '>
                                    <Image color='#666666' size={50} />
                              </div>
                        )}{' '}
                  </div>

                  {/* {@nút upload file} */}
                  {cloudinaryImage.length < 4 && (
                        <button
                              className={`${styleEffect.stateButton} xl:w-[32%] rounded-md min-h-[40px]`}
                              onClick={(e) => handleButtonClick(e)}
                        >
                              {cloudinaryImage.length > 0 ? 'Tải lên thêm' : 'Tải lên'}
                        </button>
                  )}

                  {/* {@Nút button reset, chỉ có khi khi upload ít nhất 1 file hình} */}
                  {cloudinaryImage.length > 0 && (
                        <div className='mt-[25px] h-[35px] w-[95px] flex gap-[16px] '>
                              <button
                                    disabled={cloudinaryImage.length < 0}
                                    onClick={(e) => {
                                          e.preventDefault()
                                          handleDeleteProductImages()
                                    }}
                                    className='min-w-[150px] px-[12px] py-[6px] bg-slate-700 text-white rounded-md '
                              >
                                    Chọn lại từ đầu
                              </button>
                              <div
                                    className=' bg-white h-[35px] min-w-[180px] flex items-center  gap-[8px] rounded-full'
                                    onClick={() => setModalFilePreview(true)}
                              >
                                    <View size={28} className=' ' />
                                    <p>Xem trước</p>
                              </div>
                        </div>
                  )}

                  {isSubmit && cloudinaryImage.length === 0 && (
                        <span className={`${styleEffect.colorError} ${styleEffect.fontSizeError}`}>
                              Các hình ảnh chi tiết về sản phẩm là bắt buộc
                        </span>
                  )}

                  {/* {@model xem trước file} */}
                  {modalFilePreview && (
                        <BoxModal>
                              {selectImageModal && (
                                    <div
                                          className={` relative top-[50%] min-w-[600px] w-auto h-full flex flex-wrap mx-[50px] items-center gap-[16px] justify-center`}
                                    >
                                          <img
                                                key={selectImageModal}
                                                src={selectImageModal}
                                                alt='preview'
                                                className='w-[600px] h-[600px] bg-yellow-700'
                                          />
                                          <div
                                                className='absolute top-[-10px] right-[-16px] bg-slate-900 flex items-center justify-center rounded-md'
                                                onClick={() => {
                                                      setModalFilePreview(false)
                                                      setSelectImageModal('')
                                                }}
                                          >
                                                <X color='white' size={40} />
                                          </div>
                                    </div>
                              )}

                              {!selectImageModal && (
                                    <div
                                          className={` relative top-[50%] translate-y-[-50%] min-w-[600px] w-auto h-[300px] flex flex-wrap mx-[50px] items-center gap-[16px] justify-center`}
                                    >
                                          {cloudinaryImage.map((preview) => (
                                                <img
                                                      style={{ width: styleEffect.widthImageModal }}
                                                      key={Math.random().toString()}
                                                      src={preview.secure_url}
                                                      alt='preview'
                                                      className=' h-full bg-yellow-700'
                                                />
                                          ))}

                                          <div
                                                className='absolute top-[-10px] right-[-16px] bg-slate-900 flex items-center justify-center rounded-md'
                                                onClick={() => {
                                                      setModalFilePreview(false)
                                                      setSelectImageModal('')
                                                }}
                                          >
                                                <X color='white' size={40} />
                                          </div>
                                    </div>
                              )}
                        </BoxModal>
                  )}
            </div>
      )
}

export default UpdateMultipleImage
