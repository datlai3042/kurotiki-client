import React, { SetStateAction, useEffect, useState } from 'react'
import { TModeAuth } from './AuthWrapper'
import { Eye, EyeOff, ShieldX } from 'lucide-react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import Auth from '../../apis/auth.api'
import { useDispatch } from 'react-redux'
import { doCloseBoxLogin, fetchUser } from '../../Redux/authenticationSlice'
import { addToast } from '../../Redux/toast'
import { checkAxiosError } from '../../utils/handleAxiosError'
type TProps = {
      setModeAuth: React.Dispatch<SetStateAction<TModeAuth>>
}

const registerSchema = z
      .object({
            email: z
                  .string()
                  .min(1, { message: 'Email là bắt buộc' })
                  .email({ message: 'Email không hợp lệ' })
                  .max(50, { message: 'Giới hạn 50 kí tự' }),
            password: z.string().min(1, { message: 'Mật khẩu là bắt buộc' }).max(50, { message: 'Tối đa 50 kí tự' }),
            confirm_password: z.string().min(1, { message: 'Xác thực mật khẩu là bắt buộc' }).max(50, { message: 'Tối đa 50 kí tự' }),
      })
      .refine((form) => form.password === form.confirm_password, {
            message: 'Mật khẩu không khớp',
            path: ['confirm_password'],
      })

type TRegisterZodSchema = z.infer<typeof registerSchema>
const defaultValues: TRegisterZodSchema = {
      email: '',
      password: '',
      confirm_password: '',
}

const AuthRegister = (props: TProps) => {
      //Mode auth => Login | register
      const { setModeAuth } = props
      const dispatch = useDispatch()

      //react hooks form
      const {
            handleSubmit,
            register,
            formState: { errors },
      } = useForm<TRegisterZodSchema>({
            defaultValues,
            resolver: zodResolver(registerSchema),
      })

      const authRegister = useMutation({
            mutationKey: ['register'],
            mutationFn: (data: Omit<TRegisterZodSchema, 'confirm_password'>) => Auth.register(data),
            onSuccess: (res) => {
                  dispatch(fetchUser({ user: res.data.metadata.user }))
                  dispatch(addToast({ type: 'SUCCESS', message: 'Welcome các bạn đến với project của mình', id: Math.random().toString() }))
                  dispatch(doCloseBoxLogin())
            },

            onError: (error: unknown) => {
                  if (checkAxiosError<{ code: number; detail: string; message: string }>(error)) {
                        if (
                              error.response?.data.code === 400 &&
                              error.response.data.detail === 'Email đã được đăng kí' &&
                              error.response.data.message === 'Bad Request'
                        ) {
                              dispatch(addToast({ id: Math.random().toString(), type: 'ERROR', message: error.response.data.detail }))
                        }
                  }
            },
      })

      //type input
      const [typePassword, setTypePassword] = useState<'password' | 'text'>('password')
      const [typeConfirmPassword, setTypeConfirmPassword] = useState<'password' | 'text'>('password')

      //change type
      const handleShowHidePassword = () => {
            if (typePassword === 'password') {
                  setTypePassword('text')
                  return
            } else {
                  setTypePassword('password')
            }
      }

      const handleShowHidePasswordConfirm = () => {
            if (typeConfirmPassword === 'password') {
                  setTypeConfirmPassword('text')
                  return
            } else {
                  setTypeConfirmPassword('password')
            }
      }

      const onSubmit = (data: TRegisterZodSchema) => {
            authRegister.mutate(data)
      }

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
            <div className=' flex flex-col rounded-md items-center gap-[24px] px-[24px] py-[48px] min-w-[550px] bg-[#fff] text-[#000]'>
                  <div className='mb- w-full text-left'>
                        <h1 className='text-3xl font-black text-[#040404] mb-1'>Welcome To</h1>
                        <h2 className='text-3xl font-black text-blue-900'>KuroTiki</h2>
                  </div>
                  <form className='flex flex-1 flex-col gap-[26px] mt-[12px] w-full' noValidate onSubmit={handleSubmit(onSubmit)}>
                        <div className='w-full flex flex-col items-start gap-[8px]'>
                              <label htmlFor='email' className='block text-sm font-black text-gray-700'>
                                    Email
                              </label>
                              <input
                                    {...register('email')}
                                    id='email'
                                    type='text'
                                    className={`h-[36px] w-full border-[1px]  outline-none px-[12px] py-[4px] rounded-[3px]  placeholder:text-stone-500  inputCommon`}
                                    placeholder='Email'
                              />
                        </div>
                        <div className='w-full flex flex-col items-start gap-[8px]'>
                              <label htmlFor='password' className='block text-sm font-black text-gray-700'>
                                    Mật khẩu
                              </label>
                              <div className='w-full relative flex flex-col items-start gap-[8px]'>
                                    <input
                                          {...register('password')}
                                          id='password'
                                          type={typePassword}
                                          className={`h-[36px] w-full border-[1px]  outline-none px-[12px] py-[4px] rounded-[3px]  placeholder:text-stone-500 inputCommon`}
                                          placeholder='Mật khẩu'
                                    />
                                    <span className='absolute right-[5px] top-[50%] translate-y-[-50%]' onClick={handleShowHidePassword}>
                                          {typePassword === 'text' ? <EyeOff size={'20px'} /> : <Eye size={'20px'} />}
                                    </span>
                              </div>
                        </div>
                        <div className='w-full flex flex-col items-start gap-[8px]'>
                              <label htmlFor='confirm_password' className='block text-sm font-black text-gray-700'>
                                    Xác nhận mật khẩu
                              </label>
                              <div className='w-full relative flex flex-col items-start gap-[8px]'>
                                    <input
                                          {...register('confirm_password')}
                                          id='confirm_password'
                                          type={typeConfirmPassword}
                                          className={`h-[36px] w-full border-[1px]  outline-none px-[12px] py-[4px] rounded-[3px]  placeholder:text-stone-500 inputCommon`}
                                          placeholder='Xác nhận lại mật khẩu'
                                    />
                                    <span className='absolute right-[5px]  top-[50%] translate-y-[-50%] ' onClick={handleShowHidePasswordConfirm}>
                                          {typeConfirmPassword === 'text' ? <EyeOff size={'20px'} /> : <Eye size={'20px'} />}
                                    </span>
                              </div>
                        </div>

                        <div className='w-full flex justify-start '>
                              <p>
                                    Bạn đã có tài khoản, {''}
                                    <span
                                          className='underline text-color-main cursor-pointer text-[15px] font-extrabold'
                                          onClick={() => setModeAuth('Login')}
                                    >
                                          quay lại đăng nhập
                                    </span>
                              </p>
                        </div>
                        <div className='w-full'>
                              <button
                                    type='submit'
                                    className='flex justify-center items-center gap-[8px] w-full min-h-[20px] p-[10px] rounded-[4px] bg-color-main text-white disabled:opacity-40 disabled:cursor-not-allowed'
                                    disabled={!authRegister.isPending && Object.keys(errors).length > 0}
                                    title={Object.keys(errors).length > 0 ? 'Vui lòng nhập thông tin hợp lệ' : `Đăng nhập`}
                              >
                                    <span>Đăng kí</span>
                                    {authRegister.isPending && (
                                          <span
                                                className=' inline-block h-[25px] w-[25px] text-[#ffffff] animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]'
                                                role='status'
                                          ></span>
                                    )}
                              </button>
                        </div>
                  </form>
            </div>
      )
}

export default AuthRegister
