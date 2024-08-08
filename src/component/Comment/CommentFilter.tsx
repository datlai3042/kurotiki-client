import { useMutation } from '@tanstack/react-query'
import { Check } from 'lucide-react'
import React, { SetStateAction, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import CommentService from '../../apis/comment.service'
import { fetchComment } from '../../Redux/comment.slice'
import { LIMIT } from './Comment'

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
      //console.log(([^)]+))

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

                  return 'bg-transparent border-gray-400 text-slate-600'
            },
      }

      return (
            <div className='w-full min-h-[90px] h-max  flex flex-col gap-[20px] bg-[#ffffff] border-t-[2px] border-[rgb(245_245_250)] py-[16px]'>
                  <p className='ml-[2px] text-[15px] text-slate-700 font-medium'>Lọc theo</p>
                  <div className='w-full flex overflow-x-scroll scroll-common items-center justify-between gap-[14px] xl:gap-0'>
                        <button
                              className={`${styleEffect.onActive(
                                    filterVote.isSelectTime,
                              )} min-w-[120px] h-[36px] flex items-center justify-center gap-[6px] p-[6px_8px]  w-max border-[1px] rounded-[999px]`}
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
                              )} min-w-[120px] h-[36px]  flex items-center justify-center gap-[6px] p-[6px_8px] w-max border-[1px] rounded-[999px]`}
                              onClick={() => {
                                    onSetActive('isSelectImage')
                              }}
                        >
                              {filterVote.isSelectImage && <Check size={18} />}
                              Có hình ảnh
                        </button>
                        <button
                              className={`${styleEffect.onActive(
                                    storege.includes(5),
                              )} min-w-[120px] h-[36px]  flex items-center justify-center gap-[6px] p-[6px_8px] w-max border-[1px] rounded-[999px]`}
                              onClick={() => {
                                    onSetFilterVote(5)
                              }}
                        >
                              {storege.includes(5) && <Check size={18} />}5 sao
                        </button>
                        <button
                              className={`${styleEffect.onActive(
                                    storege.includes(4),
                              )} min-w-[120px] h-[36px]  flex items-center justify-center gap-[6px] p-[6px_8px] w-max border-[1px] rounded-[999px]`}
                              onClick={() => {
                                    onSetFilterVote(4)
                              }}
                        >
                              {storege.includes(4) && <Check size={18} />}4 sao
                        </button>
                        <button
                              className={`${styleEffect.onActive(
                                    storege.includes(3),
                              )} min-w-[120px] h-[36px]  flex items-center justify-center gap-[6px] p-[6px_8px] w-max border-[1px] rounded-[999px]`}
                              onClick={() => {
                                    onSetFilterVote(3)
                              }}
                        >
                              {storege.includes(3) && <Check size={18} />}3 sao
                        </button>
                        <button
                              className={`${styleEffect.onActive(
                                    storege.includes(2),
                              )} min-w-[120px] h-[36px]  flex items-center justify-center gap-[6px] p-[6px_8px] w-max border-[1px] rounded-[999px]`}
                              onClick={() => {
                                    onSetFilterVote(2)
                              }}
                        >
                              {storege.includes(2) && <Check size={18} />}2 sao
                        </button>
                        <button
                              className={`${styleEffect.onActive(
                                    storege.includes(1),
                              )} min-w-[120px] h-[36px]  flex items-center justify-center gap-[6px] p-[8px_6px] w-max border-[1px] rounded-[999px]`}
                              onClick={() => {
                                    onSetFilterVote(1)
                              }}
                        >
                              {storege.includes(1) && <Check size={18} />}1 sao
                        </button>
                  </div>
            </div>
      )
}

export default CommentFilter
