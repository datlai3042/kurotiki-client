import React, { useEffect, useState } from 'react'
import { Comment } from '../../types/comment.type'
import { convertDateToString, convertDateToStringFull } from '../../utils/date.utils'
import { Rate } from 'antd'
import { renderLevelVote } from '../../utils/comment.util'
import BoxModalImage from '../../pages/product/BoxModalImage'
import { TImage } from '../../pages/product/Product'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { UserResponse } from '../../types/user.type'

type TProps = {
      comment: Comment
}

const CommentItem = (props: TProps) => {
      const { comment } = props
      const [openModal, setOpenModal] = useState<boolean>(false)

      const user = useSelector((state: RootState) => state.authentication.user) as UserResponse
      return (
            <>
                  <div className='flex justify-between gap-[24px]'>
                        <div>
                              <img
                                    src={
                                          comment.comment_user_id?.avatar?.secure_url ||
                                          comment.comment_user_id?.avatar_default_url ||
                                          comment.comment_user_id?.avatar_url_default
                                    }
                                    className='w-[40px] h-[40px] rounded-full'
                                    alt=''
                              />
                        </div>

                        <div className='flex flex-col gap-5 flex-1'>
                              <div className='flex flex-col gap-1.5 text-[14px]'>
                                    <p className='flex flex-row gap-[10px] text-[15px]  font-semibold'>
                                          <span className=''>
                                                {comment.comment_user_id.fullName ||
                                                      comment.comment_user_id.nickName ||
                                                      comment.comment_user_id.email}
                                          </span>
                                          {user?._id === comment.comment_user_id._id && (
                                                <span className='text-slate-500'>(Nhận xét của bạn)</span>
                                          )}
                                    </p>
                                    <p className='text-[13px]'>Đã tham gia {convertDateToString(comment.comment_user_id.createdAt)}</p>
                                    <div className='flex flex-col xl:flex-row xl:items-center gap-[8px] '>
                                          <div className='text-yellow-500 flex items-center font-semibold gap-[3px]'>
                                                <span className='text-[13px]'>{comment.comment_vote}</span>
                                                <Rate defaultValue={1} count={1} className='text-[14px] ' />
                                          </div>
                                          <span className='text-[13px] text-slate-600 font-bold'>
                                                {renderLevelVote({ vote: comment.comment_vote })}
                                          </span>
                                    </div>
                                    <div className='w-full min-h-[20px] h-max break-words text-[13px] text-gray-500'>
                                          {comment.comment_content ? comment.comment_content : 'Không nhận xét'}
                                    </div>
                                    {comment.comment_image.length > 0 && (
                                          <div className='w-full min-h-[80px] h-max flex flex-col gap-[12px]'>
                                                <img
                                                      src={comment.comment_image[0].secure_url}
                                                      className='w-[80px] h-[80px] rounded-md hover:cursor-pointer object-contain'
                                                      alt='comment'
                                                      onClick={() => setOpenModal(true)}
                                                />
                                          </div>
                                    )}
                              </div>
                        </div>

                        <div>
                              <p className='text-gray-500'>{convertDateToStringFull(comment.comment_date)}</p>
                        </div>

                        {openModal && (
                              <BoxModalImage
                                    setOpenModal={setOpenModal}
                                    secure_url={[comment.comment_image[0] as unknown as TImage]}
                                    imageActive={comment.comment_image[0].public_id}
                              />
                        )}
                  </div>
            </>
      )
}

export default CommentItem
