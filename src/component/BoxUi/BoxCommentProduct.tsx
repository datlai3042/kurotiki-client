import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Rate } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { Camera, X } from 'lucide-react'
import React, { SetStateAction, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import CommentService, { AddCommentParam } from '../../apis/comment.service'
import { StateFile } from '../../apis/shop.api'
import { addOneToastError, addOneToastWarning } from '../../Redux/toast'
import { TProductDetail } from '../../types/product/product.type'
import BoxLoading from './BoxLoading'
import { ModeForm } from './BoxShopForm'

type TProps = {
      onClose: React.Dispatch<SetStateAction<boolean>>
      product: TProductDetail
      defaultValue: {
            vote: number
            content: string
            secure_url: string
      }
      public_id: string
      mode: ModeForm
}

const BoxCommentProduct = (props: TProps) => {
      const { onClose, product, defaultValue, mode, public_id } = props

      const dispatch = useDispatch()
      const queryClient = useQueryClient()

      const [formComment, setFormComment] = useState<{ content: string; vote: number; secure_url: string }>(defaultValue)

      // const [countStar, setCountStar] = useState<number>(defaultValue.vote)
      // const [content, setContent] = useState<string>(defaultValue.content)
      // const [preview, setPreview] = useState<string>(defaultValue.secure_url)
      const [file, setFile] = useState<File | undefined>(undefined)
      const inputImageRef = useRef<HTMLInputElement>(null)

      const addCommentMutation = useMutation({
            mutationKey: ['add-comment'],
            mutationFn: ({ params, state, mode }: { params: AddCommentParam; state: StateFile; mode: ModeForm }) =>
                  CommentService.addComment({ params, state, mode }),
            onSuccess: () => {
                  queryClient.invalidateQueries({
                        queryKey: ['get-me-comment'],
                  })

                  onClose(false)
                  queryClient.invalidateQueries({
                        queryKey: ['get-product-with-id', product._id],
                  })

                  queryClient.invalidateQueries({
                        queryKey: ['get-comment-core', product._id],
                  })
                  queryClient.invalidateQueries({
                        queryKey: ['/v1/api/shop/get-shop-product'],
                  })
            },

            onError: () => {
                  dispatch(
                        addOneToastError({
                              toast_item: {
                                    type: 'ERROR',
                                    _id: Math.random().toString(),
                                    core: {
                                          message: ' vui lòng thử lại',
                                    },
                                    toast_title: 'Đã có lỗi xảy ra',
                              },
                        }),
                  )
            },
      })

      const onChangeStar = (value: number) => {
            setFormComment((prev) => ({ ...prev, vote: value }))
      }

      const onChangeContent = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
            const content = event.target.value
            // setContent(content)
            setFormComment((prev) => ({ ...prev, content }))
      }

      const onClickUpload = () => {
            if (public_id) {
                  dispatch(
                        addOneToastWarning({
                              toast_item: {
                                    type: 'WARNING',
                                    _id: Math.random().toString(),
                                    core: {
                                          message: 'Do dung lượng Cloudinary free của mình sắp hết nên mỗi comment mình set chỉ up 1 ảnh thôi @@',
                                    },
                                    toast_title: 'Lỗi upload',
                              },
                        }),
                  )
                  return
            }

            if (inputImageRef.current) {
                  inputImageRef.current.click()
            }
      }

      const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (file || formComment.secure_url) {
                  setFormComment((prev) => ({ ...prev, secure_url: '' }))

                  setFile(undefined)
            }
            if (e.target.files && e.target.files[0]) {
                  const url = URL.createObjectURL(e!.target!.files![0])
                  setFormComment((prev) => ({ ...prev, secure_url: url }))

                  if (!url) {
                        return
                  }
                  setFile(e.target.files[0])
            }
      }

      const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault()

            const formData = new FormData()
            formData.append('content', formComment.content)
            formData.append('countStar', formComment.vote.toString())
            formData.append('product_id', product._id)

            formData.append('file', file as File)

            addCommentMutation.mutate({ params: formData, state: (file ? 'file' : 'no-file') as StateFile, mode })
      }

      const onCloseModel = () => {
            onClose(false)
            URL.revokeObjectURL(formComment.secure_url)
      }

      return (
            <div className='fixed inset-0 bg-[rgba(0,0,0,.4)] h-screen flex items-center justify-center z-[500]'>
                  <form
                        className='animate-authBox relative w-[350px] xl:w-[420px] h-[530px] xl:h-[600px] mx-[16px] xl:mx-0 bg-[#ffffff] p-[16px] flex flex-col gap-[8px] rounded '
                        onSubmit={onSubmit}
                        spellCheck={false}
                  >
                        <button className='absolute top-[20px] right-[20px]' onClick={onCloseModel} type='button'>
                              <X />
                        </button>
                        <div className='flex-1 flex flex-col gap-[16px]'>
                              <div className='w-full h-[80px] flex  gap-[16px]'>
                                    <img src={product.product_thumb_image?.secure_url} className='w-[65px] h-[65px]' alt='product' />
                                    <div className='flex-1 flex flex-col gap-[8px]'>
                                          <p className='w-[180px] xl:w-[250px] text-[14px] truncate'>{product.product_name}</p>
                                          <Rate value={formComment.vote} onChange={onChangeStar} className='flex-1 text-[28px]' />
                                    </div>
                              </div>
                              <div className='w-[calc(100%+32px)] ml-[-16px] bg-gray-200 h-[1px]'></div>
                              <div className='flex flex-col gap-[8px]'>
                                    <p>Điều gì làm bạn hài lòng?</p>
                                    <TextArea value={formComment.content} autoSize={{ minRows: 3 }} onChange={(e) => onChangeContent(e)} />
                              </div>
                              <div className='flex-1 flex gap-[16px] mt-[20px] hover:cursor-pointer' onClick={onClickUpload}>
                                    <div className='w-[70px]'>
                                          <input type='file' hidden ref={inputImageRef} onChange={onChangeFile} />
                                          <div className='w-[65px] h-[65px] flex items-center justify-center border-[1px] border-dashed border-blue-400 hover:cursor-pointer'>
                                                <Camera className=' text-blue-400' />
                                          </div>

                                          {formComment.secure_url && mode === 'UPLOAD' && <button type='button'>Chọn lại</button>}
                                    </div>
                                    <div className=''>
                                          {formComment.secure_url && (
                                                <img src={formComment.secure_url} className='w-[65px] h-[75px]' alt='product' />
                                          )}
                                    </div>
                              </div>
                        </div>
                        <button
                              type='submit'
                              className='w-full h-[40px] flex items-center  justify-center gap-[12px] bg-blue-400 text-white rounded'
                        >
                              Gửi đánh giá
                              {addCommentMutation.isPending && <BoxLoading />}
                        </button>
                  </form>
            </div>
      )
}

export default BoxCommentProduct
