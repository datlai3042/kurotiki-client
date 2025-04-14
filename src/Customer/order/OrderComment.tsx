import { keepPreviousData, useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import CommentService from '../../apis/comment.service'
import OrderCommentSkeleton from './OrderCommentSkeleton'
import OrderCommentItem from './OrderCommentItem'
import { SLATE_TIME_COMMENT_ME_ALL } from '../../constant/staleTime'

const LIMIT = 2

const OrderComment = () => {
      const [page, setPage] = useState<number>(1)

      const getMeAllComment = useQuery({
            queryKey: ['/v1/api/comment/get-me-all-comment', page],
            queryFn: () => CommentService.getMeAllComment({ page, limit: LIMIT }),
            placeholderData: keepPreviousData,
            staleTime: SLATE_TIME_COMMENT_ME_ALL,
      })

      const totalPage = Math.ceil((getMeAllComment.data?.data?.metadata?.total || 0) / LIMIT)

      const styleEffect = {
            onActive: (check: boolean) => {
                  if (check) return ' bg-blue-500 text-white border-[1px]  rounded-full'
                  return ' bg-transparent text-slate-500 border-[1px] border-transparent  rounded-full'
            },
      }

      return (
            <div className='relative w-full min-h-[600px] h-max px-[30px] bg-color-section-theme text-text-theme pt-[30px] pb-[70px]'>
                  {getMeAllComment.isSuccess &&
                        getMeAllComment.data.data.metadata.comments.map((commet) => <OrderCommentItem key={commet._id} comment={commet} />)}

                  {(getMeAllComment.data?.data.metadata.comments.length === 0 || getMeAllComment.data?.data.metadata.total === 0) && (
                        <div>Không tìm thấy dữ liệu</div>
                  )}

                  {getMeAllComment.isSuccess && (
                        <div className='absolute bottom-[20px] right-[20px] flex gap-[16px]'>
                              {Array(totalPage)
                                    .fill(0)
                                    .map((_, index) => (
                                          <button
                                                key={index}
                                                className={`${styleEffect.onActive(
                                                      page === index + 1,
                                                )} w-[20px] h-[20px] xl:w-[30px] xl:h-[30px] flex items-center justify-center transition-all `}
                                                onClick={() => {
                                                      setPage(index + 1)
                                                }}
                                          >
                                                {index + 1}
                                          </button>
                                    ))}
                        </div>
                  )}

                  {getMeAllComment.isPending && <OrderCommentSkeleton />}
            </div>
      )
}

export default OrderComment
