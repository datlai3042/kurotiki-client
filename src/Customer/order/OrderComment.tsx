import { keepPreviousData, useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import CommentService from '../../apis/comment.service'
import OrderCommentSkeleton from './OrderCommentSkeleton'
import OrderCommentItem from './OrderCommentItem'
import { SLATE_TIME_COMMENT_ME_ALL } from '../../constant/staleTime'
import { MessageSquareMore, Star } from 'lucide-react'

const LIMIT = 2

const OrderComment = () => {
      const [page, setPage] = useState(1)

      const getMeAllComment = useQuery({
            queryKey: ['/v1/api/comment/get-me-all-comment', page],
            queryFn: () => CommentService.getMeAllComment({ page, limit: LIMIT }),
            placeholderData: keepPreviousData,
            staleTime: SLATE_TIME_COMMENT_ME_ALL,
      })

      const totalPage = Math.ceil((getMeAllComment.data?.data?.metadata?.total || 0) / LIMIT)

      const styleEffect = {
            onActive: (check: boolean) => {
                  if (check) {
                        return 'border-blue-500 bg-blue-500 text-white shadow-sm'
                  }

                  return 'border-slate-200 bg-transparent text-slate-500 hover:border-blue-400 hover:text-blue-500'
            },
      }

      return (
            <div className='relative min-h-[600px] w-full rounded-2xl  bg-color-section-theme text-text-theme '>
                  {/* Header */}
                  <div className='flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-color-input)] px-5 py-4'>
                        <div className='flex items-center gap-3'>
                              <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500'>
                                    <Star size={19} strokeWidth={1.8} />
                              </div>

                              <div>
                                    <h3 className='text-base font-semibold text-text-theme'>
                                          Các đánh giá của bạn
                                    </h3>

                                    <p className='mt-1 text-xs text-slate-500'>
                                          Xem lại những sản phẩm bạn đã đánh giá
                                    </p>
                              </div>
                        </div>

                        <div className='flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-500'>
                              <MessageSquareMore size={15} />
                              <span>
                                    {getMeAllComment.data?.data?.metadata?.total || 0} đánh giá
                              </span>
                        </div>
                  </div>

                  {/* Content */}
                  <div className='min-h-[470px]'>
                        {getMeAllComment.isSuccess &&
                              getMeAllComment.data.data.metadata.comments.map((commet) => (
                                    <div
                                          key={commet._id}
                                          className='border-b border-[var(--border-color-input)] px-5 py-5 last:border-b-0'
                                    >
                                          <OrderCommentItem comment={commet} />
                                    </div>
                              ))}

                        {(getMeAllComment.data?.data.metadata.comments.length === 0 ||
                              getMeAllComment.data?.data.metadata.total === 0) && (
                              <div className='flex min-h-[420px] flex-col items-center justify-center px-6 text-center'>
                                    <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500'>
                                          <Star size={28} strokeWidth={1.7} />
                                    </div>

                                    <h4 className='mt-4 text-sm font-semibold text-text-theme'>
                                          Chưa có đánh giá nào
                                    </h4>

                                    <p className='mt-1 max-w-[340px] text-sm leading-6 text-slate-500'>
                                          Những đánh giá bạn đã gửi cho sản phẩm sẽ xuất hiện tại đây.
                                    </p>
                              </div>
                        )}

                        {getMeAllComment.isPending && (
                              <div className='px-5 py-5'>
                                    <OrderCommentSkeleton />
                              </div>
                        )}
                  </div>

                  {/* Pagination */}
                  {getMeAllComment.isSuccess && totalPage > 0 && (
                        <div className='flex items-center justify-center gap-2 border-t border-[var(--border-color-input)] px-5 py-4'>
                              {Array(totalPage)
                                    .fill(0)
                                    .map((_, index) => (
                                          <button
                                                key={index}
                                                className={`${styleEffect.onActive(
                                                      page === index + 1,
                                                )} flex h-9 min-w-9 items-center justify-center rounded-xl border px-3 text-sm font-medium transition-all`}
                                                onClick={() => {
                                                      setPage(index + 1)
                                                }}
                                          >
                                                {index + 1}
                                          </button>
                                    ))}
                        </div>
                  )}
            </div>
      )
}

export default OrderComment