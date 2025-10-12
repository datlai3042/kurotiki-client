import React, { SetStateAction, useEffect, useRef, useState } from 'react'
import { TModeAuth } from './AuthWrapper'
import { Eye, EyeOff, LockKeyhole, MailCheck, ShieldX } from 'lucide-react'
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
      //Mode Login | register
      const { setModeAuth } = props
      const [toast, setShowToast] = useState(false)
      const countRef = useRef(0)
      //state type password
      const [typePassword, setTypePassword] = useState<'password' | 'text'>('password')
      const queryClient = useQueryClient()
      //react-hook-form
      const {
            register,
            handleSubmit,
            formState: { errors },
            watch,
      } = useForm<TloginZodSchema>({
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
                  //@[shape] :: error.response.data.error
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

      //change type passsword
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
            <div className=' flex flex-col items-center rounded-md gap-[24px] px-[24px] py-[48px] min-w-[450px] bg-[#fff] text-[#000]'>
                  <div className='mb- w-full flex gap-[4px] text-left gradient-app-name'>
                        <h1 className='text-4xl font-black  mb-1'>Welcome back :)</h1>
                  </div>

                  <form className='flex flex-1 flex-col gap-[16px] mt-[12px] w-full' noValidate onSubmit={handleSubmit(onSubmit)}>
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
                        <div className=' mt-[8px] flex flex-col gap-[13px]'>
                              <div className=' flex gap-[10px]'>
                                    <button
                                          type='submit'
                                          disabled={authLogin.isPending && Object.keys(errors).length > 0}
                                          title={Object.keys(errors).length > 0 ? 'Vui lòng nhập thông tin hợp lệ' : `Đăng nhập`}
                                          className='!w-[150px] font-semibold text-[15px] flex items-center justify-center text-[#fff] gap-[6px] !h-[46px] !bg-[var(--color-main)] !rounded-[999px]'
                                    >
                                          Đăng nhập
                                          {authLogin.isPending && <BoxLoading />}
                                    </button>

                                    <button
                                          onClick={() => setModeAuth('Register')}
                                          className='!bg-background-page-color hover:!bg-[#36a420] border-[1px] !text-[#333] hover:!text-[#fff] hover:border-border-page-color font-semibold text-[15px] !h-[46px]  !rounded-[999px] !w-[150px] '
                                    >
                                          Đăng kí
                                    </button>
                              </div>
                        </div>
                  </form>
            </div>
      )
}

export default AuthLogin
