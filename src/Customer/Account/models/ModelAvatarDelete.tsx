import React, { SetStateAction, useEffect } from 'react'
import { TAvatarActions } from '../../../reducer/customer.reducer'
import { useMutation } from '@tanstack/react-query'
import { UserResponse } from '../../../types/user.type'
import { ShopResponse } from '../../../types/shop.type'
import { TResponseApi } from '../../../types/axiosResponse'
import { AxiosResponse } from 'axios'
import { useDispatch } from 'react-redux'
import { addOneToastWarning } from '../../../Redux/toast'


export type ResultApiDeleteAvatar = { user: UserResponse } | { shop: ShopResponse }
export type ResultApiUser = { user: UserResponse }
type TProps<T = ResultApiDeleteAvatar> = {
      modeDispatch: React.Dispatch<TAvatarActions>

      setModelAvatar?: React.Dispatch<SetStateAction<boolean>>
      setModelAvatarDelete?: React.Dispatch<SetStateAction<boolean>>

      AvatarSource: { avatar: string; avatar_default: string }
      onDeleteKey: string
      ModeParent: 'SHOP' | 'USER'

      onDeleteFn: () => Promise<AxiosResponse<TResponseApi<{ user: UserResponse } | { shop: ShopResponse }>>>
      onSuccessDelete: (
            data: // dispatch(fetchUser({ user: deleteAvatar.data.data.metadata.user }))

            { mode: 'USER'; user: UserResponse } | { mode: 'SHOP'; shop: ShopResponse },
      ) => void
}

// () => api
const ModelAvatarDelete = (props: TProps) => {
      const dispatch = useDispatch()
      const { modeDispatch, AvatarSource, onSuccessDelete, onDeleteKey, onDeleteFn, ModeParent } = props
      const deleteAvatar = useMutation({ mutationKey: [onDeleteKey], mutationFn: () => onDeleteFn() })

      const handleCancelActionDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            modeDispatch({ type: 'CLOSE_MODE_AVATAR_DELETE', payload: { modeAvatarDelete: false, boxModeAvatar: false } })
      }

      const handleDeleteAvatar = () => {
            if (AvatarSource.avatar) {
                  deleteAvatar.mutate()
                  return
            }
            dispatch(
                  dispatch(
                        addOneToastWarning({
                              toast_item: {
                                    _id: Math.random().toString(),
                                    type: 'WARNING',
                                    core: {
                                          message: 'Không thể xóa avatar mặc định',
                                    },
                                    toast_title: 'Không thể thực hiện ',
                              },
                        }),
                  ),
            )
      }

      useEffect(() => {
            if (deleteAvatar.isSuccess) {
                  modeDispatch({ type: 'CLOSE_MODE_AVATAR_DELETE', payload: { modeAvatarDelete: false, boxModeAvatar: false } })
                  if (ModeParent === 'USER') {
                        onSuccessDelete({ mode: ModeParent, user: (deleteAvatar.data.data.metadata as { user: UserResponse }).user })
                  }
                  if (ModeParent === 'SHOP') {
                        onSuccessDelete({ mode: ModeParent, shop: (deleteAvatar.data.data.metadata as { shop: ShopResponse }).shop })
                  }
            }
      }, [deleteAvatar.isSuccess, dispatch, modeDispatch])

      return (
            <div
                  className='fixed w-full min-h-screen top-0 left-0 flex justify-center items-center bg-[rgba(0,0,0,.7)] z-[11]'
                  onClick={() => {
                        modeDispatch({ type: 'CLOSE_MODE_AVATAR_DELETE', payload: { modeAvatarDelete: false, boxModeAvatar: false } })
                  }}
            >
                  <div
                        className='w-[400px] h-[150px] p-[16px] bg-white rounded-lg shadow-2xl flex flex-col gap-[12px]'
                        onClick={(e) => e.stopPropagation()}
                  >
                        <p>Bạn có chắc muốn xóa bỏ ảnh đại diện ?</p>
                        <p>Hình ảnh đại diện sẽ quay về mặc định của Tiki</p>
                        <div className='flex justify-end gap-[10px] mt-[12px]'>
                              <button
                                    className='px-[8px] py-[4px] rounded-md border-[1px] border-blue-400 text-blue-400 w-[40px] flex justify-center items-center'
                                    onClick={handleCancelActionDelete}
                              >
                                    Hủy
                              </button>
                              <button
                                    className='px-[8px] py-[4px] rounded-md bg-blue-400 w-[70px] flex justify-center items-center text-white'
                                    onClick={handleDeleteAvatar}
                              >
                                    Xóa bỏ
                              </button>
                        </div>
                  </div>
            </div>
      )
}

export default ModelAvatarDelete
