import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { SetStateAction, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import BoxLoading from '../../../component/BoxUi/BoxLoading'
import { useDispatch } from 'react-redux'
import { addToast } from '../../../Redux/toast'
import { useMutation } from '@tanstack/react-query'
import AccountService from '../../../apis/account.service'
import { fetchUser } from '../../../Redux/authenticationSlice'
import { checkAxiosError } from '../../../utils/handleAxiosError'
import TErrorAxios from '../../../types/axios.response.error'

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
            updatePasswordMutation.mutate({ password, newPassword: new_password })
      }

      const updatePasswordMutation = useMutation({
            mutationKey: ['/v1/api/account/update-password'],
            mutationFn: ({ password, newPassword }: { password: string; newPassword: string }) =>
                  AccountService.updatePassword({ password, newPassword }),
            onSuccess: (axiosResponse) => {
                  const { message, user } = axiosResponse.data.metadata
                  if (message) {
                        dispatch(fetchUser({ user }))
                        dispatch(addToast({ id: Math.random().toString(), type: 'SUCCESS', message: 'Cập nhập mật khẩu thành công' }))
                  }
            },

            onError: (error) => {
                  if (checkAxiosError<TErrorAxios>(error)) {
                        if (error?.response?.status === 404 && error?.response?.statusText === 'Not Found') {
                              const detail = error.response.data?.detail
                              dispatch(addToast({ id: Math.random().toString(), message: detail || 'Đã có lỗi xảy ra', type: 'WARNNING' }))
                              return
                        }

                        if (error?.response?.status === 400 && error?.response?.statusText === 'Bad Request') {
                              const detail = error.response.data?.detail
                              dispatch(addToast({ id: Math.random().toString(), message: detail || 'Đã có lỗi xảy ra', type: 'WARNNING' }))
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

                  dispatch(addToast({ id: Math.random().toString(), subMessage, message: 'Error', type: 'WARNNING' }))
            }
      }, [errors, dispatch])

      return (
            <div className='w-full rounded-2xl border border-[var(--border-color-input)] bg-color-section-theme text-text-theme shadow-[0_8px_30px_rgba(15,23,42,0.05)]'>
                  <div className='border-b border-[var(--border-color-input)] px-5 py-4 xl:px-6'>
                        <h2 className='text-lg font-semibold text-text-theme'>Cập nhập mật khẩu</h2>
                        <p className='mt-1 text-sm text-slate-500'>Sử dụng mật khẩu mạnh để tăng cường bảo mật cho tài khoản của bạn.</p>
                  </div>

                  <div className='flex min-h-[520px] items-center justify-center px-4 py-8 xl:px-8'>
                        <form
                              className='w-full max-w-[560px] rounded-2xl border border-[var(--border-color-input)] bg-color-section-theme p-5 shadow-[0_16px_45px_rgba(15,23,42,0.08)] xl:p-6'
                              onSubmit={handleSubmit(onSubmit)}
                        >
                              <div className='mb-5'>
                                    <h3 className='text-base font-semibold text-text-theme'>Đổi mật khẩu</h3>
                                    <p className='mt-1 text-xs leading-5 text-slate-500'>
                                          Mật khẩu mới nên khác với mật khẩu bạn đang sử dụng.
                                    </p>
                              </div>

                              <div className='flex flex-col gap-5'>
                                    <div>
                                          <label htmlFor='password' className='mb-2 block text-sm font-medium text-text-theme'>
                                                Mật khẩu hiện tại
                                          </label>

                                          <div className='flex h-12 items-center rounded-xl border border-[var(--border-color-input)] px-3 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 dark:border-slate-700'>
                                                <input
                                                      {...register('password')}
                                                      className='h-full w-full border-none bg-transparent text-sm text-text-theme outline-none placeholder:text-slate-400'
                                                      type={showPassword}
                                                      id='password'
                                                      placeholder='Nhập mật khẩu hiện tại'
                                                />

                                                <button
                                                      type='button'
                                                      className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-blue-500 dark:hover:bg-slate-800'
                                                      onClick={() => handleShowHidePassword(showPassword, setShowPassword)}
                                                >
                                                      {showPassword === 'text' ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                          </div>
                                    </div>

                                    <div>
                                          <label htmlFor='new_password' className='mb-2 block text-sm font-medium text-text-theme'>
                                                Mật khẩu mới
                                          </label>

                                          <div className='flex h-12 items-center rounded-xl border border-[var(--border-color-input)] px-3 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 dark:border-slate-700'>
                                                <input
                                                      {...register('new_password')}
                                                      type={showNewPassword}
                                                      id='new_password'
                                                      placeholder='Nhập mật khẩu mới'
                                                      className='h-full w-full border-none bg-transparent text-sm text-text-theme outline-none placeholder:text-slate-400'
                                                />

                                                <button
                                                      type='button'
                                                      className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-blue-500 dark:hover:bg-slate-800'
                                                      onClick={() => handleShowHidePassword(showNewPassword, setShowNewPassword)}
                                                >
                                                      {showNewPassword === 'text' ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                          </div>

                                          <p className='mt-2 text-xs leading-5 text-slate-500'>
                                                Mật khẩu phải dài từ 8 đến 32 ký tự, bao gồm chữ và số.
                                          </p>
                                    </div>

                                    <div>
                                          <label htmlFor='confirm_password' className='mb-2 block text-sm font-medium text-text-theme'>
                                                Nhập lại mật khẩu mới
                                          </label>

                                          <div className='flex h-12 items-center rounded-xl border border-[var(--border-color-input)] px-3 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 dark:border-slate-700'>
                                                <input
                                                      {...register('new_confirm_password')}
                                                      type={showNewConfirmPassword}
                                                      id='confirm_password'
                                                      placeholder='Nhập lại mật khẩu mới'
                                                      className='h-full w-full border-none bg-transparent text-sm text-text-theme outline-none placeholder:text-slate-400'
                                                />

                                                <button
                                                      type='button'
                                                      className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-blue-500 dark:hover:bg-slate-800'
                                                      onClick={() =>
                                                            handleShowHidePassword(showNewConfirmPassword, setShowNewConfirmPassword)
                                                      }
                                                >
                                                      {showNewConfirmPassword === 'text' ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                          </div>

                                          <p className='mt-2 text-xs leading-5 text-slate-500'>
                                                Nhập lại chính xác mật khẩu mới để xác nhận.
                                          </p>
                                    </div>
                              </div>

                              <button
                                    type='submit'
                                    className='mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700'
                              >
                                    <span>Lưu thay đổi</span>
                                    {updatePasswordMutation.isPending && <BoxLoading />}
                              </button>
                        </form>
                  </div>
            </div>
      )
}

export default CustomerUpdatePassword
