import React, { SetStateAction, useState } from 'react'
import { UserResponse } from '../../../types/user.type'
import { Eye, EyeOff, FolderKey, X } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { useMutation } from '@tanstack/react-query'
import AccountService from '../../../apis/account.service'
import BoxLoading from '../../../component/BoxUi/BoxLoading'
import { addOneToastError, addOneToastSuccess, addOneToastWarning } from '../../../Redux/toast'

type TProps = {
      onCheck: React.Dispatch<SetStateAction<boolean>>
      user: UserResponse
      onClose: React.Dispatch<SetStateAction<boolean>>
      onGetPassword: React.Dispatch<SetStateAction<string>>
}

const CustomerPasswordSecurity = (props: TProps) => {
      const { user, onCheck, onClose, onGetPassword } = props
      const dispatch = useDispatch()
      const [showPassword, setShowPassword] = useState<'text' | 'password'>('password')

      const [password, setPassword] = useState<string>('')

      const handleShowHidePassword = (type: 'text' | 'password') => {
            type === 'password' ? setShowPassword('text') : setShowPassword('password')
      }

      const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
            setPassword(e.target.value)
      }

      const onSubmit = (e: React.FormEvent) => {
            e.preventDefault()
            if (!password) {
                  dispatch(
                        addOneToastWarning({
                              toast_item: {
                                    _id: Math.random().toString(),
                                    type: 'WARNING',
                                    core: {
                                          message: 'Vui lòng nhập mật khẩu',
                                    },
                                    toast_title: 'Thiếu thông tin ',
                              },
                        }),
                  )
            }

            securiryPasswordMutation.mutate({ password })
      }

      const securiryPasswordMutation = useMutation({
            mutationKey: ['/v1/api/account/check-passwod'],
            mutationFn: ({ password }: { password: string }) => AccountService.securityPassword({ password }),
            onSuccess: (axiosResponse) => {
                  const { message } = axiosResponse.data.metadata
                  if (!message) {
                        dispatch(
                              addOneToastError({
                                    toast_item: {
                                          type: 'ERROR',
                                          _id: Math.random().toString(),
                                          core: {
                                                message: 'Mật khẩu không đúng',
                                          },
                                          toast_title: 'Đã có lỗi xảy ra',
                                    },
                              }),
                        )
                        return
                  }

                  dispatch(
                        addOneToastSuccess({
                              toast_item: {
                                    type: 'SUCCESS',
                                    core: { message: 'Xác thực thành công' },
                                    _id: Math.random().toString(),
                                    toast_title: 'Thành công',
                              },
                        }),
                  )
                  onClose(false)
                  onGetPassword(password)
                  onCheck(message)
                  return
            },
      })

      return (
            <div className='w-full h-full fixed inset-0 bg-[rgba(0,0,0,.75)] z-[500]  flex items-center justify-center'>
                  <form
                        className='animate-runTop relative flex flex-col gap-[16px]  min-w-[150px] xl:min-w-[400px] xl:min-h-[150px] h-max max-w-auto  p-[24px] rounded-sm  shadow-2xl border-[1px] border-slate-100 bg-[#ffffff]'
                        onSubmit={onSubmit}
                  >
                        <label htmlFor='account_email_update' className='[word-spacing:1px] text-[16px] text-black font-medium '>
                              Xác thực mật khẩu
                        </label>

                        <div
                              className='w-full h-[50px] max-w-auto group flex gap-[10px] px-[8px] py-[2px] items-center border-[1px] border-blue-700 rounded'
                              tabIndex={0}
                        >
                              <FolderKey />
                              <input
                                    type={showPassword}
                                    id='password'
                                    placeholder='Nhập mật khẩu hiện tại'
                                    value={password}
                                    className='w-full max-w-auto border-none h-full outline-none py-[8px]'
                                    onChange={onChangeInput}
                              />

                              <button className='icon w-[15px] h-[15px]' onClick={() => handleShowHidePassword(showPassword)}>
                                    {showPassword === 'text' ? (
                                          <EyeOff size={'20px'} color={'black'} />
                                    ) : (
                                          <Eye size={'20px'} color={'black'} />
                                    )}
                              </button>
                        </div>
                        <button
                              type='submit'
                              className='w-full h-[45px] flex items-center justify-center gap-[14px] bg-blue-700 text-white rounded-md'
                        >
                              <span>Lưu thay đổi</span>
                              {securiryPasswordMutation.isPending && <BoxLoading />}
                        </button>

                        <button
                              className='absolute w-[30px] h-[30px] rounded-full bg-blue-700 flex items-center justify-center text-white top-[-15px] right-[-15px] '
                              onClick={() => onClose(false)}
                        >
                              <X className='text-[11px]' />
                        </button>
                  </form>
            </div>
      )
}

export default CustomerPasswordSecurity
