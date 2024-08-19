import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { SetStateAction, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import BoxLoading from '../../../component/BoxUi/BoxLoading'
import { useDispatch, useSelector } from 'react-redux'
import { useMutation } from '@tanstack/react-query'
import AccountService from '../../../apis/account.service'
import { fetchUser } from '../../../Redux/authenticationSlice'
import { checkAxiosError } from '../../../utils/handleAxiosError'
import TErrorAxios from '../../../types/axios.response.error'
import { addOneToastError, addOneToastSuccess, addOneToastWarning } from '../../../Redux/toast'
import { RootState } from '@/src/store'
import { UserResponse } from '@/src/types/user.type'

// () => api

const updatePasswordSchema = z
      .object({
            password: z.string().min(1, { message: 'Mật khẩu hiện tại là bắt buộc' }).max(50, { message: 'Tối đa 50 kí tự' }),
            new_password: z.string().min(1, { message: 'Mật khẩu là bắt buộc' }).max(50, { message: 'Tối đa 50 kí tự' }),
            new_confirm_password: z.string().min(1, { message: 'Xác thực mật khẩu là bắt buộc' }).max(50, { message: 'Tối đa 50 kí tự' }),
      })
      .refine((form) => form.new_password === form.new_confirm_password, {
            message: 'Mật khẩu không khớp',
            path: ['new_confirm_password'],
      })

type TRegisterZodSchema = z.infer<typeof updatePasswordSchema>
const defaultValues: TRegisterZodSchema = {
      password: '',
      new_password: '',
      new_confirm_password: '',
}

const CustomerUpdatePassword = () => {
      const [showPassword, setShowPassword] = useState<'text' | 'password'>('password')
      const [showNewPassword, setShowNewPassword] = useState<'text' | 'password'>('password')
      const [showNewConfirmPassword, setShowNewConfirmPassword] = useState<'text' | 'password'>('password')

      const user = useSelector((state: RootState) => state.authentication.user) as UserResponse

      const dispatch = useDispatch()

      const {
            register,
            handleSubmit,
            formState: { errors },
      } = useForm({
            defaultValues,
            resolver: zodResolver(updatePasswordSchema),
      })

      const handleShowHidePassword = (type: 'text' | 'password', setType: React.Dispatch<SetStateAction<'text' | 'password'>>) => {
            if (type === 'password') {
                  setType('text')
                  return
            } else {
                  setType('password')
            }
      }

      const onSubmit = (form: TRegisterZodSchema) => {
            const { password, new_password } = form



            if (user) {
                  const { roles } = user
                  if (roles.includes('admin')) {
                        dispatch(
                              addOneToastError({
                                    toast_item: {
                                          type: 'ERROR',
                                          core: { message: 'Quyền admin hiện không khả dụng' },
                                          _id: Math.random().toString(),
                                          toast_title: 'Có lỗi xảy ra',
                                    },
                              }),
                        )
                  } else {
                        updatePasswordMutation.mutate({ password, newPassword: new_password })
                  }
                  
            }
      }

      const updatePasswordMutation = useMutation({
            mutationKey: ['/v1/api/account/update-password'],
            mutationFn: ({ password, newPassword }: { password: string; newPassword: string }) =>
                  AccountService.updatePassword({ password, newPassword }),
            onSuccess: (axiosResponse) => {
                  const { message, user } = axiosResponse.data.metadata
                  if (message) {
                        dispatch(fetchUser({ user }))
                        dispatch(
                              addOneToastSuccess({
                                    toast_item: {
                                          type: 'SUCCESS',
                                          core: { message: 'Cập nhập mật khẩu thành công' },
                                          _id: Math.random().toString(),
                                          toast_title: 'Thành công',
                                    },
                              }),
                        )
                  }
            },

            onError: (error) => {
                  if (checkAxiosError<TErrorAxios>(error)) {
                        if (error?.response?.status === 404 && error?.response?.statusText === 'Not Found') {
                              const detail = error.response.data?.detail

                              dispatch(
                                    addOneToastWarning({
                                          toast_item: {
                                                _id: Math.random().toString(),
                                                type: 'WARNING',
                                                core: {
                                                      message: detail || 'Đã có lỗi xảy ra',
                                                },
                                                toast_title: 'Thiếu thông tin ',
                                          },
                                    }),
                              )
                              return
                        }

                        if (error?.response?.status === 400 && error?.response?.statusText === 'Bad Request') {
                              const detail = error.response.data?.detail

                              dispatch(
                                    addOneToastWarning({
                                          toast_item: {
                                                _id: Math.random().toString(),
                                                type: 'WARNING',
                                                core: {
                                                      message: detail || 'Đã có lỗi xảy ra',
                                                },
                                                toast_title: 'Thiếu thông tin ',
                                          },
                                    }),
                              )
                              return
                        }
                  }
            },
      })

      useEffect(() => {
            if (Object.keys(errors).length > 0) {
                  const subMessage: string[] = []
                  Object.keys(errors).map((key) => {
                        subMessage.push(`Field ${key} đã xảy ra lỗi, vui lòng ${errors[key as keyof TRegisterZodSchema]?.message}`)
                  })

                  dispatch(
                        addOneToastWarning({
                              toast_item: {
                                    _id: Math.random().toString(),
                                    type: 'WARNING',
                                    core: {
                                          message: subMessage.join(' - '),
                                    },
                                    toast_title: 'Thiếu thông tin ',
                              },
                        }),
                  )

            }
      }, [errors, dispatch])

      return (
            <div className='w-full min-h-[360px] h-max bg-[#ffffff] rounded  flex items-center justify-center py-[30px] '>
                  <form
                        className='flex flex-col gap-[16px]  min-w-[150px] xl:min-w-[400px] xl:min-h-[150px] h-max max-w-auto  p-[24px] rounded-sm  shadow-2xl border-[1px] border-slate-100 bg-[#ffffff]'
                        onSubmit={handleSubmit(onSubmit)}
                  >
                        <div className='h-[25%] flex flex-col gap-[4px]'>
                              <label htmlFor='password'>Mật khẩu hiện tại</label>
                              <div
                                    className='w-full h-[50px] max-w-auto group flex gap-[10px] px-[18px] py-[2px] items-center border-[1px] border-blue-700 rounded'
                                    tabIndex={0}
                              >
                                    <input
                                          {...register('password')}
                                          className='w-full max-w-auto border-none h-full outline-none py-[8px]'
                                          type={showPassword}
                                          id='password'
                                          placeholder='Nhập mật khẩu hiện tại'
                                    />
                                    <div
                                          className='icon w-[15px] h-[15px]'
                                          onClick={() => handleShowHidePassword(showPassword, setShowPassword)}
                                    >
                                          {showPassword === 'text' ? (
                                                <EyeOff size={'20px'} color={errors.password ? 'red' : 'black'} />
                                          ) : (
                                                <Eye size={'20px'} color={errors.password ? 'red' : 'black'} />
                                          )}
                                    </div>
                              </div>
                        </div>

                        <div className='h-[25%] flex flex-col gap-[4px]'>
                              <label htmlFor='new_password'>Nhập mật khẩu mới</label>
                              <div
                                    className='w-full h-[50px] max-w-auto group flex gap-[10px] px-[18px] py-[2px] items-center border-[1px] border-blue-700 rounded'
                                    tabIndex={0}
                              >
                                    <input
                                          {...register('new_password')}
                                          type={showNewPassword}
                                          id='new_password'
                                          placeholder='Nhập mật khẩu mới'
                                          className='w-full max-w-auto border-none h-full outline-none py-[8px]'
                                    />
                                    <div
                                          className='icon w-[15px] h-[15px]'
                                          onClick={() => handleShowHidePassword(showNewPassword, setShowNewPassword)}
                                    >
                                          {showNewPassword === 'text' ? (
                                                <EyeOff size={'20px'} color={errors.password ? 'red' : 'black'} />
                                          ) : (
                                                <Eye size={'20px'} color={errors.password ? 'red' : 'black'} />
                                          )}
                                    </div>
                              </div>
                              <span className='text-[11px] text-stone-600'>Mật khẩu phải dài từ 8 đến 32 ký tự, bao gồm chữ và số</span>
                        </div>

                        <div className='h-[25%] flex flex-col gap-[4px]'>
                              <label htmlFor='confirm_password'>Nhập lại mật khẩu mới</label>
                              <div
                                    className='w-full h-[50px] max-w-auto group flex gap-[10px] px-[18px] py-[2px] items-center border-[1px] border-blue-700 rounded'
                                    tabIndex={0}
                              >
                                    <input
                                          {...register('new_confirm_password')}
                                          type={showNewConfirmPassword}
                                          id='confirm_password'
                                          placeholder='Nhập lại mật khẩu mới'
                                          className='w-full max-w-auto border-none h-full outline-none py-[8px]'
                                    />
                                    <div
                                          className='icon w-[15px] h-[15px'
                                          onClick={() => handleShowHidePassword(showNewConfirmPassword, setShowNewConfirmPassword)}
                                    >
                                          {showNewConfirmPassword === 'text' ? (
                                                <EyeOff size={'20px'} color={errors.new_confirm_password ? 'red' : 'black'} />
                                          ) : (
                                                <Eye size={'20px'} color={errors.new_confirm_password ? 'red' : 'black'} />
                                          )}
                                    </div>
                              </div>
                              <span className='text-[11px] text-stone-600'>Mật khẩu phải dài từ 8 đến 32 ký tự, bao gồm chữ và số</span>
                        </div>
                        <button
                              type='submit'
                              className='w-full h-[45px] flex items-center justify-center gap-[14px] bg-blue-700 text-white rounded-md'
                        >
                              <span>Lưu thay đổi</span>
                              {updatePasswordMutation.isPending && <BoxLoading />}
                        </button>
                  </form>
            </div>
      )
}

export default CustomerUpdatePassword
