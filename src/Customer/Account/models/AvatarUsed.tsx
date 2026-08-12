import { Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Account from '../../../apis/account.service'
import { useDispatch } from 'react-redux'
import { fetchUser } from '../../../Redux/authenticationSlice'
import { convertDateToString } from '../../../utils/date.utils'
import { UserAvatar } from '../../../types/user.type'

type TProps = {
      avatar: UserAvatar
}

const AvatarUsed = ({ avatar }: TProps) => {
      const dispatch = useDispatch()
      const queryClient = useQueryClient()
      const [showLoading, setShowLoading] = useState(false)

      const deleteAvatarUsed = useMutation({
            mutationKey: ['delete-avatar-used'],
            mutationFn: (public_id: string) => Account.deleteAvatarUsed(public_id),
            onSuccess: () => {
                  queryClient.invalidateQueries({ queryKey: ['avatar-used'] })
            },
      })

      const handleDeleteAvatarUsed = () => {
            if (showLoading || deleteAvatarUsed.isPending) return

            setShowLoading(true)
            deleteAvatarUsed.mutate(avatar.public_id)
      }

      useEffect(() => {
            if (deleteAvatarUsed.isSuccess) {
                  dispatch(
                        fetchUser({
                              user: deleteAvatarUsed.data.data.metadata.user,
                        }),
                  )
                  setShowLoading(false)
            }
      }, [
            deleteAvatarUsed.isSuccess,
            dispatch,
            deleteAvatarUsed.data?.data.metadata.user,
      ])

      useEffect(() => {
            if (deleteAvatarUsed.isError) {
                  setShowLoading(false)
            }
      }, [deleteAvatarUsed.isError])

      return (
            <div
                  className='
                        group
                        relative
                        flex
                        w-full
                        flex-col
                        overflow-hidden
                        rounded-[14px]
                        border
                        border-[var(--border-color-input)]
                        bg-color-section-theme
                        shadow-sm
                        transition
                        hover:-translate-y-[1px]
                        hover:shadow-md
                  '
            >
                  <div className='relative aspect-square w-full overflow-hidden bg-black/5'>
                        <img
                              src={avatar?.secure_url}
                              loading='lazy'
                              className='h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]'
                              alt='avatar_used[]'
                        />

                        <div className='pointer-events-none absolute inset-x-0 bottom-0 h-[34%] bg-gradient-to-t from-black/55 to-transparent opacity-80' />

                        <span
                              className='
                                    absolute
                                    bottom-[10px]
                                    left-[10px]
                                    rounded-full
                                    bg-black/55
                                    px-[9px]
                                    py-[4px]
                                    text-[11px]
                                    font-medium
                                    text-white
                                    backdrop-blur-sm
                              '
                        >
                              {avatar.date_update
                                    ? convertDateToString(avatar.date_update)
                                    : 'Không rõ ngày'}
                        </span>
                  </div>

                  <div className='flex items-center justify-between gap-[10px] p-[10px] sm:p-[12px]'>
                        <div className='min-w-0'>
                              <p className='text-[12px] font-medium text-text-theme sm:text-[13px]'>
                                    Ảnh đại diện cũ
                              </p>

                              <p className='mt-[2px] truncate text-[10px] text-slate-400 sm:text-[11px]'>
                                    Bạn đã từng sử dụng ảnh này
                              </p>
                        </div>

                        <button
                              type='button'
                              onClick={handleDeleteAvatarUsed}
                              disabled={showLoading || deleteAvatarUsed.isPending}
                              aria-label='Xóa ảnh'
                              className='
                                    flex
                                    h-[34px]
                                    min-w-[34px]
                                    shrink-0
                                    items-center
                                    justify-center
                                    gap-[6px]
                                    rounded-[9px]
                                    border
                                    border-red-500/30
                                    bg-red-500/10
                                    px-[9px]
                                    text-[12px]
                                    font-medium
                                    text-red-400
                                    transition
                                    hover:border-red-500/50
                                    hover:bg-red-500
                                    hover:text-white
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60

                                    sm:min-w-[82px]
                              '
                        >
                              {showLoading || deleteAvatarUsed.isPending ? (
                                    <span
                                          className='inline-block h-[16px] w-[16px] animate-spin rounded-full border-2 border-solid border-current border-r-transparent'
                                          role='status'
                                          aria-label='Đang xóa'
                                    />
                              ) : (
                                    <>
                                          <Trash2 size={15} />
                                          <span className='hidden sm:inline'>Xóa ảnh</span>
                                    </>
                              )}
                        </button>
                  </div>
            </div>
      )
}

export default AvatarUsed