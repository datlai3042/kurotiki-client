import React, { SetStateAction, useEffect, useRef, useState } from 'react'
import { TModeAuth } from './AuthWrapper'
import { Eye, EyeOff, ShieldX } from 'lucide-react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Auth from '../../apis/auth.api'
import { useDispatch } from 'react-redux'
import { checkAxiosError } from '../../utils/handleAxiosError'
import TErrorAxios from '../../types/axios.response.error'
import {  fetchUser } from '../../Redux/authenticationSlice'
import { addToast } from '../../Redux/toast'
import BoxLoading from '../BoxUi/BoxLoading'
import { doCloseBoxLogin } from '../../Redux/authSlice'

type TProps = {
      setModeAuth: React.Dispatch<SetStateAction<TModeAuth>>
}

type TFormLogin = {
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

type TloginZodSchema = z.infer<typeof loginSchema>

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
            <div className=' flex flex-col items-center gap-[15px] py-[35px]'>
                  <h3 className={`text-slate-900 font-black tracking-[5px] text-[24px]`}>Login</h3>
                  <h4 className={`text-stone-600 italic text-[16px] opacity-80 px-[12px]`}>Đăng nhập để trải nghiệm mua sắm thỏa thích</h4>
                  <form className='flex flex-1 flex-col gap-[20px] mt-[12px] w-[70%]' noValidate onSubmit={handleSubmit(onSubmit)}>
                        <div className='w-full flex flex-col gap-[16px]'>
                              <input
                                    {...register('email')}
                                    type='text'
                                    className={`h-[36px] w-full border-[1px]  outline-none px-[12px] py-[4px] rounded-[3px] border-slate-900 placeholder:text-stone-500  `}
                                    placeholder='Email'
                              />
                        </div>
                        <div className='w-full relative flex items-center'>
                              <input
                                    {...register('password')}
                                    type={typePassword}
                                    className={`h-[36px] w-full border-[1px]  outline-none px-[12px] py-[4px] rounded-[3px] border-slate-900 placeholder:text-stone-500 `}
                                    placeholder='Mật khẩu'
                              />
                              <span className='absolute right-[5px]' onClick={handleShowHidePassword}>
                                    {typePassword === 'text' ? (
                                          <EyeOff size={'20px'} color={'black'} />
                                    ) : (
                                          <Eye size={'20px'} color={'black'} />
                                    )}
                              </span>
                        </div>

                        <div className=''>
                              <p>
                                    Bạn chưa có tài khoản,{' '}
                                    <span className='underline text-slate-900' onClick={() => setModeAuth('Register')}>
                                          đăng kí nhé
                                    </span>
                              </p>
                        </div>
                        <button
                              type='submit'
                              className='flex justify-center items-center gap-[8px] w-full h-[60px] rounded-lg bg-slate-900 text-white disabled:opacity-40 disabled:cursor-not-allowed'
                              disabled={authLogin.isPending && Object.keys(errors).length > 0}
                              title={Object.keys(errors).length > 0 ? 'Vui lòng nhập thông tin hợp lệ' : `Đăng nhập`}
                        >
                              <span>Login</span>
                              {authLogin.isPending && <BoxLoading />}
                        </button>
                  </form>
            </div>
      )
}

export default AuthLogin
