import { useMutation } from '@tanstack/react-query'
import { Eye, Image, Pencil, Trash2 } from 'lucide-react'
import React, { useEffect, useReducer, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AccountService from '../../../apis/account.service'
import Portal from '../../../component/Portal'
import { customerAccountReducer, initialValue } from '../../../reducer/customer.reducer'
import { fetchUser } from '../../../Redux/authenticationSlice'
import { RootState } from '../../../store'
import { ShopResponse } from '../../../types/shop.type'
import { UserResponse } from '../../../types/user.type'
import ModelAvatarDelete from '../models/ModelAvatarDelete'
import ModelAvatarSee from '../models/ModelAvatarSee'
import ModelAvatarUpdate from '../models/ModelAvatarUpdate'

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
                        //console.log(([^)]+))
                        if (refModelAvatar.current) {
                              //console.log(([^)]+))
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
            modeDispatch({ type: 'OPEN_MODE_AVATAR_SEE', payload: { modeAvatarSee: true } })
      }

      const handleControllmodelAvatarUpdate = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
            e.stopPropagation()
            modeDispatch({ type: 'OPEN_MODE_AVATAR_UPDATE', payload: { modeAvatarUpdate: true } })
      }

      const handleControllmodelAvatarDelete = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
            e.stopPropagation()
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
                  className={`${styleEffect.widthImage}  ${styleEffect.heightImage} flex  items-center justify-center  rounded-full mb-[15px]`}
                  onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                        e.stopPropagation()
                        modeDispatch({ type: 'OPEN_BOX_AVATAR', payload: { boxModeAvatar: true } })
                  }}
            >
                  <div className='relative'>
                        <img
                              src={AvatartSource?.avatar || AvatartSource.avatar_default || ''}
                              alt='user_avatar'
                              className={`${styleEffect.widthImage} ${styleEffect.heightImage} rounded-full border-[4px] border-cyan-200 `}
                        />

                        <div className='absolute bottom-[10px] right-[4px] w-[20px] h-[20px] bg-slate-500 rounded-full flex items-center justify-center'>
                              <Pencil className=' text-white' size={12} />
                        </div>

                        {/* @box avatar action*/}
                        {state.boxModeAvatar && (
                              <>
                                    <div
                                          className='absolute z-[10] top-[70%] left-[50%] translate-x-[-50%]  shadow-2xl shadow-blue-700 bg-white rounded-md w-[250px] h-[150px] max-h-auto '
                                          ref={refModelAvatar}
                                    >
                                          <div className='relative z-[500]'>
                                                <span className='clip-path-modelAvatar absolute w-[20px] h-[13.5px] border-[1px] border-stone-300 border-b-0  bg-white top-[-13px] left-[50%] translate-x-[-50%]'></span>
                                                {/* @ list avatar action*/}
                                                <ul className='h-full'>
                                                      {/* @ modeAvater::see */}
                                                      <li
                                                            className='flex items-center w-full h-[50px] px-[20px] hover:bg-sky-100 gap-[8px]'
                                                            onClick={handleControllmodelAvatarSee}
                                                      >
                                                            {/* <img src='' alt='' /> */}
                                                            <Image />
                                                            <span>Xem ảnh đại diện</span>
                                                      </li>

                                                      {/* @ modeAvatar::update */}
                                                      <li
                                                            className='flex items-center w-full h-[50px] px-[20px] hover:bg-sky-100 gap-[8px]'
                                                            onClick={handleControllmodelAvatarUpdate}
                                                      >
                                                            <Eye />
                                                            <span>Cập nhập ảnh đại diện</span>
                                                      </li>
                                                      {/* @ modeAvater::delete*/}
                                                      <li
                                                            className='flex items-center w-full h-[50px] px-[20px] hover:bg-sky-100 gap-[8px]'
                                                            onClick={handleControllmodelAvatarDelete}
                                                      >
                                                            <Trash2 />
                                                            <span>Xóa ảnh đại diện</span>
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
