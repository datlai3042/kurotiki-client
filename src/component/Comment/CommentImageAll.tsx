import React, { useEffect, useState } from 'react'
import { CommentImage } from '../../types/comment.type'
import { useQuery } from '@tanstack/react-query'
import CommentService from '../../apis/comment.service'
import BoxModalImage from '../../pages/product/BoxModalImage'
import { TImage } from '../../pages/product/Product'

type TProps = {
      // comment_images: CommentImage[]
      product_id: string
}

const CommentImageAll = (props: TProps) => {
      const { product_id } = props

      const [openModel, setOpenModal] = useState<boolean>(false)
      const [imageUrl, setimageUrl] = useState<{ secure_url: string }[]>([])
      const [imageActive, setImageActive] = useState<string>('')

      const getAllCommentImage = useQuery({
            queryKey: ['get-all-comment-image'],
            queryFn: () => CommentService.getAllCommentImage({ product_id }),
      })

      const comment_images = getAllCommentImage.data?.data.metadata.comment_images

      const onClickOpenModel = (imageActive: string) => {
            setOpenModal(true)
            setImageActive(imageActive)
      }

      useEffect(() => {
            if (getAllCommentImage.isSuccess) {
                  setimageUrl(() => {
                        let newArray = []
                        newArray = getAllCommentImage.data.data.metadata.comment_images.map((img) => img.image)
                        return newArray
                  })
            }
      }, [getAllCommentImage.isSuccess, getAllCommentImage.data])

      useEffect(() => {
            if (openModel) {
                  document.body.style.overflow = 'hidden'
            } else {
                  document.body.style.overflow = 'unset'
            }
      }, [openModel])

      return (
            <>
                  {getAllCommentImage.isSuccess && getAllCommentImage.data.data.metadata.comment_images.length > 0 && (
                        <div className=' my-[25px] min-h-[60px] xl:min-h-[120px] p-[16px_20px] h-max flex flex-col gap-[16px]'>
                              <h4 className='text-[18px] font-semibold text-slate-900'>Tất cả hình ảnh</h4>
                              {getAllCommentImage.isSuccess && (
                                    <div className='relative w-full  flex  gap-[8px] xl:gap-[8px] h-[80px]'>
                                          <div className='w-[80px] h-full  '>
                                                <div className='w-full h-full flex flex-1  gap-[16px]'>
                                                      {comment_images?.map((image) => (
                                                            <img
                                                                  onClick={() => onClickOpenModel(image.image.secure_url)}
                                                                  key={image.image._id}
                                                                  src={image.image.secure_url}
                                                                  className='min-w-[80px] h-[80px] rounded hover:cursor-pointer'
                                                                  alt='comment'
                                                            />
                                                      ))}
                                                </div>
                                          </div>
                                          <div
                                                // style={{ backgroundImage: `url(${comment_images && comment_images[0]?.image.secure_url})` }}
                                                className='relative w-[80px] h-[80px] hover:cursor-pointer rounded '
                                                onClick={() => onClickOpenModel(imageUrl[0].secure_url)}
                                          >
                                                <div
                                                      className='absolute z-[5] min-w-[60px] w-full h-full bg-[rgba(0,0,0,.6)] flex items-center justify-center text-white 
'
                                                >
                                                      (+{comment_images?.length})
                                                </div>
                                                <img
                                                      src={comment_images && comment_images[0]?.image.secure_url}
                                                      alt=''
                                                      className='absolute z-[3] w-full h-full'
                                                />
                                          </div>
                                    </div>
                              )}
                              {openModel && (
                                    <BoxModalImage
                                          secure_url={imageUrl as unknown as TImage[]}
                                          setOpenModal={setOpenModal}
                                          imageActive={imageActive}
                                          transitionDuration={1}
                                    />
                              )}
                        </div>
                  )}
            </>
      )
}

export default CommentImageAll
