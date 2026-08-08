import React, { SetStateAction, useEffect, useRef, useState } from 'react'
import { TModeAuth } from './AuthWrapper'
import { LockKeyhole, MailCheck } from 'lucide-react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Auth from '../../apis/auth.api'
import { useDispatch } from 'react-redux'
import { checkAxiosError } from '../../utils/handleAxiosError'
import TErrorAxios from '../../types/axios.response.error'
import { fetchUser } from '../../Redux/authenticationSlice'
import { addToast } from '../../Redux/toast'
import BoxLoading from '../BoxUi/BoxLoading'
import { doCloseBoxLogin } from '../../Redux/authSlice'
import Input from '../input/Input'

type TProps = {
      setModeAuth: React.Dispatch<SetStateAction<TModeAuth>>
}

export type TFormLogin = {
      email: string
      password: string
}

const defaultValues: TFormLogin = {
      email: '',
      password: '',
}

const loginSchema = z.object({
      email: z
            .string()
            .min(1, { message: 'Email là bắt buộc' })
            .email({ message: 'Email không hợp lệ' })
            .max(50, { message: 'Giới hạn 50 kí tự' }),
      password: z.string().min(1, { message: 'Mật khẩu là bắt buộc' }).max(50, { message: 'Tối đa 50 kí tự' }),
})

export type TloginZodSchema = z.infer<typeof loginSchema>

const AuthLogin = (props: TProps) => {
      const { setModeAuth } = props
      const [toast, setShowToast] = useState(false)
      const countRef = useRef(0)
      const [typePassword, setTypePassword] = useState<'password' | 'text'>('password')
      const queryClient = useQueryClient()

      const {
            register,
            handleSubmit,
            formState: { errors },
            watch,
      } = useForm({
            defaultValues,
            resolver: zodResolver(loginSchema),
      })

      useEffect(() => {}, [])
      countRef.current += 1

      const dispatch = useDispatch()

      const authLogin = useMutation({
            mutationKey: ['login'],
            mutationFn: (data: TloginZodSchema) => Auth.login(data),
            onSuccess: (res) => {
                  dispatch(doCloseBoxLogin())
                  dispatch(fetchUser({ user: res.data.metadata.user }))
                  queryClient.invalidateQueries()
            },
            onError: async (error: unknown) => {
                  if (checkAxiosError<TErrorAxios>(error)) {
                        if (
                              error?.response?.status === 404 &&
                              error?.response?.statusText === 'Not Found' &&
                              error?.response?.data?.detail === 'Not found Email'
                        ) {
                              dispatch(
                                    addToast({
                                          id: Math.random().toString(),
                                          message: 'Không tìm thấy thông tin đăng nhập',
                                          type: 'ERROR',
                                    }),
                              )
                        } else {
                              dispatch(
                                    addToast({
                                          id: Math.random().toString(),
                                          message: 'Không tìm thấy thông tin đăng nhập',
                                          type: 'ERROR',
                                    }),
                              )
                        }
                  }
            },
            retry: 1,
      })

      const handleShowHidePassword = () => {
            if (typePassword === 'password') {
                  setTypePassword('text')
                  return
            } else {
                  setTypePassword('password')
            }
      }

      const onSubmit = (form: TFormLogin) => {
            authLogin.mutate(form)
      }

      useEffect(() => {
            if (Object.keys(errors).length > 0) {
                  const subMessage: string[] = []
                  Object.keys(errors).map((key) => {
                        subMessage.push(`Field ${key} đã xảy ra lỗi, vui lòng ${errors[key as keyof TFormLogin]?.message}`)
                  })

                  dispatch(addToast({ id: Math.random().toString(), subMessage, message: 'Error', type: 'WARNNING' }))
            }
      }, [errors, dispatch])

      return (
            <div className='flex w-full flex-col px-6 py-10 sm:px-8 lg:px-10'>
                  <div className='mb-8'>
                        <span className='inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'>
                              Chào mừng trở lại
                        </span>

                        <h1 className='mt-4 text-3xl font-semibold tracking-[-0.03em] text-slate-900 dark:text-white'>
                              Đăng nhập tài khoản
                        </h1>

                        <p className='mt-2 text-sm leading-6 text-slate-500'>
                              Đăng nhập để tiếp tục mua sắm và quản lý tài khoản của bạn.
                        </p>
                  </div>

                  <form
                        className='flex w-full flex-col gap-5'
                        noValidate
                        onSubmit={handleSubmit(onSubmit)}
                  >
                        <Input<TloginZodSchema>
                              FieldKey='email'
                              placeholder='Email'
                              type='email'
                              register={register}
                              error={errors}
                              watch={watch}
                              icon={<MailCheck />}
                        />

                        <Input<TloginZodSchema>
                              FieldKey='password'
                              placeholder='Mật khẩu'
                              type='password'
                              register={register}
                              error={errors}
                              watch={watch}
                              icon={<LockKeyhole />}
                        />

                        <button
                              type='submit'
                              disabled={authLogin.isPending && Object.keys(errors).length > 0}
                              title={Object.keys(errors).length > 0 ? 'Vui lòng nhập thông tin hợp lệ' : 'Đăng nhập'}
                              className='mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(37,99,235,0.22)] transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60'
                        >
                              Đăng nhập
                              {authLogin.isPending && <BoxLoading />}
                        </button>

                        <div className='flex items-center gap-3 py-1'>
                              <div className='h-px flex-1 bg-slate-200 dark:bg-slate-700' />
                              <span className='text-xs text-slate-400'>hoặc</span>
                              <div className='h-px flex-1 bg-slate-200 dark:bg-slate-700' />
                        </div>

                        <button
                              type='button'
                              onClick={() => setModeAuth('Register')}
                              className='h-12 w-full rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-600 dark:border-slate-700 dark:bg-[#121720] dark:text-slate-200'
                        >
                              Tạo tài khoản mới
                        </button>
                  </form>
            </div>
      )
}

export default AuthLogin