import { useMutation } from '@tanstack/react-query'
import { Check, MoreHorizontal } from 'lucide-react'
import React, { SetStateAction, useCallback, useEffect, useState } from 'react'
import CommentService, { GetAllCommentParam } from '../../apis/comment.service'
import { fetchComment } from '../../Redux/comment.slice'
import { useDispatch } from 'react-redux'
import { LIMIT } from './Comment'
import { Rate } from 'antd'
import BoxResponsiveOverflow, { BoxResponsiveFlowClose } from '../BoxUi/BoxResponsiveFlow'

type FilterVote = {
      isSelectImage: boolean
      isSelectTime: boolean
      isMinVote: number | undefined
      isMaxVote: number | undefined
}

const defaultFilter: FilterVote = {
      isSelectTime: false,
      isSelectImage: false,
      isMinVote: 0,
      isMaxVote: undefined,
}

type TProps = {
      product_id: string
      page: number
      setOnModeFilter: React.Dispatch<SetStateAction<boolean>>
      onModeFilter: boolean
      setPage: React.Dispatch<React.SetStateAction<number>>
}

const CommentFilter = (props: TProps) => {
      const { product_id, page, onModeFilter, setOnModeFilter, setPage } = props

      const [filterVote, setFilterVote] = useState<FilterVote>(defaultFilter)
      const [storege, setStorege] = useState<number[]>([])
      const dispatch = useDispatch()

      const filterImageMutation = useMutation({
            mutationKey: ['/v1/api/comment/get-all-comment-has-image', page, product_id],
            mutationFn: ({ product_id, minVote, maxVote }: { product_id: string; minVote: number; maxVote: number }) =>
                  CommentService.geAllCommentHasImage({ product_id, page, limit: LIMIT, minVote, maxVote }),
            onSuccess: (axiosReponse) => {
                  const { comments, total } = axiosReponse.data.metadata
                  dispatch(fetchComment({ comments, total: Math.ceil(total / LIMIT) }))
            },
      })

      const filterLevelVoteMutation = useMutation({
            mutationKey: ['/v1/api/comment/get-all-comment-follow-level', page, product_id],
            mutationFn: ({ product_id, minVote, maxVote }: { product_id: string; minVote: number; maxVote: number }) =>
                  CommentService.getAllCommentFollowLevel({ product_id, minVote, maxVote, page, limit: LIMIT }),

            onSuccess: (axiosReponse) => {
                  const { comments, total } = axiosReponse.data.metadata
                  dispatch(fetchComment({ comments, total: Math.ceil(total / LIMIT) }))
            },
      })

      const onSetActive = (name: keyof FilterVote) => {
            let previousValue = filterVote[name]
            setPage(1)
            setFilterVote((prev) => ({ ...prev, [name]: !previousValue }))
            if (name === 'isSelectImage' && !previousValue) {
                  filterImageMutation.mutate({ product_id, minVote: filterVote.isMinVote || 1, maxVote: filterVote.isMaxVote || 5 })
                  return
            }
      }

      const onSetFilterVote = (vote: number) => {
            setPage(1)

            if (storege.includes(vote)) {
                  setStorege((prev) => {
                        let newArray = prev.filter((v) => v !== vote)
                        newArray.sort((a, b) => b - a)
                        setFilterVote((prev) => ({ ...prev, isMaxVote: newArray[0], isMinVote: newArray[newArray.length - 1] }))

                        if (!(vote > newArray[newArray.length - 1] && vote < newArray[0])) {
                              filterLevelVoteMutation.mutate({ product_id, maxVote: newArray[0], minVote: newArray[newArray.length - 1] })
                        }

                        return newArray
                  })
                  return
            }

            setStorege((prev) => {
                  let newArray = prev
                  newArray.push(vote)
                  newArray.sort((a, b) => b - a)

                  if (!(vote > newArray[newArray.length - 1] && vote < newArray[0])) {
                        filterLevelVoteMutation.mutate({ product_id, maxVote: newArray[0], minVote: newArray[newArray.length - 1] })
                  }
                  setFilterVote((prev) => ({ ...prev, isMaxVote: newArray[0], isMinVote: newArray[newArray.length - 1] }))
                  return newArray
            })
      }

      // }, [page])

      useEffect(() => {
            if (onModeFilter) {
                  filterLevelVoteMutation.mutate({ product_id, maxVote: storege[0], minVote: storege[storege.length - 1] })
            }
      }, [page])

      useEffect(() => {
            const { isMaxVote, isMinVote, isSelectImage, isSelectTime } = filterVote
            if (isMaxVote || isMinVote || isSelectImage || isSelectTime) {
                  setOnModeFilter(true)
            } else {
                  setOnModeFilter(false)
            }
      }, [filterVote])

      const styleEffect = {
            onActive: (isActive: boolean) => {
                  if (isActive) return 'bg-blue-50 border-blue-600 text-blue-600'

                  return 'bg-transparent border-[var(--border-color-input)] text-text-theme'
            },
      }
      const categories = [
            {
                  id: 1,
            },
            {
                  id: 2,
            },
            {
                  id: 3,
            },
            {
                  id: 4,
            },
            {
                  id: 5,
            },
      ]
      return (
            <div className='w-full min-h-[90px] h-max  flex flex-col gap-[10px] bg-color-section-theme text-text-theme border-t-[2px] border-[var(--border-color-input)] py-[16px]'>
                  <p className='ml-[2px] text-[15px] font-semibold'>Lọc bình luận</p>
                  <div className='flex w-full items-center gap-[12px] overflow-hidden'>
                        <button
                              className={`${styleEffect.onActive(
                                    filterVote.isSelectTime,
                              )} flex h-[36px] min-w-[90px] shrink-0 items-center justify-center gap-[6px] rounded-full border-[1px] p-[6px] hover:bg-color-main hover:text-white md:min-w-[120px]`}
                              onClick={() => {
                                    onSetActive('isSelectTime')
                              }}
                        >
                              {filterVote.isSelectTime && <Check size={18} />}
                              Mới nhất
                        </button>

                        <button
                              className={`${styleEffect.onActive(
                                    filterVote.isSelectImage,
                              )} flex h-[36px] min-w-[105px] shrink-0 items-center justify-center gap-[6px] rounded-full border-[1px] p-[6px] hover:bg-color-main hover:text-white md:min-w-[120px]`}
                              onClick={() => {
                                    onSetActive('isSelectImage')
                              }}
                        >
                              {filterVote.isSelectImage && <Check size={18} />}
                              Có hình ảnh
                        </button>

                        {/* QUAN TRỌNG:
          BoxResponsiveOverflow chỉ được sử dụng phần width còn lại
      */}
                        <div className='min-w-0 flex-1 overflow-hidden'>
                              <BoxResponsiveOverflow
                                    itemContainerClassName='justify-normal'
                                    items={categories}
                                    gap={14}
                                    className='w-full'
                                    itemClassName='shrink-0'
                                    getKey={(category) => category.id}
                                    renderItem={(category) => (
                                          <button
                                                className={`${styleEffect.onActive(
                                                      storege.includes(category.id),
                                                )} flex h-[36px] w-[60px] min-w-[60px] items-center justify-center gap-[4px] rounded-full border-[1px] p-[6px] hover:bg-color-main hover:text-white`}
                                                onClick={() => {
                                                      onSetFilterVote(category.id)
                                                }}
                                          >
                                                {storege.includes(category.id) && <Check size={16} />}

                                                <div className='flex items-center gap-[3px] font-semibold text-yellow-500'>
                                                      <span className='text-[14px]'>{category.id}</span>

                                                      <Rate defaultValue={1} count={1} disabled className='text-[14px] text-yellow-500' />
                                                </div>
                                          </button>
                                    )}
                                    renderMore={({ open, hiddenCount }: any) => (
                                          <button
                                                type='button'
                                                onClick={open}
                                                className='flex h-[36px] w-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-full border border-dashed border-blue-400 bg-blue-50 text-blue-500 dark:border-blue-500/50 dark:bg-blue-500/10'
                                                aria-label={`Xem thêm ${hiddenCount} bộ lọc`}
                                          >
                                                <MoreHorizontal size={19} />
                                          </button>
                                    )}
                                    renderExpanded={({ items, close }: any) => (
                                          <BoxResponsiveFlowClose
                                                open
                                                onClose={close}
                                                title={
                                                      <div>
                                                            <h3 className='text-base font-bold dark:text-white'>Lọc theo đánh giá</h3>

                                                            <p className='mt-0.5 text-xs text-slate-500'>Chọn mức sao muốn hiển thị</p>
                                                      </div>
                                                }
                                          >
                                                <div className='grid grid-cols-3 gap-x-4 gap-y-4'>
                                                      {items.map((category: (typeof categories)[0]) => (
                                                            <button
                                                                  key={category.id}
                                                                  className={`${styleEffect.onActive(
                                                                        storege.includes(category.id),
                                                                  )} flex h-[36px] items-center justify-center gap-[6px] rounded-full border-[1px] p-[8px_6px] hover:bg-color-main hover:text-white`}
                                                                  onClick={() => {
                                                                        onSetFilterVote(category.id)
                                                                  }}
                                                            >
                                                                  {storege.includes(category.id) && <Check size={18} />}

                                                                  <div className='flex items-center gap-[3px] font-semibold text-yellow-500'>
                                                                        <span className='text-[14px]'>{category.id}</span>

                                                                        <Rate
                                                                              defaultValue={1}
                                                                              count={1}
                                                                              disabled
                                                                              className='text-[14px] text-yellow-500'
                                                                        />
                                                                  </div>
                                                            </button>
                                                      ))}
                                                </div>
                                          </BoxResponsiveFlowClose>
                                    )}
                              />
                        </div>
                  </div>
            </div>
      )
}

export default CommentFilter
