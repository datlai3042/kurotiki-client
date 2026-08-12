import { keepPreviousData, useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import CommentService from '../../apis/comment.service'
import CommentItem from './CommentItem'
import CommentSketeton from './CommentSketeton'
import CommentFilter from './CommentFilter'
import { useDispatch, useSelector } from 'react-redux'
import { fetchComment } from '../../Redux/comment.slice'
import { RootState } from '../../store'
import Empty from '../../component/Content/assets/img/empty.webp'
import { MessageCircleOff } from 'lucide-react'
type TProps = {
      product_id: string
}

export const LIMIT = 2
export const STALE_TIME = 60 * 1000 * 5
const Comment = (props: TProps) => {
      const { product_id } = props
      const [page, setPage] = useState<number>(1)
      const [pageFilter, setPageFilter] = useState<number>(1)
      const dispatch = useDispatch()
      const comments = useSelector((state: RootState) => state.commentSlice.comments)
      const total = useSelector((state: RootState) => state.commentSlice.total)
      const [onModeFilter, setOnModeFilter] = useState<boolean>(false)

      const getAllCommentQuery = useQuery({
            queryKey: ['get-all-comment', product_id, page],
            queryFn: () => CommentService.getAllCommentProduct({ product_id, limit: LIMIT, page }),
            enabled: onModeFilter === false,
            placeholderData: keepPreviousData,
            staleTime: STALE_TIME,
      })

      //product_id, page,vote,image, time

      useEffect(() => {
            if (getAllCommentQuery.isSuccess) {
                  const { comments, total } = getAllCommentQuery.data.data.metadata
                  dispatch(fetchComment({ comments, total: Math.ceil(total / LIMIT) }))
            }
      }, [getAllCommentQuery.isSuccess, getAllCommentQuery.data?.data.metadata, onModeFilter, dispatch])

      const styleEffect = {
            onActive: (check: boolean) => {
                  if (check) return ' bg-color-main text-white   rounded-full'
                  return ' bg-transparent text-slate-500   rounded-full hover:bg-blue-200 hover:text-white'
            },
      }

      return (
            <div className='relative h-full flex flex-col bg-color-section-theme flex flex-col  px-[20px]'>
                  <CommentFilter
                        product_id={product_id}
                        page={pageFilter}
                        setOnModeFilter={setOnModeFilter}
                        setPage={setPageFilter}
                        onModeFilter={onModeFilter}
                  />
                  <div className='w-full flex flex-col gap-[50px] mt-[10px]'>
                        {getAllCommentQuery.isSuccess && comments.map((comment) => <CommentItem key={comment._id} comment={comment} />)}
                  </div>
                  {comments.length === 0 && !getAllCommentQuery.isPending && (
                        <div className='flex flex-1 min-h-[320px] w-full items-center justify-center py-[30px]'>
                              <div
                                    className='
                        flex
                        w-full
                        max-w-[440px]
                        flex-col
                        items-center
                        justify-center
                        rounded-[16px]
                        bg-color-section-theme
                        px-[24px]
                        py-[36px]
                        text-center
                  '
                              >
                                    <div className='mb-[16px] flex h-[64px] w-[64px] items-center justify-center rounded-full bg-blue-500/10'>
                                          <MessageCircleOff size={30} strokeWidth={1.8} className='text-blue-400' />
                                    </div>

                                    <h3 className='text-[17px] font-semibold text-text-theme'>Không có bình luận phù hợp</h3>

                                    <p className='mt-[6px] max-w-[320px] text-[13px] leading-[20px] text-slate-400'>
                                          Chưa có đánh giá nào phù hợp với bộ lọc hiện tại. Hãy thử chọn mức đánh giá khác hoặc bỏ bớt điều
                                          kiện lọc.
                                    </p>
                              </div>
                        </div>
                  )}

                  {getAllCommentQuery.isPending && (
                        <>
                              <CommentSketeton />
                              <CommentSketeton />
                        </>
                  )}
                  <div className='absolute bottom-[-10px] xl:bottom-0 right-0 flex gap-[20px] px-[20px] '>
                        {getAllCommentQuery.isSuccess &&
                              Array(total)
                                    .fill(0)
                                    .map((_, index) => (
                                          <button
                                                key={index}
                                                className={`${styleEffect.onActive(
                                                      onModeFilter === false ? page === index + 1 : pageFilter === index + 1,
                                                )} w-[20px] h-[20px] xl:w-[30px] xl:h-[30px] flex items-center justify-center transition-all `}
                                                onClick={() => {
                                                      onModeFilter === false ? setPage(index + 1) : setPageFilter(index + 1)
                                                }}
                                          >
                                                {index + 1}
                                          </button>
                                    ))}
                  </div>
            </div>
      )
}

export default Comment
