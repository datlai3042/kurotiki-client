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
import { checkAxiosError } from '../../utils/handleAxiosError'
import { addOneToastError, addOneToastSuccess, addOneToastWarning } from '../../Redux/toast'
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
                  dispatch(addOneToastSuccess({
                        
                              toast_item: {
                                    type: 'SUCCESS',
                                    core: { message: 'Đăng kí thành công' },
                                    _id: Math.random().toString(),
                                    toast_title: 'Thành công',
                              },

                  }))
                  dispatch(doCloseBoxLogin())
            },

            onError: (error: unknown) => {
                  if (checkAxiosError<{ code: number; detail: string; message: string }>(error)) {
                        if (
                              error.response?.data.code === 400 &&
                              error.response.data.detail === 'Email đã được đăng kí' &&
                              error.response.data.message === 'Bad Request'
                        ) {
                              dispatch(addOneToastError({toast_item: 
                                    { _id: Math.random().toString(), type: 'ERROR', core: {
                                          message: error.response.data.detail

                                    }, toast_title: 'Có lỗi xảy ra' }

                              }))
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
            console.log('data', data)
            authRegister.mutate(data)
      }

      useEffect(() => {
            if (Object.keys(errors).length > 0) {
                  const subMessage: string[] = []
                  Object.keys(errors).map((key) => {
                        subMessage.push(`Field ${key} đã xảy ra lỗi, vui lòng ${errors[key as keyof TRegisterZodSchema]?.message}`)
                  })

                  dispatch(addOneToastWarning({
                        toast_item: {
                              type: 'WARNING',
                              core: { message:subMessage.join(' - ') },
                              _id: Math.random().toString(),
                              toast_title: 'Có lỗi xảy ra',
                        },
                  }))

            }
      }, [errors, dispatch])

      console.log({ errors })

      return (
            <div className='flex flex-col items-center gap-[15px] py-[35px]'>
                  <h3 className={`text-slate-900 font-black tracking-[5px] text-[24px]`}>Đăng kí</h3>
                  <h4 className={`text-stone-600 italic text-[16px] opacity-80 px-[12px]`}>Đăng kí để cùng trải nghiệm cảm giác mua sắm</h4>
                  <form className='flex flex-1 flex-col gap-[20px] mt-[12px] w-[70%]' onSubmit={handleSubmit(onSubmit)}>
                        <div className='w-full'>
                              <input
                                    {...register('email')}
                                    type='text'
                                    className={`h-[42px] w-full border-[1px]  outline-none px-[12px] py-[4px] rounded-md border-slate-900 placeholder:text-stone-500  `}
                                    placeholder='Nhập email của bạn'
                              />
                        </div>

                        <div className='w-full relative flex items-center'>
                              <input
                                    {...register('password')}
                                    type={typePassword}
                                    className={`h-[42px] w-full border-[1px]  outline-none px-[12px] py-[4px] rounded-md border-slate-900 placeholder:text-stone-500`}
                                    placeholder='Nhập mật khẩu của bạn'
                              />
                              <span className='absolute right-[5px]' onClick={handleShowHidePassword}>
                                    {typePassword === 'text' ? (
                                          <EyeOff size={'20px'} color={'black'} />
                                    ) : (
                                          <Eye size={'20px'} color={'black'} />
                                    )}
                              </span>
                        </div>

                        <div className='w-full relative flex items-center'>
                              <input
                                    {...register('confirm_password')}
                                    type={typeConfirmPassword}
                                    className={`h-[42px] w-full border-[1px]  outline-none px-[12px] py-[4px] rounded-md border-slate-900 placeholder:text-stone-500`}
                                    placeholder='Xác nhận lại mật khẩu'
                              />
                              <span className='absolute right-[5px]  ' onClick={handleShowHidePasswordConfirm}>
                                    {typeConfirmPassword === 'text' ? (
                                          <EyeOff size={'20px'} color={'black'} />
                                    ) : (
                                          <Eye size={'20px'} color={'black'} />
                                    )}
                              </span>
                        </div>

                        <div className=''>
                              <p>
                                    Bạn đã có tài khoản, {''}
                                    <span className='underline text-slate-900 hover:cursor-pointer' onClick={() => setModeAuth('Login')}>
                                          quay lại đăng nhập
                                    </span>
                              </p>
                        </div>
                        <div className='w-full'>
                              <button
                                    onClick={() => console.log('click')}
                                    type='submit'
                                    className='flex justify-center items-center gap-[8px] w-full h-[60px] rounded-lg bg-slate-900 text-white disabled:opacity-50 disabled:cursor-not-allowed'
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
