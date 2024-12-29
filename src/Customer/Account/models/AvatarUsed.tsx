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

const AvatarUsed = (props: TProps) => {
      const { avatar } = props
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

      const handleDeleteAvatarUsed = (public_id: string, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            // e.currentTarget.parentNode?.children[2].children[1].classList.replace('hidden', 'inline-block')
            deleteAvatarUsed.mutate(public_id)
            setShowLoading(true)
      }

      useEffect(() => {
            if (deleteAvatarUsed.isSuccess) {
                  dispatch(fetchUser({ user: deleteAvatarUsed.data.data.metadata.user }))
                  setShowLoading(false)
            }
      }, [deleteAvatarUsed.isSuccess, dispatch, deleteAvatarUsed.data?.data.metadata.user])
      return (
            <div className='w-full flex flex-col gap-[8px]'>
                  <div className='flex justify-between '>
                        <p className=' bg-slate-700 text-white min-w-[60px] px-[6px] py-[2px]'>
                              {avatar.date_update ? convertDateToString(avatar.date_update) : 'none'}
                        </p>
                        <div
                              onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => handleDeleteAvatarUsed(avatar.public_id, e)}
                              className=' gap-[8px]  text-[#fff] rounded-md  min-w-[70px] h-[30px] p-[4px] border-[1px]  bg-red-700 hover:border-red-700  flex justify-center items-center z-[2]'
                        >
                              <span className=''>Xóa ảnh</span>
                              {showLoading && (
                                    <span
                                          className='inline-block  h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]'
                                          role='status'
                                    ></span>
                              )}
                        </div>
                  </div>
                  <img src={avatar?.secure_url} loading='lazy' className='w-full min-h-full rounded-tr-md' alt='avatar_used[]' />
            </div>
      )
}

export default AvatarUsed
