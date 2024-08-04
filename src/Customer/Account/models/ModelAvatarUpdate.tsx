import { UseMutationResult, useMutation } from '@tanstack/react-query'
import { X } from 'lucide-react'
import React, { SetStateAction, useEffect, useRef, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { TAvatarActions } from '../../../reducer/customer.reducer'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../store'
import { fetchUser } from '../../../Redux/authenticationSlice'
import { AxiosResponse } from 'axios'
import { addOneToastSuccess } from '../../../Redux/toast'

//@props
type TProps = {
      setModelAvatarUpdate?: React.Dispatch<SetStateAction<boolean>>
      setModelAvatar?: React.Dispatch<SetStateAction<boolean>>
      modeDispatch: React.Dispatch<TAvatarActions>
      onUpdate: UseMutationResult<AxiosResponse<any, any>, Error, any, unknown>
}

type TForm = {
      file: any
}

//@component::api
const ModelAvatarUpdate = (props: TProps) => {
      const dispatch = useDispatch()
      //@props
      const { modeDispatch, onUpdate } = props
      const methods = useForm<TForm>({
            defaultValues: { file: null },
      })

      const form = methods.register('file')

      const user = useSelector((state: RootState) => state.authentication.user)

      const [fileAvatar, setFileAvatar] = useState<File>()
      const [filePreview, setFilePreview] = useState<string | undefined>()
      const inputRef = useRef<HTMLInputElement | null>()

      useEffect(() => {
            if (!fileAvatar) {
                  setFilePreview(undefined)
                  return
            }

            const objectUrl = URL.createObjectURL(fileAvatar)
            setFilePreview(objectUrl)
            console.log(objectUrl)
            // free memory when ever this component is unmounted
            return () => URL.revokeObjectURL(objectUrl)
      }, [fileAvatar])

      useEffect(() => {
            if (onUpdate.isSuccess) {
                  dispatch(fetchUser({ user: onUpdate.data.data.metadata.user }))
                  modeDispatch({ type: 'CLOSE_MODE_AVATAR_UPDATE', payload: { modeAvatarUpdate: false, boxModeAvatar: false } })

                  dispatch(
                        addOneToastSuccess({
                              toast_item: {
                                    type: 'SUCCESS',
                                    core: { message: 'Cập nhập avatar thành công' },
                                    _id: Math.random().toString(),
                                    toast_title: 'Thành công',
                              },
                        }),
                  )
            }
            if (onUpdate.isSuccess && onUpdate.data) {
                  console.log({ onUpdate: onUpdate.data.data.metadata.user })
            }
      }, [onUpdate.isSuccess, modeDispatch, onUpdate.data, dispatch])

      //@closeModel
      const modelControllClose = () => {
            setFileAvatar(undefined)

            if (filePreview) URL.revokeObjectURL(filePreview)
            setFilePreview('')
            modeDispatch({ type: 'CLOSE_MODE_AVATAR_UPDATE', payload: { modeAvatarUpdate: false, boxModeAvatar: false } })
      }

      const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.stopPropagation()
            e.preventDefault()
            if (inputRef.current) {
                  inputRef.current.click()
            }
      }

      const handleUploadAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (filePreview || fileAvatar) {
                  setFilePreview(undefined)
                  setFileAvatar(undefined)
            }

            console.log(e.target.files)
            if (e.target.files) {
                  setFileAvatar(e.target.files[0])
            }
      }

      const onSubmit: SubmitHandler<TForm> = (file) => {
            console.log(file, fileAvatar)
            // console.log('link', URL.createObjectURL(file.file[0].name))
            const formData: any = new FormData()
            formData.append('file', fileAvatar)
            formData.append('user', user)

            console.log('dirty', methods)
            onUpdate.mutate(formData)
      }

      //@element
      return (
            <div
                  className='fixed top-0 left-0 px-[25px] lg:mx-0 bg-[rgba(0,0,0,.7)] w-full min-h-screen z-[500] flex items-center justify-center'
                  onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                        modeDispatch({ type: 'CLOSE_MODE_AVATAR_UPDATE', payload: { modeAvatarUpdate: false, boxModeAvatar: false } })
                  }}
            >
                  <div
                        className={`w-[650px] h-max bg-white rounded-2xl p-[40px] relative`}
                        onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => e.stopPropagation()}
                  >
                        <div className='text-[25px] absolute top-[25px] right-[25px]' onClick={modelControllClose}>
                              <X />
                        </div>
                        <div className='h-[10%] flex items-center mb-[15px]'>Cập nhập ảnh đại diện</div>
                        <div className='h-[1px] bg-stone-100'></div>
                        <form
                              className='h-[85%]'
                              onSubmit={(e) => {
                                    e.stopPropagation()

                                    return methods.handleSubmit(onSubmit)(e)
                              }}
                        >
                              <div
                                    className={`flex flex-col gap-[16px] mt-[25px] bg-stone-100 mb-[25px] p-[20px] items-center justify-center`}
                              >
                                    {filePreview && (
                                          <img
                                                src={filePreview}
                                                width={200}
                                                height={300}
                                                alt='avatar_update'
                                                className='w-[300px] h-[300px]'
                                          />
                                    )}
                                    <button
                                          className='px-[12px] py-[8px] rounded-md text-white bg-blue-700'
                                          onClick={(e) => handleClick(e)}
                                    >
                                          {!filePreview ? 'Chọn ảnh' : 'Chọn lại ảnh khác'}
                                    </button>
                                    <input
                                          type='file'
                                          id='avatar_update'
                                          onChange={(event) => {
                                                handleUploadAvatar(event)
                                                form.onChange(event)
                                          }}
                                          ref={(e) => {
                                                form.ref(e)
                                                inputRef.current = e
                                          }}
                                          hidden
                                    />
                              </div>

                              {filePreview && (
                                    <div className='w-full min-w-[100px] flex gap-[2%]'>
                                          <button
                                                className='w-[49%] px-[12px] py-[6px] bg-stone-200 text-blue-500'
                                                onClick={modelControllClose}
                                          >
                                                Hủy bỏ
                                          </button>
                                          <button
                                                type='submit'
                                                className='w-[49%] px-[12px] py-[6px] bg-blue-500 text-white flex justify-center gap-[8px] items-center'
                                          >
                                                <span>Lưu thay đổi</span>
                                                {onUpdate.isPending && (
                                                      <span
                                                            className='inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]'
                                                            role='status'
                                                      ></span>
                                                )}
                                          </button>
                                    </div>
                              )}
                        </form>
                  </div>
            </div>
      )
}

export default ModelAvatarUpdate
