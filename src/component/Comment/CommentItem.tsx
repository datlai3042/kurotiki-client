import { Rate } from 'antd'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import BoxModalImage from '../../pages/product/BoxModalImage'
import { TImage } from '../../pages/product/Product'
import { RootState } from '../../store'
import { Comment } from '../../types/comment.type'
import { UserResponse } from '../../types/user.type'
import { renderLevelVote } from '../../utils/comment.util'
import { convertDateToString, convertDateToStringFull } from '../../utils/date.utils'

type TProps = {
      comment: Comment
}

const CommentItem = (props: TProps) => {
      const { comment } = props
      const [openModal, setOpenModal] = useState<boolean>(false)

      const user = useSelector((state: RootState) => state.authentication.user) as UserResponse
      return (
            <div className='relative flex flex-col xl:flex-row min-h-[250px] h-max py-[32px] xl:py-[16px] border-t-[2px] border-[rgb(245_245_250)] gap-[16px] xl:gap-0'>
                  <div className='w-full  min-h-[50px] flex flex-row  gap-[10px]'>
                        <img
                              src={comment.comment_user_id?.avatar?.secure_url || comment.comment_user_id?.avatar_url_default}
                              className='w-[40px] h-[40px] rounded-full'
                              alt=''
                        />

                        <div className='flex flex-col gap-[6px] text-[14px]'>
                              <p className='flex flex-row gap-[10px]  font-semibold'>
                                    <span className='text-slate-900'>
                                          {comment.comment_user_id.fullName ||
                                                comment.comment_user_id.nickName ||
                                                comment.comment_user_id.email}
                                    </span>
                                    {user?._id === comment.comment_user_id._id && (
                                          <span className='text-slate-500'>(Nhận xét của bạn)</span>
                                    )}
                              </p>
                              <p className='text-[12px]'>Đã tham gia {convertDateToString(comment.comment_user_id.createdAt)}</p>
                        </div>
                  </div>
                  <div className='w-full xl:w-[65%] flex  flex-col gap-[24px]'>
                        <div className='flex flex-col xl:flex-row xl:items-center gap-[8px] '>
                              <Rate disabled value={comment.comment_vote} />
                              <span className='text-[15px] text-slate-600 font-bold'>
                                    {renderLevelVote({ vote: comment.comment_vote })}
                              </span>
                        </div>
                        <div className='w-full min-h-[20px] h-max break-words text-[11px] text-gray-500'>
                              {comment.comment_content ? comment.comment_content : 'Không nhận xét'}
                        </div>
                        {comment.comment_image.length > 0 && (
                              <div className='w-full min-h-[80px] h-max flex flex-col gap-[12px]'>
                                    <img
                                          src={comment.comment_image[0].secure_url}
                                          className='w-[80px] h-[80px] rounded-md hover:cursor-pointer'
                                          alt='comment'
                                          onClick={() => setOpenModal(true)}
                                    />
                              </div>
                        )}
                        <p className='text-gray-500'>Đã đăng vào {convertDateToStringFull(comment.comment_date)}</p>
                  </div>

                  {openModal && (
                        <BoxModalImage
                              setOpenModal={setOpenModal}
                              secure_url={[comment.comment_image[0] as unknown as TImage]}
                              imageActive={comment.comment_image[0].public_id}
                        />
                  )}
            </div>
      )
}

export default CommentItem
