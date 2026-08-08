import React, { useEffect, useReducer, useRef } from 'react'
import { customerAccountReducer, initialValue } from '../../../reducer/customer.reducer'
import { RootState } from '../../../store'
import { useDispatch, useSelector } from 'react-redux'
import { Camera, Eye, Image, Pencil, Trash2 } from 'lucide-react'
import Portal from '../../../component/Portal'
import ModelAvatarSee from '../models/ModelAvatarSee'
import ModelAvatarUpdate from '../models/ModelAvatarUpdate'
import ModelAvatarDelete from '../models/ModelAvatarDelete'
import { ShopResponse } from '../../../types/shop.type'
import { UserResponse } from '../../../types/user.type'
import { useMutation } from '@tanstack/react-query'
import AccountService from '../../../apis/account.service'
import { fetchUser } from '../../../Redux/authenticationSlice'

type TProps = {
      AvatartSource: {
            avatar: string
            avatar_default: string
      }
      widthImage?: string
      heightImage?: string
      Mode: 'USER' | 'SHOP'
}

const BoxAvatarMode = (props: TProps) => {
      const { AvatartSource, widthImage = 'w-[180px] xl:w-[120px]', heightImage = 'h-[180px] xl:h-[120px]', Mode } = props

      // const user = useSelector((state: RootState) => state.authentication.user)
      const [state, modeDispatch] = useReducer(customerAccountReducer, initialValue)
      const refModelAvatar = useRef<HTMLDivElement>(null)
      const user = useSelector((state: RootState) => state.authentication.user) as UserResponse
      const updateAvatarResponse = useMutation({
            mutationKey: ['update-avatar'],
            mutationFn: (data: any) => AccountService.updateAvatar(data),
      })

      const dispatch = useDispatch()

      useEffect(() => {
            // count.current = count.current += 1
            const handleEvent = (e: MouseEvent) => {
                  // khong click vao thi chay dong script nay
                  if (!refModelAvatar.current?.contains(e.target as Node)) {
                        // console.log('click point', e.target, modelAvatar)
                        if (refModelAvatar.current) {
                              // console.log(1)
                              modeDispatch({ type: 'CLOSE_BOX_AVATAR', payload: { boxModeAvatar: false } })

                              // setModelAvatar((prev) => !prev)
                        }
                  }
            }
            document.addEventListener('click', handleEvent)

            return () => document.removeEventListener('click', handleEvent)
      }, [])

      const handleControllmodelAvatarSee = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
            e.stopPropagation()
            e.preventDefault()
            modeDispatch({ type: 'OPEN_MODE_AVATAR_SEE', payload: { modeAvatarSee: true } })
      }

      const handleControllmodelAvatarUpdate = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
            e.stopPropagation()
            e.preventDefault()

            modeDispatch({ type: 'OPEN_MODE_AVATAR_UPDATE', payload: { modeAvatarUpdate: true } })
      }

      const handleControllmodelAvatarDelete = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
            e.stopPropagation()
            e.preventDefault()

            modeDispatch({ type: 'OPEN_MODE_AVATAR_DELETE', payload: { modeAvatarDelete: true } })
      }

      const onSuccessDelete = (data: { mode: 'USER'; user: UserResponse } | { mode: 'SHOP'; shop: ShopResponse }) => {
            if (data.mode === 'USER') {
                  dispatch(fetchUser({ user: data.user }))
            }
      }

      const styleEffect = {
            widthImage,
            heightImage,
      }

      return (
            <div
                  className={`${styleEffect.widthImage}  ${styleEffect.heightImage} flex-shrink bg-color-section-theme text-text-theme flex  items-center justify-center  rounded-full mb-[15px]`}
                  onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                        e.stopPropagation()
                        modeDispatch({ type: 'OPEN_BOX_AVATAR', payload: { boxModeAvatar: true } })
                  }}
            >
                  <div className='relative'>
                        <div className='relative w-28 h-28 mx-auto md:mx-0 outline-[5px] outline rounded-full outline-[#bad7ffba]'>
                              <div className='rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl'>
                                    <img
                                          src={AvatartSource?.avatar || AvatartSource.avatar_default || ''}
                                          alt='user_avatar'
                                          className={` object-contain rounded-full `}
                                    />
                              </div>
                              <button className='absolute bottom-0 right-0 bg-white border border-gray-200 rounded-full p-1.5 shadow-sm hover:bg-gray-50'>
                                    <Camera size={16} className='text-gray-600' />
                              </button>
                        </div>

                        {/* @box avatar action*/}
                        {state.boxModeAvatar && (
                              <>
                                    <div
                                          className='absolute z-[10] top-[110%] left-[50%] translate-x-[-50%]  shadow-2xl shadow-blue-700 bg-color-section-theme rounded-md w-[224px]  max-h-auto '
                                          ref={refModelAvatar}
                                    >
                                          <div className='relative z-[500]'>
                                                {/* <span className='clip-path-modelAvatar absolute w-[20px] h-[13.5px] border-[1px] border-[var(--border-color-input)] border-b-0  bg-color-section-theme top-[-13px] left-[50%] translate-x-[-50%]'></span> */}
                                                {/* @ list avatar action*/}
                                                <ul className='h-full'>
                                                      {/* @ modeAvater::see */}
                                                      <li
                                                            className='cursor-pointer flex  w-full  p-[7px_16px] hover:bg-color-main hover:text-[#fff] gap-[12px]'
                                                            onClick={handleControllmodelAvatarSee}
                                                      >
                                                            {/* <img src='' alt='' /> */}
                                                            <Image size={20} className='mt-1'/>
                                                            <div className='flex flex-col  gap-[2px] flex-1'>
                                                                  <span className='font-medium'>Xem ảnh đại diện</span>
                                                                  <span className='text-[11px] opacity-80'>Xem ảnh hiện tại</span>
                                                            </div>
                                                      </li>

                                                      {/* @ modeAvatar::update */}
                                                      <li
                                                            className='cursor-pointer flex  w-full  p-[7px_16px] hover:bg-color-main hover:text-[#fff] gap-[12px]'
                                                            onClick={handleControllmodelAvatarUpdate}
                                                      >
                                                            <Eye size={20} className='mt-1'/>

                                                            <div className='flex flex-col  gap-[2px] flex-1'>
                                                                  <span className='font-medium'>Cập nhật ảnh đại diện</span>
                                                                  <span className='text-[11px] opacity-80'>Chọn ảnh mới từ thiết bị</span>
                                                            </div>
                                                      </li>
                                                      {/* @ modeAvater::delete*/}
                                                      <li
                                                            className='cursor-pointer flex  w-full  p-[7px_16px] hover:bg-color-main hover:text-[#fff] gap-[12px]'
                                                            onClick={handleControllmodelAvatarDelete}
                                                      >
                                                            <Trash2 size={20} className='mt-1 text-red-600'/>
                                                            <div className='flex flex-col  gap-[2px] flex-1'>
                                                                  <span className='font-medium'>Xóa ảnh đại diện</span>
                                                                  <span className='text-[11px] opacity-80'>Xóa ảnh và đặt lại mặc định</span>
                                                            </div>
                                                      </li>
                                                </ul>
                                          </div>
                                          {/* @model */}
                                          {/* @model::boxAvatar->see */}
                                          {state.modeAvatarSee && (
                                                <Portal>
                                                      <ModelAvatarSee
                                                            modeDispatch={modeDispatch}
                                                            onFetchAvatarKey='avatar-used'
                                                            AvatarSource={{
                                                                  avatar: user.avatar?.secure_url,
                                                                  avatar_default: user.avatar_url_default,
                                                            }}
                                                            AvatarImageUsed={user.avatar_used}
                                                            onFetchAvatarFn={AccountService.getAllAvatar}
                                                      />
                                                </Portal>
                                          )}
                                          {/* @model::boxAvatar->update */}
                                          {state.modeAvatarUpdate && (
                                                <Portal>
                                                      <ModelAvatarUpdate modeDispatch={modeDispatch} onUpdate={updateAvatarResponse} />
                                                </Portal>
                                          )}
                                          {/* @model::boxAvatar->delete */}
                                          {state.modeAvatarDelete && (
                                                <Portal>
                                                      <ModelAvatarDelete
                                                            modeDispatch={modeDispatch}
                                                            AvatarSource={{
                                                                  avatar: user.avatar?.secure_url,
                                                                  avatar_default: user.avatar_url_default,
                                                            }}
                                                            onDeleteFn={AccountService.deleteAvatar}
                                                            onDeleteKey='delete-avatar'
                                                            onSuccessDelete={onSuccessDelete}
                                                            ModeParent='USER'
                                                      />
                                                </Portal>
                                          )}
                                    </div>
                              </>
                        )}
                  </div>
            </div>
      )
}

export default BoxAvatarMode
